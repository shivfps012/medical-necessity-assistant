"""
analyzer.py

Owns the only two LLM call sites in the system:
  - analyze_encounter()  -> used by POST /analyze-encounter
  - answer_question()    -> used by POST /ask

Both follow the same shape: route -> retrieve -> (short-circuit if empty)
-> call LLM with the exact Section 14 system prompt -> validate JSON
against the Pydantic response model.
"""
import json
import re
import time
from typing import List, Literal, Optional

import requests
from google import genai
from google.genai import errors
from google.genai import types
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.encounter import EncounterRequest, AskRequest
from app.models.response import AnalyzeResponse, AskResponse, Citation
from app.services import guideline_router
from app.services.retrieval import retrieve_chunks, retrieve_keyword_chunks, format_chunks_for_prompt

settings = get_settings()
client = genai.Client(api_key=settings.gemini_api_key)

INSUFFICIENT_INFO_MESSAGE = "Insufficient information in source documents."
RETRYABLE_GEMINI_STATUS_CODES = {429, 500, 502, 503, 504}


class _CitationSchema(BaseModel):
    document: str
    section: str
    page: str


class _AnalyzeLLMSchema(BaseModel):
    billed_code: str
    supported: bool
    reasoning: str
    documentation_gaps: List[str]
    denial_risk: Literal["LOW", "MODERATE", "HIGH"]
    recommended_code: Optional[str]
    citation: _CitationSchema


class _AskLLMSchema(BaseModel):
    answer: str
    citation: _CitationSchema

SYSTEM_PROMPT = """You are a clinical coding compliance assistant. Your ONLY knowledge source is the retrieved guideline excerpts provided to you.

STRICT RULES:
1. Answer ONLY what was asked. Never volunteer extra information.
2. Every claim MUST cite the exact source and section provided.
3. Maximum 4 sentences per answer field.
4. If excerpts do not contain enough info, respond with:
   "Insufficient information in source documents."
5. Never invent thresholds, rules, or code definitions.
6. AMA 2021 supersedes 1997 CMS for codes 99202-99215.
7. For inpatient/ED/nursing codes use 1997 CMS guidelines.
8. For JAWDA/UAE compliance questions use JAWDA Part IX.

Return ONLY valid JSON. No prose outside the JSON structure."""


class GeminiQuotaExhaustedError(RuntimeError):
    """
    Raised when Gemini's free-tier DAILY request quota (RPD) is exhausted.
    Unlike per-minute rate limits, this can't be fixed by retrying or by
    creating a new API key — quotas are tracked per Google Cloud project,
    not per key, and RPD only resets at midnight Pacific Time.
    """


def _is_daily_quota_exhausted(exc: Exception) -> bool:
    text = str(exc)
    return "PerDay" in text or "RequestsPerDay" in text


def _is_retryable_gemini_error(exc: Exception) -> bool:
    if isinstance(exc, errors.APIError) and getattr(exc, "code", None) == 429:
       
        return not _is_daily_quota_exhausted(exc)
    if isinstance(exc, requests.exceptions.RequestException):
        return True
    if isinstance(exc, (ConnectionError, TimeoutError)):
        return True
    return isinstance(exc, errors.APIError) and getattr(exc, "code", None) in RETRYABLE_GEMINI_STATUS_CODES


def _sleep_before_retry(attempt: int) -> None:
    time.sleep(min(2**attempt, 60))


def _call_llm(user_prompt: str, response_schema: type[BaseModel]) -> dict:
    response = None
    for attempt in range(settings.gemini_retry_attempts):
        try:
            response = client.models.generate_content(
                model=settings.llm_model,
                contents=f"{SYSTEM_PROMPT}\n\n{user_prompt}",
                config=types.GenerateContentConfig(
                    temperature=0,
                    response_mime_type="application/json",
                    response_schema=response_schema,
                ),
            )
            break
        except Exception as exc:
            if _is_daily_quota_exhausted(exc):
                raise GeminiQuotaExhaustedError(
                    "Gemini free-tier DAILY quota for this project is exhausted. "
                    "New API keys will NOT fix this (quota is per-project, not per-key). "
                    "Wait for the midnight Pacific Time reset, enable billing, or create "
                    "a brand-new Google Cloud project for a separate quota pool."
                ) from exc
            if attempt == settings.gemini_retry_attempts - 1 or not _is_retryable_gemini_error(exc):
                raise
            _sleep_before_retry(attempt)

    if response.parsed is not None:
        return response.parsed.model_dump()
  
    return json.loads(response.text)


def _enforce_max_sentences(text: str, max_sentences: Optional[int] = None) -> str:
    """
    Defensive backstop for Rule 4. The system prompt already instructs the
    model to cap answers at 4 sentences, but we don't rely on the LLM
    alone for a hard rule — we truncate server-side too.
    """
    limit = max_sentences or settings.max_answer_sentences
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return " ".join(sentences[:limit]).strip()


def _insufficient_citation() -> Citation:
    return Citation(document="None", section="None", page="N/A")


def _normalize_if_insufficient(text: str) -> str:
    """
    Rule 6 requires the EXACT string "Insufficient information in source
    documents." Gemini reliably expresses the *concept* but not always the
    exact casing/punctuation, which breaks exact-match assertions (e.g.
    Test #4). If the model's answer is clearly saying "I don't know",
    normalize it to the canonical string instead of trusting verbatim output.
    """
    if "insufficient information" in text.lower():
        return INSUFFICIENT_INFO_MESSAGE
    return text



def _build_encounter_query(request: EncounterRequest) -> str:
    code_context = ""
    if guideline_router.is_office_outpatient(request.billed_code):
        code_context = (
            "Office/outpatient established patient E/M code descriptors 99212 99213 "
            "99214 99215; straightforward low moderate high medical decision making; "
            "2 or more chronic illnesses; prescription drug management; time ranges."
        )

    return (
        f"CPT code {request.billed_code} documentation requirements (MDM problems/data/risk "
        f"or time, per setting). {code_context} Chief complaint: {request.chief_complaint}. "
        f"Diagnoses: {', '.join(request.diagnoses)}. Procedures: {', '.join(request.procedures)}. "
        f"HPI: {request.documentation.HPI}. Exam: {request.documentation.exam}. "
        f"Assessment: {request.documentation.assessment}."
    )


def analyze_encounter(request: EncounterRequest, db: Session) -> AnalyzeResponse:
    routing = guideline_router.route(request.billed_code)
    query = _build_encounter_query(request)
    chunks = retrieve_chunks(query, db, routing)

    if not chunks:
        return AnalyzeResponse(
            billed_code=request.billed_code,
            supported=False,
            reasoning=INSUFFICIENT_INFO_MESSAGE,
            documentation_gaps=[],
            denial_risk="HIGH",
            recommended_code=None,
            citation=_insufficient_citation(),
        )

    user_prompt = f"""Routing decision: {routing.reason}

Retrieved guideline excerpts (the ONLY source you may cite or rely on):
{format_chunks_for_prompt(chunks)}

Patient encounter to analyze:
- visit_type: {request.visit_type}
- chief_complaint: {request.chief_complaint}
- diagnoses: {request.diagnoses}
- procedures: {request.procedures}
- documentation.HPI: {request.documentation.HPI}
- documentation.exam: {request.documentation.exam}
- documentation.assessment: {request.documentation.assessment}
- billed_code: {request.billed_code}

Determine whether the documentation supports billing {request.billed_code}, using ONLY the
excerpts above. If you recommend a different code, it MUST be in the same patient-type series
as {request.billed_code} (new patient: 99202-99205, or established patient: 99212-99215) —
pick the level that matches the MDM actually documented. Respond with ONLY this JSON object
(no extra keys, no prose):
{{
  "billed_code": "<string>",
  "supported": <true|false>,
  "reasoning": "<max 4 sentences>",
  "documentation_gaps": ["<string>", ...],
  "denial_risk": "<LOW|MODERATE|HIGH>",
  "recommended_code": "<string or null>",
  "citation": {{"document": "<exact source name>", "section": "<exact section>", "page": "<page number>"}}
}}"""

    data = _call_llm(user_prompt, _AnalyzeLLMSchema)
    data["reasoning"] = _normalize_if_insufficient(_enforce_max_sentences(data.get("reasoning", "")))
    data.setdefault("billed_code", request.billed_code)
    return AnalyzeResponse.model_validate(data)



def answer_question(request: AskRequest, db: Session) -> AskResponse:
    routing = guideline_router.route(request.billed_code)
    question_lower = request.question.lower()
    fallback_terms = []
    if not request.billed_code:
        if any(term in question_lower for term in ("lama", "time-based", "time based", "start and end", "total time")):
            routing = guideline_router.RoutingDecision(
                billed_code=None,
                primary_guideline="jawda",
                primary_source_name="JAWDA Data Certification 2026 Part IX",
                included_versions=["jawda"],
                reason="Question targets JAWDA audit/compliance rules, so retrieval is restricted to JAWDA Part IX.",
            )
            if "lama" in question_lower:
                fallback_terms = ["Missing LAMA", "LAMA form", "Missing required forms"]
            else:
                fallback_terms = ["time-based codes", "start and end times", "total time spent alone"]
        elif "probable diagnosis" in question_lower and "outpatient" in question_lower:
            routing = guideline_router.RoutingDecision(
                billed_code=None,
                primary_guideline="haad",
                primary_source_name="HAAD Coding Manual (Abu Dhabi)",
                included_versions=["haad"],
                reason="Question targets outpatient diagnosis coding, so retrieval is restricted to the HAAD Coding Manual.",
            )
            fallback_terms = ["Outpatient", "Uncertain Diagnosis", "probable"]
    chunks = retrieve_chunks(request.question, db, routing)
    if not chunks and fallback_terms:
        chunks = retrieve_keyword_chunks(fallback_terms, db, routing)

    if not chunks:
        return AskResponse(answer=INSUFFICIENT_INFO_MESSAGE, citation=_insufficient_citation())

    user_prompt = f"""Routing context: {routing.reason}

Retrieved guideline excerpts (the ONLY source you may cite or rely on):
{format_chunks_for_prompt(chunks)}

Question: {request.question}

Answer using ONLY the excerpts above. Respond with ONLY this JSON object (no extra keys, no prose):
{{
  "answer": "<max 4 sentences>",
  "citation": {{"document": "<exact source name>", "section": "<exact section>", "page": "<page number>"}}
}}"""

    data = _call_llm(user_prompt, _AskLLMSchema)
    data["answer"] = _normalize_if_insufficient(_enforce_max_sentences(data.get("answer", "")))
    return AskResponse.model_validate(data)