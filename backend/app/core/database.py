"""
PostgreSQL + pgvector connection layer.

Defines the single table the whole RAG pipeline reads/writes:
`document_chunks`. Every column maps directly to a metadata field required
by Section 12.2 of the spec, which is what lets guideline_router.py and
retrieval.py filter by source/version/applies_to_codes instead of doing a
single unfiltered similarity search.
"""
from sqlalchemy import create_engine, Column, Integer, String, Text, ARRAY
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pgvector.sqlalchemy import Vector

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class DocumentChunk(Base):
    """
    One row = one retrievable chunk of guideline text.

    Metadata columns (source, version, applies_to_codes, supersedes,
    priority, page, section) exist specifically so retrieval.py can apply
    a SQL WHERE filter BEFORE the vector similarity search runs — this is
    what enforces Rule 5 (guideline supersession) and Rule 3 (tight
    retrieval) at the data layer, not just in the prompt.
    """
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    content = Column(Text, nullable=False)
    embedding = Column(Vector(settings.embedding_dimensions), nullable=False)

    # --- Metadata (Section 12.2) ---
    source = Column(String, nullable=False, index=True)       
    version = Column(String, nullable=False, index=True)     
    section = Column(String, nullable=True)                 
    page = Column(String, nullable=True)                      
    applies_to_codes = Column(ARRAY(String), nullable=True)    
    supersedes = Column(String, nullable=True)                
    priority = Column(Integer, nullable=False, default=1)      


def init_db() -> None:
    """Create the pgvector extension (if missing) and all tables."""
    with engine.connect() as conn:
        conn.exec_driver_sql("CREATE EXTENSION IF NOT EXISTS vector;")
        conn.commit()
    Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    """FastAPI dependency — yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
