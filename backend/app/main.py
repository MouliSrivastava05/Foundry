import sentry_sdk
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import get_settings
from app.core.logging import setup_logging
from app.api import api_router

# Setup structured logging
setup_logging(json_format=False)  # Set to True in production
logger = structlog.get_logger()

settings = get_settings()

# Initialize Sentry if DSN is set
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )
    logger.info("sentry_initialized")

app = FastAPI(
    title="Foundry API",
    description="Multi-agent AI Product Strategist Platform Backend",
    version="0.1.0",
)

# CORS middleware configuration
origins = [
    settings.frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "healthy", "version": "0.1.0"}

@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to the Foundry API. Head to /docs for API documentation."}
