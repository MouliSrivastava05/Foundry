import asyncio
from collections.abc import AsyncGenerator
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.main import app
from app.core import get_settings
from app.db import Base, get_db

settings = get_settings()
_async_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create a test engine
test_engine = create_async_engine(_async_url, echo=False)
TestSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields a test database session that is rolled back after each test.
    This keeps tests fast and independent.
    """
    async with test_engine.connect() as connection:
        transaction = await connection.begin()
        session = AsyncSession(bind=connection, expire_on_commit=False)
        yield session
        await session.close()
        await transaction.rollback()

@pytest.fixture
async def client(db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Yields an AsyncClient for testing the FastAPI application.
    """
    # Override get_db dependency to use the test db session
    async def _get_test_db():
        yield db

    app.dependency_overrides[get_db] = _get_test_db
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport, base_url="http://testserver"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


