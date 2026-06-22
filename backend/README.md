# Medical Necessity Assistant

A RAG-based REST API that acts as a clinical coding compliance assistant for doctors at UAE healthcare facilities (Abu Dhabi DOH). It answers coding and compliance questions strictly from five ingested guideline documents — never from general model knowledge — and tells a doctor whether their documented encounter actually supports the CPT code they want to bill.

## Section 1 — Project Overview

This system reads exclusively from five uploaded guideline PDFs (AMA 2021 E/M Guidelines, 1997 CMS Documentation Guidelines, JAWDA Data Certification Part IX, the Clinical Coding Process Review, and the HAAD Coding Manual) to answer free-text clinical/compliance questions, analyze whether a documented patient encounter supports a billed CPT code, and surface JAWDA audit penalty information — every answer carries an exact document/section/page citation, and the system refuses to answer when the documents don't contain enough information.

## Section 2 — Setup From Scratch

**Prerequisites:** Docker + Docker Compose, a Gemini API key.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd medical-necessity-assistant

# 2. Add the five source PDFs to /documents
# Filenames must each contain one of these keywords (case-insensitive):
#   "ama"            -> AMA 2021 E/M Guidelines
#   "1997"           -> 1997 CMS E/M Documentation Guidelines
#   "jawda"          -> JAWDA Data Certification 2026 Part IX
#   "coding process" -> Clinical Coding Process Review (Tasneef/JAWDA)
#   "haad"           -> HAAD Coding Manual
cp /path/to/your/*.pdf documents/

# 3. Copy and fill in the .env file
cp .env.example .env
# edit .env and set GEMINI_API_KEY

# 4. Start PostgreSQL + pgvector and the API
docker-compose up -d

# 5. Run the one-time ingestion script (parses, chunks, embeds, stores all 5 PDFs)
docker-compose exec app python scripts/ingest.py
# or, if running locally with deps installed and DATABASE_URL pointed at localhost:
python scripts/ingest.py

# 6. API is live at http://localhost:8000
curl http://localhost:8000/health
# -> {"status":"ok"}
```

Interactive API docs: `http://localhost:8000/docs`

Run tests (after ingestion has completed):
```bash
docker-compose exec app pytest -v
```

## Section 3 — Sample API Request and Response

```bash
curl -X POST http://localhost:8000/analyze-encounter \
  -H "Content-Type: application/json" \
  -d '{
    "visit_type": "outpatient",
    "chief_complaint": "poorly controlled diabetes and high blood pressure",
    "diagnoses": ["Type 2 diabetes uncontrolled", "hypertension"],
    "procedures": ["A1C ordered", "BP medication adjusted"],
    "documentation": {
      "HPI": "Patient with 2 chronic conditions requiring management changes",
      "exam": "BP 160/95, weight 95kg, no edema",
      "assessment": "Uncontrolled T2DM and hypertension, adjusting medications"
    },
    "billed_code": "99214"
  }'
```

```json
{
  "billed_code": "99214",
  "supported": true,
  "reasoning": "99214 requires moderate MDM with 2 of 3 elements met. Two chronic illnesses (uncontrolled T2DM and hypertension) satisfy the problem complexity element. Prescription drug management satisfies the moderate risk element per AMA 2021 Table 2.",
  "documentation_gaps": [
    "Data category not fully met: no external notes reviewed or independent interpretation recorded"
  ],
  "denial_risk": "LOW",
  "recommended_code": null,
  "citation": {
    "document": "AMA 2021 E/M Guidelines",
    "section": "Table 2: Levels of Medical Decision Making",
    "page": "11"
  }
}
```

## Section 4 — Document Processing Approach

PDFs are parsed page-by-page with `pdfplumber`, then split with `RecursiveCharacterTextSplitter` using **chunk_size = 800 characters** and **chunk_overlap = 150 characters**, with separators ordered `["\n\n", "\n", ". ", " "]` to respect paragraph/sentence boundaries before falling back to character splits. Every chunk is tagged with metadata — `source`, `version`, `section`, `page`, `applies_to_codes`, `supersedes`, `priority` — at embedding time, which is what lets `retrieval.py` apply a SQL filter *before* ranking by similarity instead of relying on the LLM to ignore irrelevant context. Retrieval enforces a **similarity_threshold of 0.75** and a hard **top_k = 4**, satisfying Rule 3 ("Retrieve Tightly").

The one exception to standard chunking: any page matching the AMA 2021 MDM table headers is kept as a **single whole chunk** tagged `section="Table 2 MDM Levels"` instead of being run through the splitter (Section 12.3). This table defines the 2-of-3 element rule across all four MDM levels — splitting it would silently corrupt the most important content in the entire assignment.

## Section 5 — How You Handled 1997 vs 2021 Supersession

`app/services/guideline_router.py` is a standalone, dependency-free service that owns Rule 5 exclusively. Given a `billed_code`, it returns a `RoutingDecision` with `included_versions` set to either `["2021", "jawda", "haad"]` (for 99202–99215) or `["1997", "jawda", "haad"]` (for inpatient/ED/nursing/consultation codes) — JAWDA Part IX and the HAAD Coding Manual are always included regardless of code, per Section 13.1. `retrieval.py` then applies this list as a `WHERE version IN (...)` clause **before** the vector similarity search runs, so 1997 CMS chunks are structurally unreachable for an office/outpatient query — not just discouraged via prompting. When no `billed_code` is given (general `/ask` questions) or the code is unrecognized, no version filter is applied at all, so the system doesn't guess a guideline it has no basis for. The routing `reason` string is passed into every LLM call so the model can explain *why* a given guideline was used if asked.

## Section 6 — What You Would Improve With More Time

- **Semantic chunking for MDM Table 2** — the current header-text heuristic works but a layout-aware table extractor (e.g. `pdfplumber`'s table objects) would more robustly capture multi-page tables.
- **Confidence scoring** — surface the actual similarity scores in the API response so a doctor can gauge how strong the supporting evidence was, not just the citation.
- **Query caching** — cache embeddings for repeated/similar questions to cut latency and API usage.
- **Streaming responses** — stream the `/ask` answer token-by-token for a better doctor-facing UX.
- **Audit trail logging** — persist every request/response/citation pair for JAWDA audit defensibility, since "evidence not presented during the audit will not be accepted."
- **Re-ranking** — add a cross-encoder re-ranking pass on top of the initial top-k vector search to improve precision further before the chunks reach the LLM.

## Section 7 — Gemini Migration Fixes (this revision)

Switching from OpenAI to Gemini surfaced a few provider-specific issues, fixed in this revision:

1. **Retry logic was silently dead.** `_is_retryable_gemini_error()` checked `exc.status_code`, but `google.genai.errors.APIError` exposes the HTTP status as `.code`. Every 429/5xx from Gemini was raising immediately instead of retrying — the most likely cause of intermittent test failures. Fixed in both `analyzer.py` and `ingestion.py`.
2. **No schema enforcement on LLM output.** `response_mime_type="application/json"` alone guarantees valid JSON but not matching *types* (e.g. `"page": 11` instead of `"page": "11"`), which broke Pydantic validation downstream. Now using `response_schema` with dedicated, default-free internal schemas (`_AnalyzeLLMSchema` / `_AskLLMSchema` in `analyzer.py`) so Gemini's constrained decoding guarantees correct types.
3. **Embedding query/document asymmetry used a hand-rolled prefix** (`"task: question answering | query: ..."`) instead of Gemini's native `task_type` parameter (`RETRIEVAL_QUERY` / `RETRIEVAL_DOCUMENT`). Switched to native `task_type` in `ingestion.py`'s `embed_text()` — this is what the embedding model was actually trained to expect for asymmetric retrieval, and likely explains why the similarity threshold had to be dropped to 0.50 as a workaround.
4. **MDM-table detector over-triggered.** The original check matched if *either* both markers were present *or* just `"levels of medical decision making"` alone appeared — meaning any page that merely discusses MDM levels in prose (not just Table 2 itself) got swallowed into one oversized, un-split chunk. Tightened to require both markers.
5. **Insufficient-info string fragility.** Test #4 requires the exact string `"Insufficient information in source documents."` Added `_normalize_if_insufficient()` so any Gemini phrasing that says "insufficient information" (regardless of casing/punctuation) gets normalized to the canonical string server-side, rather than relying on the model to reproduce it byte-for-byte.
6. **`requests` added to `requirements.txt`** — imported directly by both `analyzer.py` and `ingestion.py` for retry-exception detection but wasn't pinned.

**⚠️ Action required:** fix #3 changes how chunks are embedded (native `task_type` vs. the old text-prefix hack), so embeddings generated before this change are not directly comparable to new ones. Re-run ingestion after pulling these changes:
```bash
python scripts/ingest.py
```
Since `ingest_pdf()` already deletes existing chunks for a source before re-embedding, this is safe to run again over the same PDFs. After re-ingesting, it's worth re-testing whether `SIMILARITY_THRESHOLD` can come back up from 0.50 toward the original 0.75 now that embeddings use the correct task type — but tune that empirically against your actual ingested content rather than guessing.



```
app/
  main.py                      FastAPI entry point
  api/routes/analyze.py        POST /analyze-encounter
  api/routes/ask.py            POST /ask
  core/config.py                Settings (env vars)
  core/database.py             PostgreSQL + pgvector connection
  services/ingestion.py        PDF parsing, chunking, embedding, storage
  services/retrieval.py        Filtered vector similarity search
  services/analyzer.py         Core analysis logic + the LLM call
  services/guideline_router.py 1997 vs 2021 supersession routing
  models/encounter.py           Pydantic input models
  models/response.py            Pydantic output models
documents/                      Source PDFs go here
tests/                          pytest suite (8 required test cases)
scripts/ingest.py               One-time ingestion runner
docker-compose.yml              PostgreSQL + pgvector + app
```

## The Six Non-Negotiable Rules (Section 9) — Where Each Is Enforced

| Rule | Enforced in |
|---|---|
| 1. Answer only what was asked | System prompt (`analyzer.py`) |
| 2. Always cite exactly | `Citation` model required on every response |
| 3. Retrieve tightly (top_k=4, threshold=0.75) | `retrieval.py` |
| 4. Maximum 4 sentences | System prompt + server-side `_enforce_max_sentences()` in `analyzer.py` |
| 5. Guideline supersession | `guideline_router.py` + version filter in `retrieval.py` |
| 6. Never invent | Empty retrieval short-circuits to the canned response **before** any LLM call in `analyzer.py` |
