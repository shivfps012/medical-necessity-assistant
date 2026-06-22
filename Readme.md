<div align="center">

```
███╗   ███╗███████╗██████╗ ██╗ ██████╗ █████╗ ██╗
████╗ ████║██╔════╝██╔══██╗██║██╔════╝██╔══██╗██║
██╔████╔██║█████╗  ██║  ██║██║██║     ███████║██║
██║╚██╔╝██║██╔══╝  ██║  ██║██║██║     ██╔══██║██║
██║ ╚═╝ ██║███████╗██████╔╝██║╚██████╗██║  ██║███████╗
╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

███╗   ██╗███████╗ ██████╗███████╗███████╗███████╗██╗████████╗██╗   ██╗
████╗  ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝██║╚══██╔══╝╚██╗ ██╔╝
██╔██╗ ██║█████╗  ██║     █████╗  ███████╗███████╗██║   ██║    ╚████╔╝
██║╚██╗██║██╔══╝  ██║     ██╔══╝  ╚════██║╚════██║██║   ██║     ╚██╔╝
██║ ╚████║███████╗╚██████╗███████╗███████║███████║██║   ██║      ██║
╚═╝  ╚═══╝╚══════╝ ╚═════╝╚══════╝╚══════╝╚══════╝╚═╝   ╚═╝      ╚═╝

          A S S I S T A N T
```

</div>

<div align="center">

**`RAG-POWERED` · `ZERO-HALLUCINATION` · `UAE DOH COMPLIANT` · `FULL-STACK`**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL+pgvector-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> *"Every denied claim tells a story the documentation failed to tell first."*

<br/>

[🚀 Live Demo](https://medical-necessity-assistant.vercel.app/) · [📖 Docs](#api-endpoints) · [🐛 Report Bug](#) · [✨ Request Feature](#future-improvements)

<br/>

<a href="https://medical-necessity-assistant.vercel.app/" target="_blank">
  <img src="https://github.com/user-attachments/assets/54da85e3-f9fd-4c71-a8ca-44ca248e9a8b" alt="Medical Necessity Assistant Dashboard" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-top: 20px;">
</a>

</div>

---

## ⚡ The Problem It Solves

> Physicians at UAE healthcare facilities face relentless audit pressure from JAWDA and DOH. A single underdocumented encounter — a missing LAMA form, a vague HPI, an unsupported CPT code — can trigger **point deductions, financial penalties, and audit flags** that cascade for months.

The **Medical Necessity Assistant** is the clinical coding co-pilot that catches those mistakes *before* they become denials. It reads your documentation the same way an auditor would — and tells you exactly where you're vulnerable, which guideline you're violating, and what the fix looks like.

**No guessing. No hallucinations. Just citations.**

---

## 🧠 What Makes This Different

```
┌─────────────────────────────────────────────────────────────────────┐
│  TRADITIONAL AI CODING TOOLS          MEDICAL NECESSITY ASSISTANT   │
│                                                                     │
│  ❌ Answers from training data        ✅ Answers ONLY from 5 docs   │
│  ❌ Confident but wrong               ✅ Refuses to guess            │
│  ❌ Generic compliance advice         ✅ UAE DOH / JAWDA specific    │
│  ❌ No citations                      ✅ Document + Section + Page   │
│  ❌ Black-box outputs                 ✅ Structured JSON verdicts     │
│  ❌ Hallucinates missing context      ✅ Hard short-circuit fallback  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Feature Showcase

<table>
<tr>
<td width="50%" valign="top">

### 🩺 Encounter Analyzer
Submit HPI + Exam + Assessment + CPT code.  
Get back a **definitive verdict** — `SUPPORTED` or `NOT SUPPORTED` — with a full reasoning chain and pinpoint citations. No ambiguity. No hedging.

<br/>
<img src="https://github.com/user-attachments/assets/fbb0a866-f63d-4270-a9d4-0a87a39cedc7" alt="Encounter Analyzer Interface" width="100%" style="border-radius: 6px; border: 1px solid #444; margin-top: 10px;">

</td>
<td width="50%">

### 📊 Denial Risk Meter
A visual risk gauge calculated from documentation gaps.  
`LOW` · `MODERATE` · `HIGH`  
Know your audit exposure *before* the auditor does.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💬 Clinical Q&A Assistant
Ask anything about CPT coding, modifiers, UAE compliance, or JAWDA deductions. Every answer is sourced from the official guidelines — never from the model's general knowledge.

<br/>
<img src="https://github.com/user-attachments/assets/e1a7cb8c-0bad-4082-8a93-3b14251e85c4" alt="Clinical Q&A Interface" width="100%" style="border-radius: 6px; border: 1px solid #444; margin-top: 10px;">

</td>
<td width="50%">

### 📎 Granular Citations
Every response includes:
- 📄 **Document name**
- 🏷️ **Section heading**
- 📃 **Exact page number**

Audit-defensible. Always.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛡️ Zero-Hallucination Fallback
If the retrieved context doesn't contain the answer, the system **refuses to answer** and returns an `"Insufficient Information"` state — *before* the LLM is even called.

</td>
<td width="50%" valign="top">

### 🗂️ Local Session History
Analyzed encounters and Q&A pairs are persisted in Zustand + localStorage. Zero latency on re-reads. No re-pinging the LLM for the same question twice.

<br/>
<img src="https://github.com/user-attachments/assets/b45e7bb1-ee1c-42e6-8439-1250842dc5aa" alt="Local Session History Interface" width="100%" style="border-radius: 6px; border: 1px solid #444; margin-top: 10px;">

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                                       │
│                                                                                 │
│   ┌──────────────────────────────────────────────────────────────────────────┐  │
│   │                    NEXT.JS 14 FRONTEND (Port 3000)                       │  │
│   │                                                                          │  │
│   │  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────────────┐ │  │
│   │  │  React UI   │  │  Zustand Store   │  │  TanStack React Query v5    │ │  │
│   │  │  (shadcn/ui)│  │ (Session Cache)  │  │  (Data Fetching + Caching)  │ │  │
│   │  └──────┬──────┘  └──────────────────┘  └──────────────────────────── ┘ │  │
│   │         │                                                                 │  │
│   │  ┌──────▼─────────────────────────────────────────────────────────────┐  │  │
│   │  │           NEXT.JS API PROXY LAYER  /api/backend/*                  │  │  │
│   │  │        (Hides backend URL · Eliminates CORS · Adds auth layer)      │  │  │
│   │  └──────────────────────────────┬───────────────────────────────────── ┘  │  │
│   └─────────────────────────────────┼────────────────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────────────┘
                                      │ HTTP
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND (Port 8000)                             │
│                                                                                 │
│   POST /analyze-encounter          POST /ask                                    │
│         │                                │                                      │
│         └──────────────┬─────────────────┘                                      │
│                        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                    GUIDELINE ROUTER                                     │   │
│   │  outpatient → AMA 2021 + UAE HAAD                                       │   │
│   │  inpatient  → 1997 CMS + UAE HAAD                                       │   │
│   │  JAWDA      → JAWDA Part IX + Tasneef                                   │   │
│   └─────────────────────────────────┬───────────────────────────────────────┘   │
│                                     │                                           │
│                                     ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │         PGVECTOR RETRIEVAL  (top_k=4, similarity > 0.50)                │   │
│   │         PostgreSQL + pgvector · Metadata pre-filtering                  │   │
│   └────────────────────────────────┬────────────────────────────────────────┘   │
│                                    │                                            │
│                        ┌───────────▼────────────┐                              │
│                        │  Context found?        │                              │
│                        │  YES → Call Gemini LLM │                              │
│                        │   NO → Short-circuit   │                              │
│                        │        "Insufficient   │                              │
│                        │         Information"   │                              │
│                        └───────────┬────────────┘                              │
│                                    │                                            │
│                                    ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │      GEMINI OUTPUT: Strictly typed JSON (Pydantic-validated)            │   │
│   │      { verdict, reasoning, gaps[], recommendation, citation }           │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Knowledge Base — The Five Pillars

> The system is a closed-world reasoner. It knows exactly these five documents and **nothing else**.

| # | Document | Authority | Scope |
|---|----------|-----------|-------|
| 1 | **AMA 2021 E/M Guidelines** | American Medical Association | Outpatient E/M coding (99202–99215) |
| 2 | **1997 CMS E/M Documentation Guidelines** | Centers for Medicare & Medicaid | Multi-system exam, inpatient coding |
| 3 | **JAWDA Data Certification 2026 Part IX** | DOH Abu Dhabi | Quality audit scoring & deductions |
| 4 | **Clinical Coding Process Review** | Tasneef / JAWDA | UAE-specific coding compliance process |
| 5 | **HAAD Coding Manual** | Health Authority Abu Dhabi | Modifier rules, billing, UAE-specific CPT guidance |

---

## 🔬 The RAG Pipeline — How Answers Are Born

```
    PDF Documents (5 sources)
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  pdfplumber → RecursiveCharacterTextSplitter                    │
    │  chunk_size=800  ·  overlap=150                                 │
    │  ⚠️  AMA 2021 MDM Table 2 → preserved as SINGLE chunk           │
    │      (prevents 2-of-3 rule fragmentation across vector splits)  │
    └─────────────────────────────────────────────────────────────────┘
           │
           ▼
    Gemini Embeddings (task_type=RETRIEVAL_DOCUMENT)
    + Metadata tagging: {source, version, section, page, supersedes}
           │
           ▼
    pgvector Storage (PostgreSQL)
           │
           │ ← Query time
           ▼
    Gemini Embeddings (task_type=RETRIEVAL_QUERY)  ← Asymmetric!
           │
           ▼
    Vector similarity search + SQL WHERE pre-filter (by guideline source)
    Top 4 chunks · Hard threshold: cosine similarity > 0.50
           │
           ▼
    Gemini Flash → Strictly typed JSON output
    (Pydantic-validated before returning to client)
```

---

## 🛡️ The Six Non-Negotiable Rules

These are hardcoded into the system. Not configurable. Not bypassable.

```
╔══════════════════════════════════════════════════════════════════════╗
║  RULE 1 │ Answer only what was asked                                 ║
║         │ Enforced in: analyzer.py system prompt                     ║
╠══════════════════════════════════════════════════════════════════════╣
║  RULE 2 │ Always cite exactly — document + section + page            ║
║         │ Enforced in: Citation Pydantic model (required field)       ║
╠══════════════════════════════════════════════════════════════════════╣
║  RULE 3 │ Retrieve tightly — top_k=4, similarity > 0.50              ║
║         │ Enforced in: retrieval.py                                   ║
╠══════════════════════════════════════════════════════════════════════╣
║  RULE 4 │ Maximum 4 sentences per reasoning response                  ║
║         │ Enforced in: system prompt + server-side token limit        ║
╠══════════════════════════════════════════════════════════════════════╣
║  RULE 5 │ UAE guidelines supersede AMA/CMS when they conflict         ║
║         │ Enforced in: guideline_router.py + SQL WHERE clauses        ║
╠══════════════════════════════════════════════════════════════════════╣
║  RULE 6 │ Never invent — empty retrieval short-circuits to canned     ║
║         │ "Insufficient Information" BEFORE calling the LLM           ║
║         │ Enforced in: services/retrieval.py (pre-LLM gate)           ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Docker & Docker Compose
Node.js v20+
Python 3.10+
Google Gemini API Key
5 PDF guideline documents
```

### 1 · Clone

```bash
git clone https://github.com/your-username/medical-necessity-assistant.git
cd medical-necessity-assistant
```

### 2 · Backend

```bash
cd backend

# Configure environment
cp .env.example .env
# → Add your GEMINI_API_KEY to .env

# Spin up PostgreSQL + pgvector
docker-compose up -d

# Install Python dependencies
python -m venv .venv
source .venv/bin/activate          # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Drop your 5 PDF guidelines into:
# backend/documents/

# One-time ingestion (parse → chunk → embed → store)
python scripts/ingest.py

# Launch the API
uvicorn app.main:app --reload --port 8000
```

> 🟢 Backend running at `http://localhost:8000`
> 📖 Swagger docs at `http://localhost:8000/docs`

### 3 · Frontend

```bash
# In a new terminal
cd frontend

cp .env.example .env.local
# Ensure: BACKEND_URL=http://127.0.0.1:8000

npm install
npm run dev
```

> 🟢 Frontend running at `http://localhost:3000`

---

## 📡 API Reference

### `POST /analyze-encounter`

*Evaluates clinical documentation against a billed CPT code.*

```json
// Request
{
  "visit_type": "outpatient",
  "chief_complaint": "poorly controlled diabetes and high blood pressure",
  "diagnoses": ["Type 2 diabetes uncontrolled", "Hypertension"],
  "procedures": ["A1C ordered", "BP medication adjusted"],
  "documentation": {
    "HPI": "Patient presents with 2 chronic conditions requiring separate management...",
    "exam": "BP 160/95, fasting glucose 220. Multi-system exam performed...",
    "assessment": "Uncontrolled T2DM with suboptimal glycemic control..."
  },
  "billed_code": "99214"
}
```

```json
// Response
{
  "verdict": "SUPPORTED",
  "denial_risk": "LOW",
  "reasoning": "Documentation supports moderate medical decision-making...",
  "gaps": [],
  "recommendation": "99214 is appropriately supported.",
  "citation": {
    "document": "AMA 2021 E/M Guidelines",
    "section": "Table 2 — Medical Decision Making",
    "page": 7
  }
}
```

---

### `POST /ask`

*Answers free-text clinical coding and compliance questions.*

```json
// Request
{
  "question": "What is the point deduction for a missing LAMA form?",
  "billed_code": "99214"  // Optional — used for guideline routing
}
```

```json
// Response
{
  "answer": "A missing LAMA (Leave Against Medical Advice) form results in a...",
  "citation": {
    "document": "JAWDA Data Certification 2026 Part IX",
    "section": "Section 4.3 — Documentation Requirements",
    "page": 23
  }
}
```

---

## 🧪 Real-World Use Cases

<details>
<summary><b>📋 Case 1: Downcoded Office Visit</b></summary>

> A physician documents a 15-minute visit with straightforward MDM and tries to bill `99214`.

**System response:**
- **Verdict:** `NOT SUPPORTED`
- **Risk:** `HIGH`
- **Gap detected:** "Medical Decision Making documented as Straightforward — 99214 requires Moderate complexity per AMA 2021 Table 2."
- **Recommendation:** `99212` or upgrade documentation before billing.
- **Citation:** AMA 2021 E/M Guidelines · Table 2 · Page 7

</details>

<details>
<summary><b>🔧 Case 2: Modifier 25 Compliance</b></summary>

> A coder asks: *"Can I append Modifier 25 to an E/M billed with a minor procedure on the same day?"*

**System response:**  
Cites HAAD Coding Manual's specific rules on Modifier 25 usage — when it's valid, when it triggers audit flags, and the UAE-specific documentation requirements that must be met.

</details>

<details>
<summary><b>💰 Case 3: JAWDA Deduction Lookup</b></summary>

> A facility manager asks: *"What's the deduction for improper signature dates?"*

**System response:**  
Retrieves exact deduction points from JAWDA Part IX Section on documentation integrity, including the specific numeric penalty and conditions under which it applies.

</details>

---

## 🧰 Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + class-variance-authority |
| UI Components | shadcn/ui (Radix UI primitives) |
| State Management | Zustand |
| Data Fetching | TanStack React Query v5 |

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | FastAPI |
| Language | Python 3.10+ |
| LLM | Google Gemini (via GenAI SDK) |
| PDF Parsing | pdfplumber |
| Text Splitting | LangChain RecursiveCharacterTextSplitter |
| Data Validation | Pydantic v2 |

### Data & Infrastructure
| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL + pgvector |
| Containerization | Docker + Docker Compose |
| Embeddings | Gemini (asymmetric RETRIEVAL_QUERY / RETRIEVAL_DOCUMENT) |

---

## 📁 Project Structure

```
medical-necessity-assistant/
│
├── 🔧 backend/
│   ├── app/
│   │   ├── api/routes/          # FastAPI endpoints
│   │   │   ├── analyze.py       #   POST /analyze-encounter
│   │   │   └── ask.py           #   POST /ask
│   │   ├── core/
│   │   │   ├── config.py        # Env config & settings
│   │   │   └── database.py      # pgvector connection pool
│   │   ├── models/
│   │   │   ├── encounter.py     # Pydantic: EncounterRequest
│   │   │   └── response.py      # Pydantic: AnalysisResponse + Citation
│   │   └── services/
│   │       ├── analyzer.py      # Gemini prompt engineering
│   │       ├── retrieval.py     # pgvector similarity search
│   │       └── guideline_router.py  # Smart source routing
│   ├── documents/               # 📄 Source PDF guidelines (gitignored)
│   ├── scripts/
│   │   └── ingest.py            # One-time PDF → embeddings pipeline
│   ├── tests/                   # Pytest suite
│   └── docker-compose.yml       # PostgreSQL + pgvector
│
└── 🎨 frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   ├── components/
    │   │   ├── analyze/         # Encounter analyzer UI
    │   │   ├── ask/             # Q&A interface
    │   │   ├── dashboard/       # Main dashboard
    │   │   └── ui/              # shadcn/ui components
    │   ├── hooks/               # React Query custom hooks
    │   ├── lib/api/             # Axios client + proxy routing
    │   └── store/               # Zustand stores
    ├── tailwind.config.ts       # Dark clinical UI palette
    └── next.config.mjs          # /api/backend/* proxy config
```

---

## ☁️ Deployment

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────────────┐
│   FRONTEND   │────▶│       BACKEND        │────▶│       DATABASE          │
│              │     │                      │     │                         │
│   Vercel     │     │  Google Cloud Run    │     │  Supabase / AWS RDS     │
│   Netlify    │     │  AWS App Runner      │     │  (PostgreSQL + pgvector │
│              │     │  Render              │     │   extension enabled)    │
│  Set:        │     │                      │     │                         │
│  BACKEND_URL │     │  Deploy via:         │     │  Run once:              │
│  → FastAPI   │     │  Dockerfile          │     │  python scripts/        │
│    URL       │     │                      │     │  ingest.py              │
└──────────────┘     └──────────────────────┘     └─────────────────────────┘
```

---

## 🧪 Testing

```bash
cd backend

# Ensure ingestion is complete first
python scripts/ingest.py

# Run the full test suite
pytest -v

# Run with coverage
pytest -v --cov=app --cov-report=html
```

---

## 🔭 Future Improvements

| Feature | Description | Priority |
|---------|-------------|----------|
| 📊 **Confidence Scoring UI** | Surface raw pgvector cosine similarity scores in the React UI so doctors can gauge evidence strength | High |
| 🔄 **Cross-Encoder Re-ranking** | Add a re-ranking pass after initial pgvector retrieval for higher context precision | High |
| 📋 **Audit Trail Logging** | Persist all request/response/citation triplets in PostgreSQL for JAWDA audit defensibility | High |
| 🌊 **Streaming Responses** | Implement SSE to stream `/ask` answers token-by-token for faster perceived UX | Medium |
| 🗺️ **Semantic Table Extraction** | Upgrade PDF parsing with layout-aware table extraction for complex multi-page tables | Medium |
| 📈 **Analytics Dashboard** | Track denial risk trends across encounters over time | Low |

---

## 📄 Document Processing Details

```
AMA 2021 MDM Table 2         ┌─────────────────────────────────┐
(Critical Table)              │   SINGLE PRESERVED CHUNK        │
                              │                                 │
                              │  Why: "2-of-3" rule spans       │
Normally split at:  ─── ✗   │  multiple rows. Splitting it    │
  800 chars / 150 overlap    │  across vector boundaries would │
                              │  destroy the decision logic.    │
Kept whole:         ─── ✓   └─────────────────────────────────┘

All other documents → RecursiveCharacterTextSplitter
                      chunk_size=800, overlap=150

Embeddings → Gemini asymmetric:
  At ingest:  task_type=RETRIEVAL_DOCUMENT
  At query:   task_type=RETRIEVAL_QUERY
  (Different embedding spaces optimized for each direction)

Metadata on every chunk:
  { source, version, section, page, supersedes }
  → Used for SQL pre-filtering before vector distance calculation
```

---

<div align="center">

---

**Built for clinicians who can't afford to be wrong.**  
*Zero hallucinations. Complete citations. UAE DOH compliant.*

---

*Medical Necessity Assistant · Abu Dhabi DOH · JAWDA 2026*

</div>