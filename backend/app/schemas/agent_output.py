import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict

class AgentOutputBase(BaseModel):
    agent_name: str
    version: int
    raw_llm_response: str
    parsed_output: dict[str, Any]
    tokens_used: int
    duration_ms: int

class AgentOutputCreate(AgentOutputBase):
    project_id: int

class AgentOutputResponse(AgentOutputBase):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

