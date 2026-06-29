from celery import Celery
from app.core import get_settings

settings = get_settings()

celery_app = Celery(
    "foundry_tasks",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend
)

# Optional configuration overrides
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

# Auto-discover tasks from app/services/tasks.py
celery_app.autodiscover_tasks(["app.services"], force=True)
