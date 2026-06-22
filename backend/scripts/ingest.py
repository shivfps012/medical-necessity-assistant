"""
Run after adding the source PDFs to /documents:

    python scripts/ingest.py
    python scripts/ingest.py documents/ama_2021.pdf

Creates the pgvector extension + table if missing, then parses, chunks,
embeds, and stores the requested PDFs. With no arguments, it ingests every
PDF found in /documents.
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import SessionLocal, init_db 
from app.services.ingestion import (  
    clear_pdf_chunks,
    ingest_directory,
    ingest_pdf,
    DOCUMENT_REGISTRY,
)

DOCUMENTS_DIR = Path(__file__).resolve().parent.parent / "documents"


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest guideline PDFs into pgvector.")
    parser.add_argument(
        "pdfs",
        nargs="*",
        help="Optional PDF filenames/paths. With no args, all PDFs in documents/ are ingested.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List PDFs in documents/ and exit.",
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Delete stored chunks for the requested PDF(s) without ingesting.",
    )
    return parser.parse_args()


def _resolve_pdf_arg(value: str) -> Path:
    path = Path(value)
    if not path.is_absolute():
        direct = Path.cwd() / path
        in_documents = DOCUMENTS_DIR / value
        path = direct if direct.exists() else in_documents
    path = path.resolve()

    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {value}")
    if path.suffix.lower() != ".pdf":
        raise ValueError(f"Expected a .pdf file, got: {path}")
    return path


def main() -> None:
    args = _parse_args()
    available_pdfs = sorted(DOCUMENTS_DIR.glob("*.pdf"))

    if args.list:
        print(f"PDFs in {DOCUMENTS_DIR}:")
        for pdf in available_pdfs:
            print(f"  {pdf.name}")
        return

    print("Initializing database (pgvector extension + tables)...")
    init_db()

    pdfs = [_resolve_pdf_arg(value) for value in args.pdfs] if args.pdfs else available_pdfs
    if not pdfs:
        print(f"No PDFs found in {DOCUMENTS_DIR}.")
        print("Expected filenames containing one of:", [d["match"] for d in DOCUMENT_REGISTRY])
        return

    db = SessionLocal()
    try:
        if args.clear:
            print(f"Clearing stored chunks for {len(pdfs)} PDF(s)...")
            results = {pdf.name: clear_pdf_chunks(pdf, db) for pdf in pdfs}
            for filename, count in results.items():
                print(f"  {filename}: {count} chunks deleted")
            print("Clear complete.")
        elif args.pdfs:
            print(f"Ingesting {len(pdfs)} PDF(s) from {DOCUMENTS_DIR}...")
            results = {pdf.name: ingest_pdf(pdf, db) for pdf in pdfs}
            for filename, count in results.items():
                print(f"  {filename}: {count} chunks stored")
            print("Ingestion complete.")
        else:
            print(f"Ingesting {len(pdfs)} PDF(s) from {DOCUMENTS_DIR}...")
            results = ingest_directory(DOCUMENTS_DIR, db)
            for filename, count in results.items():
                print(f"  {filename}: {count} chunks stored")
            print("Ingestion complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
