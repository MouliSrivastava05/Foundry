import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import structlog

logger = structlog.get_logger()

class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Celery Worker Healthy")

    def log_message(self, format, *args):
        # Suppress noisy health check logs
        pass

def start_health_server():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthCheckHandler)
    logger.info("health_check_server_started", port=port)
    server.serve_forever()

if __name__ == "__main__":
    # 1. Start HTTP health check server in background thread for Render
    threading.Thread(target=start_health_server, daemon=True).start()

    # 2. Start Celery worker in main thread
    from app.services.celery_app import celery_app
    celery_app.worker_main(["worker", "--loglevel=info", "--concurrency=2"])
