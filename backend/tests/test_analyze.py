"""
Test Cases 1 & 2 from Section 16. Exercise POST /analyze-encounter end to
end. Require:
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


def test_supported_code_two_chronic_illnesses_99214(client, db_session):
    """Test #1: 2 chronic illnesses + prescription management -> 99214 supported, cites AMA 2021."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    payload = {
        "visit_type": "outpatient",
        "chief_complaint": "poorly controlled diabetes and high blood pressure",
        "diagnoses": ["Type 2 diabetes uncontrolled", "hypertension"],
        "procedures": ["A1C ordered", "BP medication adjusted"],
        "documentation": {
            "HPI": "Patient with 2 chronic conditions requiring management changes",
            "exam": "BP 160/95, weight 95kg, no edema",
            "assessment": "Uncontrolled T2DM and hypertension, adjusting medications",
        },
        "billed_code": "99214",
    }

    response = client.post("/analyze-encounter", json=payload)
    assert response.status_code == 200

    body = response.json()
    assert body["supported"] is True
    assert body["citation"]["document"] == "AMA 2021 E/M Guidelines"
    assert body["citation"]["section"]
    assert body["citation"]["page"]


def test_unsupported_code_minor_cold_billed_as_99215(client, db_session):
    """Test #2: minor cold billed as 99215 -> unsupported, HIGH denial risk, recommended_code=99212."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    payload = {
        "visit_type": "outpatient",
        "chief_complaint": "runny nose and mild cough for 2 days",
        "diagnoses": ["common cold"],
        "procedures": [],
        "documentation": {
            "HPI": "Mild runny nose and cough, no fever, self-limited",
            "exam": "Lungs clear, no distress",
            "assessment": "Common cold, supportive care advised",
        },
        "billed_code": "99215",
    }

    response = client.post("/analyze-encounter", json=payload)
    assert response.status_code == 200

    body = response.json()
    assert body["supported"] is False
    assert body["denial_risk"] == "HIGH"
    assert body["recommended_code"] == "99212"
