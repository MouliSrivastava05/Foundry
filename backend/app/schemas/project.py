import datetime
from pydantic import BaseModel, Field, ConfigDict

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    idea: str = Field(..., min_length=10)
    industry: str | None = Field(None, max_length=100)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    idea: str | None = Field(None, min_length=10)
    industry: str | None = Field(None, max_length=100)
    version: int | None = None

class ProjectResponse(ProjectBase):
    id: int
    version: int
    created_by: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

