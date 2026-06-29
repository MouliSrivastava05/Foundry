import os
import time
import structlog
from langchain_groq import ChatGroq
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.core import get_settings

logger = structlog.get_logger()
settings = get_settings()

# Define rate limit exceptions we want to retry on
class GroqRateLimitError(Exception):
    """Exception raised when Groq returns HTTP 429 Rate Limit."""
    pass

# We check if the exception string indicates a rate limit
def is_rate_limit_error(exception: Exception) -> bool:
    err_str = str(exception).lower()
    if "429" in err_str or "rate limit" in err_str or "too many requests" in err_str:
        logger.warning("groq_rate_limited", error=err_str)
        return True
    return False

# Initialize the base LLM model
def get_llm(model_name: str = "llama3-70b-8192", temperature: float = 0.2) -> ChatGroq:
    """
    Initializes and returns the ChatGroq model instance.
    Uses Settings configuration for LangSmith tracing automatically if set.
    """
    # Configure LangSmith tracing if keys are present
    if settings.langsmith_api_key:
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_API_KEY"] = settings.langsmith_api_key
        os.environ["LANGCHAIN_PROJECT"] = settings.langsmith_project
        logger.info("langsmith_tracing_enabled", project=settings.langsmith_project)

    return ChatGroq(
        api_key=settings.groq_api_key,
        model_name=model_name,
        temperature=temperature
    )

# Tenacity decorator to retry on rate limit errors with exponential backoff
@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(GroqRateLimitError),
    reraise=True
)
def invoke_llm_with_retry(llm: ChatGroq, messages: list, **kwargs) -> any:
    """
    Invokes the LLM and retries automatically if a rate limit error is encountered.
    """
    try:
        start_time = time.time()
        response = llm.invoke(messages, **kwargs)
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Log successful completion and token usage
        token_usage = response.response_metadata.get("token_usage", {})
        logger.info(
            "llm_invocation_success",
            duration_ms=duration_ms,
            prompt_tokens=token_usage.get("prompt_tokens", 0),
            completion_tokens=token_usage.get("completion_tokens", 0),
            total_tokens=token_usage.get("total_tokens", 0)
        )
        return response
    except Exception as e:
        if is_rate_limit_error(e):
            raise GroqRateLimitError(f"Rate limit exceeded: {str(e)}")
        logger.error("llm_invocation_failed", error=str(e))
        raise e
