"""
Output models — one for each endpoint's response body.

Field names match Section 8.1 and 8.2 exactly. `Citation` is shared by
both responses since both endpoints must cite document + section + page
(Rule 2 — "Always Cite Exactly").
"""
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class Citation(BaseModel):
    document: str = Field(..., description="Exact source document name")
    section: str = Field(..., description="Exact section name within the document")
    page: str = Field(..., description="Page number")


class AnalyzeResponse(BaseModel):
    billed_code: str
    supported: bool
    reasoning: str = Field(..., description="Max 4 sentences (Rule 4)")
    documentation_gaps: List[str]
    denial_risk: Literal["LOW", "MODERATE", "HIGH"]
    recommended_code: Optional[str] = None
    citation: Citation


class AskResponse(BaseModel):
    answer: str = Field(..., description="Max 4 sentences (Rule 4)")
    citation: Citation
