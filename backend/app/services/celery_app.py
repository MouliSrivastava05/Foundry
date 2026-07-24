from celery import Celery
from app.core import get_settings

settings = get_settings()

celery_app = Celery(
    "foundry_tasks",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend
)

conf_dict = {
    "task_serializer": "json",
    "accept_content": ["json"],
    "result_serializer": "json",
    "timezone": "UTC",
    "enable_utc": True,
    "task_track_started": True,
}

if settings.celery_broker_url.startswith("rediss://"):
    conf_dict["broker_use_ssl"] = {"ssl_cert_reqs": None}
if settings.celery_result_backend.startswith("rediss://"):
    conf_dict["redis_backend_use_ssl"] = {"ssl_cert_reqs": None}

celery_app.conf.update(**conf_dict)

# Auto-discover tasks from app/services/tasks.py
celery_app.autodiscover_tasks(["app.services"], force=True)
