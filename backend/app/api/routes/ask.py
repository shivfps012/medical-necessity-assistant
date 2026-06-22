from app.core.config import get_settings
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.encounter import AskRequest
from app.models.response import AskResponse
from app.services.analyzer import answer_question

router = APIRouter(tags=["ask"])


@router.post("/ask", response_model=AskResponse)
def post_ask(request: AskRequest, db: Session = Depends(get_db)) -> AskResponse:
    settings = get_settings()
    current_key = settings.gemini_api_key
    print("\n" + "="*40)
    print(f"ATTEMPTING TO ASK A QUESTION...")
    print(f"ACTIVE API KEY: ...{current_key[-8:]}")
    print(f"EMBEDDING MODEL: {settings.embedding_model}")
    print("="*40 + "\n")

    try:
        return answer_question(request, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Question answering failed: {exc}") from exc

