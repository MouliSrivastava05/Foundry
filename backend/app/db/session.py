"""
Foundry Backend – Database Session Management

Creates the async SQLAlchemy engine and session factory.
Provides a FastAPI dependency (`get_db`) for request-scoped sessions.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

settings = get_settings()

# Convert postgresql:// to postgresql+asyncpg:// for async support
_async_url = settings.database_url.replace(
    "postgresql://", "postgresql+asyncpg://", 1
)

engine = create_async_engine(
    _async_url,
    echo=False,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a request-scoped async DB session.
    Commits on success, rolls back on exception, always closes.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
