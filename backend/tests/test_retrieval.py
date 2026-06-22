"""
Test Cases 5 & 6 from Section 16:
  #5  Guideline routing - office (99214): retrieve only from AMA 2021, not 1997 CMS
  #6  Guideline routing - inpatient (99221): retrieve from 1997 CMS

`test_route_*` are pure unit tests on guideline_router.py — no DB or
network required, always runnable.

`test_retrieve_chunks_*` are integration tests that require:
  - docker-compose `db` running, ingested via `python scripts/ingest.py`
  - GEMINI_API_KEY set (used to embed the query)
They skip automatically (with a clear reason) if no chunks are ingested.
"""
import pytest

from app.services import guideline_router
from app.services.retrieval import retrieve_chunks




def test_route_office_outpatient_includes_2021_excludes_1997():
    decision = guideline_router.route("99214")
    assert decision.primary_guideline == "2021"
    assert "2021" in decision.included_versions
    assert "1997" not in decision.included_versions
    assert "1997" in decision.excluded_versions


def test_route_inpatient_includes_1997_excludes_2021():
    decision = guideline_router.route("99221")
    assert decision.primary_guideline == "1997"
    assert "1997" in decision.included_versions
    assert "2021" not in decision.included_versions
    assert "2021" in decision.excluded_versions


def test_route_jawda_and_haad_always_included_when_code_known():
    for code in ("99214", "99221"):
        decision = guideline_router.route(code)
        assert "jawda" in decision.included_versions
        assert "haad" in decision.included_versions


def test_route_unknown_code_has_no_version_filter():
    decision = guideline_router.route("00000")
    assert decision.included_versions is None



def _has_ingested_data(db_session) -> bool:
    from app.core.database import DocumentChunk
    try:
        return db_session.query(DocumentChunk).count() > 0
    except Exception:
        return False


def test_retrieve_chunks_office_outpatient_excludes_1997cms(db_session):
    """Test #5: billed_code=99214 -> retrieved chunks only from AMA 2021, NOT 1997 CMS."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    routing = guideline_router.route("99214")
    chunks = retrieve_chunks(
        "moderate MDM requirements for established patient visit", db_session, routing
    )

    assert len(chunks) > 0
    assert all(c.source != "1997 CMS E/M Documentation Guidelines" for c in chunks)


def test_retrieve_chunks_inpatient_uses_1997cms(db_session):
    """Test #6: billed_code=99221 -> retrieved chunks from 1997 CMS guidelines."""
    if not _has_ingested_data(db_session):
        pytest.skip("No ingested documents - run `python scripts/ingest.py` first.")

    routing = guideline_router.route("99221")
    chunks = retrieve_chunks(
        "history and exam documentation requirements for initial inpatient visit",
        db_session,
        routing,
    )

    assert len(chunks) > 0
    assert all(c.source != "AMA 2021 E/M Guidelines" for c in chunks)
