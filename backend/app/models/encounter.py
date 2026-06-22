"""
Input models — one for each endpoint's request body.

Field names match Section 8.1 (POST /analyze-encounter) and Section 8.2
(POST /ask) exactly, including the nested `documentation` object.
"""
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class Documentation(BaseModel):
    HPI: str = Field(..., description="History of Present Illness text")
    exam: str = Field(..., description="Physical examination findings")
    assessment: str = Field(..., description="Clinical assessment and plan")


class EncounterRequest(BaseModel):
    visit_type: Literal["outpatient", "inpatient", "ED"]
    chief_complaint: str
    diagnoses: List[str]
    procedures: List[str]
    documentation: Documentation
    billed_code: str = Field(..., examples=["99214"])

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
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
            ]
        }
    }


class AskRequest(BaseModel):
    question: str
    billed_code: Optional[str] = Field(
        default=None, description="Optional — helps with guideline routing"
    )
