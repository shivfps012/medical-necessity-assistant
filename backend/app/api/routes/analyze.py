from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.encounter import EncounterRequest
from app.models.response import AnalyzeResponse
from app.services.analyzer import analyze_encounter

router = APIRouter(tags=["analyze"])


@router.post("/analyze-encounter", response_model=AnalyzeResponse)
def post_analyze_encounter(request: EncounterRequest, db: Session = Depends(get_db)) -> AnalyzeResponse:
    try:
        return analyze_encounter(request, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Encounter analysis failed: {exc}") from exc
