from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/medical_assistant"
    gemini_api_key: str 
    llm_model: str = "gemini-2.5-flash"
    embedding_model: str = "gemini-embedding-2" 
    embedding_dimensions: int = 768

    similarity_threshold: float = 0.75
    top_k_results: int = 4

    chunk_size: int = 800
    chunk_overlap: int = 150
    max_answer_sentences: int = 4


    embedding_request_delay_seconds: float = 0.25
    gemini_retry_attempts: int = 3

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache
def get_settings() -> Settings:
    """Cached so we parse the .env file once per process."""
    settings = Settings()
    return settings