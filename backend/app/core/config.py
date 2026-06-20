"""
Foundry Backend – Core Configuration

Uses pydantic-settings to load environment variables with validation.
All config is centralized here; no scattered os.getenv() calls elsewhere.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Database ──────────────────────────────────────────────
    database_url: str

    # ── JWT ───────────────────────────────────────────────────
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # ── Redis / Celery ────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"

    # ── CORS ──────────────────────────────────────────────────
    frontend_url: str = "http://localhost:5173"

    # ── Sentry ────────────────────────────────────────────────
    sentry_dsn: str = ""

    # ── LangSmith ─────────────────────────────────────────────
    langsmith_api_key: str = ""
    langsmith_project: str = "foundry"

    # ── Groq ──────────────────────────────────────────────────
    groq_api_key: str = ""

    # ── Tavily ────────────────────────────────────────────────
    tavily_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (parsed once per process)."""
    return Settings()
