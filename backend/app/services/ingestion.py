"""
ingestion.py

Parses the five source PDFs, chunks them, embeds the chunks, and stores
them in pgvector with the metadata required for guideline-aware retrieval.

Run via `python scripts/ingest.py` (see that file) — never imported by the
live API request path, only by the one-off ingestion script.
"""
from pathlib import Path
import time
from typing import List, Optional, TypedDict

import pdfplumber
import requests
from google import genai
from google.genai import errors
from google.genai import types
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import DocumentChunk

settings = get_settings()
client = genai.Client(api_key=settings.gemini_api_key)

RETRYABLE_GEMINI_STATUS_CODES = {429, 500, 502, 503, 504}


class DocSpec(TypedDict):
    match: str             
    source: str             
    version: str             
    supersedes: Optional[str]
    applies_to_codes: Optional[List[str]]
    priority: int


DOCUMENT_REGISTRY: List[DocSpec] = [
    {
        "match": "ama",
        "source": "AMA 2021 E/M Guidelines",
        "version": "2021",
        "supersedes": "1997_cms",
        "applies_to_codes": [
            "99202", "99203", "99204", "99205",
            "99212", "99213", "99214", "99215",
        ],
        "priority": 1,
    },
    {
        "match": "jawda",
        "source": "JAWDA Data Certification 2026 Part IX",
        "version": "jawda",
        "supersedes": None,
        "applies_to_codes": None,  
        "priority": 1,
    },
    {
        "match": "coding process",
        "source": "Clinical Coding Process Review (Tasneef/JAWDA)",
        "version": "coding_process",
        "supersedes": None,
        "applies_to_codes": None,
        "priority": 2,
    },
    {
        "match": "1997",
        "source": "1997 CMS E/M Documentation Guidelines",
        "version": "1997",
        "supersedes": None,
        "applies_to_codes": [
            "99221", "99222", "99223", "99231", "99232", "99233",
            "99281", "99282", "99283", "99284", "99285",
            "99304", "99305", "99306", "99307", "99308", "99309", "99310",
            "99241", "99242", "99243", "99244", "99245",
        ],
        "priority": 1,
    },
    {
        "match": "haad",
        "source": "HAAD Coding Manual (Abu Dhabi)",
        "version": "haad",
        "supersedes": None,
        "applies_to_codes": None,
        "priority": 1,
    },
]


def resolve_doc_spec(filename: str) -> DocSpec:
    lowered = filename.lower().replace("_", " ").replace("-", " ")
    for spec in DOCUMENT_REGISTRY:
        if spec["match"] in lowered:
            return spec
    raise ValueError(
        f"Could not match '{filename}' to a known document in DOCUMENT_REGISTRY. "
        "Rename the file to include one of: " + ", ".join(d["match"] for d in DOCUMENT_REGISTRY)
    )



MDM_TABLE_MARKERS = ("table 2", "levels of medical decision making")


def _page_looks_like_mdm_table(page_text: str) -> bool:
    lowered = page_text.lower()
    return all(marker in lowered for marker in MDM_TABLE_MARKERS)


def extract_pages(pdf_path: Path) -> List[dict]:
    """Returns [{'page': '1', 'text': '...'}, ...] — one entry per PDF page."""
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            pages.append({"page": str(i), "text": text})
    return pages


def chunk_document(pdf_path: Path) -> List[dict]:
    """
    Returns a list of chunk dicts: {'content', 'page', 'section'}.

    Standard pages go through RecursiveCharacterTextSplitter with the
    chunk_size/overlap from Section 12.1. Any page that looks like the MDM
    table is kept whole as one chunk, tagged section='Table 2 MDM Levels'
    per Section 12.3, so the 2-of-3 element rule across all four MDM
    levels survives retrieval intact.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " "],
    )

    chunks: List[dict] = []
    for page in extract_pages(pdf_path):
        text = page["text"]
        if not text.strip():
            continue

        if _page_looks_like_mdm_table(text):
            chunks.append({
                "content": text,
                "page": page["page"],
                "section": "Table 2 MDM Levels",
            })
            continue

        for piece in splitter.split_text(text):
            if piece.strip():
                chunks.append({
                    "content": piece,
                    "page": page["page"],
                    "section": None, 
                })
    return chunks


def _task_type_for(purpose: str) -> str:
    """
    Gemini's embedding models support asymmetric retrieval natively via
    `task_type` — RETRIEVAL_QUERY for the search query, RETRIEVAL_DOCUMENT
    for the indexed chunks. This is the officially supported mechanism for
    aligning query/document embeddings in the same space; a hand-rolled
    text prefix is not guaranteed to match what the model was trained on
    and can quietly degrade similarity scores across the board.
    """
    return "RETRIEVAL_QUERY" if purpose == "query" else "RETRIEVAL_DOCUMENT"


class GeminiQuotaExhaustedError(RuntimeError):
    """Raised when Gemini's free-tier DAILY request quota (RPD) is exhausted."""


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


def embed_text(text: str, purpose: str = "document") -> List[float]:
    response = None
    for attempt in range(settings.gemini_retry_attempts):
        try:
            response = client.models.embed_content(
                model=settings.embedding_model,
                contents=text,
                config=types.EmbedContentConfig(
                    output_dimensionality=settings.embedding_dimensions,
                    task_type=_task_type_for(purpose),
                ),
            )
            break
        except Exception as exc:
            if _is_daily_quota_exhausted(exc):
                raise GeminiQuotaExhaustedError(
                    "Gemini free-tier DAILY embedding quota for this project is exhausted. "
                    "New API keys will NOT fix this (quota is per-project, not per-key). "
                    "Wait for the midnight Pacific Time reset, enable billing, or create "
                    "a brand-new Google Cloud project for a separate quota pool."
                ) from exc
            if attempt == settings.gemini_retry_attempts - 1 or not _is_retryable_gemini_error(exc):
                raise
            print(
                f"Gemini embedding request failed ({type(exc).__name__}); "
                f"retrying {attempt + 2}/{settings.gemini_retry_attempts}..."
            )
            _sleep_before_retry(attempt)
    if settings.embedding_request_delay_seconds > 0:
        time.sleep(settings.embedding_request_delay_seconds)
    return list(response.embeddings[0].values)


def ingest_pdf(pdf_path: Path, db: Session, force: bool = False) -> int:
    """
    Parses, chunks, embeds, and stores a single PDF. Returns the number of
    chunks written. Existing chunks for the same source are removed first
    so re-running ingestion doesn't duplicate data.

    If chunks already exist for this document and `force` is False, the
    PDF is skipped entirely — no embedding calls are made. This makes
    re-running `python scripts/ingest.py` safe and free by default; pass
    `force=True` (or `--force` on the CLI) when you've actually changed
    the PDF or the chunking/embedding logic and need to re-embed.
    """
    spec = resolve_doc_spec(pdf_path.name)

    existing_count = db.query(DocumentChunk).filter(DocumentChunk.source == spec["source"]).count()
    if existing_count > 0 and not force:
        print(f"  {pdf_path.name}: {existing_count} chunks already ingested - skipping "
              f"(pass --force to re-embed)")
        return existing_count

    try:
        db.query(DocumentChunk).filter(DocumentChunk.source == spec["source"]).delete()

        chunks = chunk_document(pdf_path)
        print(f"  {pdf_path.name}: {len(chunks)} chunks to embed")
        for index, chunk in enumerate(chunks, start=1):
            if index == 1 or index % 25 == 0 or index == len(chunks):
                print(f"    embedding chunk {index}/{len(chunks)}")
            embedding = embed_text(chunk["content"])
            row = DocumentChunk(
                content=chunk["content"],
                embedding=embedding,
                source=spec["source"],
                version=spec["version"],
                section=chunk["section"],
                page=chunk["page"],
                applies_to_codes=spec["applies_to_codes"],
                supersedes=spec["supersedes"],
                priority=spec["priority"],
            )
            db.add(row)
        db.commit()
        return len(chunks)
    except Exception:
        db.rollback()
        raise


def clear_pdf_chunks(pdf_path: Path, db: Session) -> int:
    """Deletes all chunks for the document matched by `pdf_path`."""
    spec = resolve_doc_spec(pdf_path.name)
    deleted = db.query(DocumentChunk).filter(DocumentChunk.source == spec["source"]).delete()
    db.commit()
    return deleted


def ingest_directory(documents_dir: Path, db: Session, force: bool = False) -> dict:
    """Ingests every .pdf in `documents_dir`. Returns {filename: chunk_count}."""
    results = {}
    for pdf_path in sorted(documents_dir.glob("*.pdf")):
        results[pdf_path.name] = ingest_pdf(pdf_path, db, force=force)
    return results