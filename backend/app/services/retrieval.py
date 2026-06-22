"""
retrieval.py

Vector similarity search over `document_chunks`, with metadata filtering
applied BEFORE similarity ranking. This is what makes retrieval "tight"
(Rule 3): we never run an unfiltered top-k search across all five
documents when a billed_code lets us narrow the candidate set first.
"""
from dataclasses import dataclass
from typing import List, Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import DocumentChunk
from app.services.guideline_router import RoutingDecision
from app.services.ingestion import embed_text

settings = get_settings()


@dataclass
class RetrievedChunk:
    content: str
    source: str
    section: str
    page: str
    similarity: float


def retrieve_chunks(
    query: str,
    db: Session,
    routing: RoutingDecision,
    top_k: Optional[int] = None,
) -> List[RetrievedChunk]:
    """
    1. Embeds `query`.
    2. Filters candidate chunks to `routing.included_versions` (if set) —
       this is the supersession enforcement point (Rule 5).
    3. Ranks remaining chunks by cosine distance.
    4. Drops anything below `similarity_threshold` and caps results at
       `top_k` (default from settings — Section 12.1: top_k = 4).
    """
    query_embedding = embed_text(query, purpose="query")
    distance_expr = DocumentChunk.embedding.cosine_distance(query_embedding)
    max_distance = 1 - settings.similarity_threshold
    k = top_k or settings.top_k_results

    stmt = select(DocumentChunk, distance_expr.label("distance"))

    if routing.included_versions is not None:
        stmt = stmt.where(DocumentChunk.version.in_(routing.included_versions))

    stmt = stmt.where(distance_expr <= max_distance)
    stmt = stmt.order_by(distance_expr.asc()).limit(k)

    rows = db.execute(stmt).all()

    return [
        RetrievedChunk(
            content=chunk.content,
            source=chunk.source,
            section=chunk.section or "General",
            page=chunk.page or "N/A",
            similarity=round(1 - float(distance), 4),
        )
        for chunk, distance in rows
    ]


def retrieve_keyword_chunks(
    terms: List[str],
    db: Session,
    routing: RoutingDecision,
    top_k: Optional[int] = None,
) -> List[RetrievedChunk]:
    """
    Fallback for exact audit/compliance terms that vector search can miss,
    especially short queries such as "LAMA" or "total time".
    """
    k = top_k or settings.top_k_results
    stmt = select(DocumentChunk)

    if routing.included_versions is not None:
        stmt = stmt.where(DocumentChunk.version.in_(routing.included_versions))

    stmt = stmt.where(or_(*[DocumentChunk.content.ilike(f"%{term}%") for term in terms]))
    stmt = stmt.limit(k)

    rows = db.execute(stmt).scalars().all()
    return [
        RetrievedChunk(
            content=chunk.content,
            source=chunk.source,
            section=chunk.section or "General",
            page=chunk.page or "N/A",
            similarity=1.0,
        )
        for chunk in rows
    ]


def format_chunks_for_prompt(chunks: List[RetrievedChunk]) -> str:
    """Renders retrieved chunks as a numbered, citation-ready block for the LLM prompt."""
    if not chunks:
        return "(No chunks met the similarity threshold — no relevant excerpts found.)"

    blocks = []
    for i, c in enumerate(chunks, start=1):
        blocks.append(
            f"[Excerpt {i}] Source: {c.source} | Section: {c.section} | Page: {c.page}\n{c.content}"
        )
    return "\n\n".join(blocks)
