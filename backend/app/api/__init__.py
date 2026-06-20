from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(projects_router)

__all__ = ["api_router"]
