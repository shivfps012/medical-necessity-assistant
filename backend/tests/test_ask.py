"""
Test Cases 3, 4, 7 & 8 from Section 16. Exercise POST /ask end to end.
Require:
  - docker-compose `db` running, ingested via `python scripts/ingest.py`
  - GEMINI_API_KEY set in .env
Skip automatically (with a clear reason) if no chunks are ingested.
"""
import pytest


def _has_ingested_data(db_session) -> bool:
    from app.core.database import DocumentChunk
    try:
        return db_session.query(DocumentChunk).count() > 0
    except Exception:
        return False


def test_jawda_lama_penalty(client, db_session):
    """Test #3: missing LAMA form -> answer contains '20', citation from JAWDA Part IX."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    response = client.post(
        "/ask", json={"question": "What is the score deduction for missing LAMA form?"}
    )
    assert response.status_code == 200

    body = response.json()
    assert "20" in body["answer"]
    assert body["citation"]["document"] == "JAWDA Data Certification 2026 Part IX"


def test_out_of_scope_question_returns_insufficient_information(client, db_session):
    """Test #4: question with no answer in source docs -> canned insufficient-info response."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    response = client.post(
        "/ask", json={"question": "What is the reimbursement rate for 99214 in Abu Dhabi?"}
    )
    assert response.status_code == 200
    assert response.json()["answer"] == "Insufficient information in source documents."


def test_haad_outpatient_probable_diagnosis_rule(client, db_session):
    """Test #7: outpatient probable diagnosis -> answer is NO, cites HAAD Coding Manual."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    response = client.post(
        "/ask", json={"question": "Can I code a probable diagnosis for an outpatient visit?"}
    )
    assert response.status_code == 200

    body = response.json()
    assert "no" in body["answer"].lower()
    assert body["citation"]["document"] == "HAAD Coding Manual (Abu Dhabi)"


def test_jawda_time_based_code_requires_start_and_end_times(client, db_session):
    """Test #8: total time alone is NOT sufficient for time-based codes -> cites JAWDA Part IX."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    response = client.post(
        "/ask",
        json={"question": "Is total time alone sufficient documentation for time-based codes?"},
    )
    assert response.status_code == 200

    body = response.json()
    assert "no" in body["answer"].lower()
    assert body["citation"]["document"] == "JAWDA Data Certification 2026 Part IX"
