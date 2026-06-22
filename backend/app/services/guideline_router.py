"""
guideline_router.py

Implements Rule 5 (Non-Negotiable): AMA 2021 supersedes 1997 CMS for ALL
office/outpatient codes 99202-99215. Every other code range still uses
1997 CMS.

This module owns ONLY the routing decision — it does not touch the
database or the LLM. retrieval.py consumes its output to build a SQL
filter; analyzer.py passes its `reason` string into the LLM context so
the model can cite *why* a given guideline was used (Section 13.2, Step 5).
"""
from dataclasses import dataclass, field
from typing import List, Optional



OFFICE_OUTPATIENT_CODES: List[str] = [
    "99202", "99203", "99204", "99205",  
    "99212", "99213", "99214", "99215",  
]

INPATIENT_CODES: List[str] = ["99221", "99222", "99223", "99231", "99232", "99233"]
ED_CODES: List[str] = ["99281", "99282", "99283", "99284", "99285"]
NURSING_FACILITY_CODES: List[str] = ["99304", "99305", "99306", "99307", "99308", "99309", "99310"]
CONSULTATION_CODES: List[str] = ["99241", "99242", "99243", "99244", "99245"]

CMS_1997_CODES: List[str] = INPATIENT_CODES + ED_CODES + NURSING_FACILITY_CODES + CONSULTATION_CODES

VERSION_AMA_2021 = "2021"
VERSION_CMS_1997 = "1997"
VERSION_JAWDA = "jawda"
VERSION_HAAD = "haad"

ALWAYS_INCLUDED_VERSIONS = [VERSION_JAWDA, VERSION_HAAD]


@dataclass
class RoutingDecision:
    billed_code: Optional[str]
    primary_guideline: Optional[str]         
    primary_source_name: Optional[str]      
    included_versions: Optional[List[str]] = None
    excluded_versions: List[str] = field(default_factory=list)
    reason: str = ""


def route(billed_code: Optional[str]) -> RoutingDecision:
    """
    Step 1-5 of Section 13.2.

    Version filtering (Rule 5) only applies when `billed_code` maps
    confidently to a known code range. Free-text questions with no code,
    or a code outside any known range, get NO version filter — they fall
    back to plain similarity search across all five documents (still
    bounded by Rule 3's similarity threshold + top_k).
    """
    if not billed_code:
        return RoutingDecision(
            billed_code=None,
            primary_guideline=None,
            primary_source_name=None,
            included_versions=None,
            excluded_versions=[],
            reason="No billed_code provided — searching across all guideline documents, unfiltered by version.",
        )

    code = billed_code.strip()

    if code in OFFICE_OUTPATIENT_CODES:
        return RoutingDecision(
            billed_code=code,
            primary_guideline=VERSION_AMA_2021,
            primary_source_name="AMA 2021 E/M Guidelines",
            included_versions=[VERSION_AMA_2021] + ALWAYS_INCLUDED_VERSIONS,
            excluded_versions=[VERSION_CMS_1997],
            reason=(
                f"Code {code} is an office/outpatient E/M code (99202-99215). "
                "Per Rule 5, AMA 2021 supersedes 1997 CMS for this range, so "
                "retrieval is restricted to AMA 2021 + JAWDA Part IX + HAAD Coding Manual."
            ),
        )

    if code in CMS_1997_CODES:
        setting = _setting_for_1997_code(code)
        return RoutingDecision(
            billed_code=code,
            primary_guideline=VERSION_CMS_1997,
            primary_source_name="1997 CMS E/M Documentation Guidelines",
            included_versions=[VERSION_CMS_1997] + ALWAYS_INCLUDED_VERSIONS,
            excluded_versions=[VERSION_AMA_2021],
            reason=(
                f"Code {code} is a {setting} code, which is NOT in the AMA 2021 "
                "office/outpatient range. Per Section 3.1, this setting uses 1997 CMS "
                "guidelines. Retrieval is restricted to 1997 CMS + JAWDA Part IX + HAAD Coding Manual."
            ),
        )

    return RoutingDecision(
        billed_code=code,
        primary_guideline=None,
        primary_source_name=None,
        included_versions=None,
        excluded_versions=[],
        reason=(
            f"Code {code} is not in any recognized E/M code range in the source "
            "documents. No AMA 2021 / 1997 CMS guideline could be confidently routed."
        ),
    )


def _setting_for_1997_code(code: str) -> str:
    if code in INPATIENT_CODES:
        return "Inpatient"
    if code in ED_CODES:
        return "Emergency Department"
    if code in NURSING_FACILITY_CODES:
        return "Nursing Facility"
    if code in CONSULTATION_CODES:
        return "Outpatient Consultation"
    return "non-office/outpatient"


def is_office_outpatient(billed_code: Optional[str]) -> bool:
    return bool(billed_code) and billed_code.strip() in OFFICE_OUTPATIENT_CODES
