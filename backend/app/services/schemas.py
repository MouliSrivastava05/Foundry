from pydantic import BaseModel, Field

# ── PRD Schemas ──────────────────────────────────────────────

class FeatureModel(BaseModel):
    name: str = Field(..., description="Name of the feature")
    description: str = Field(..., description="Detailed description of the feature and what it accomplishes")

class PRDModel(BaseModel):
    title: str = Field(..., description="Project requirement document title")
    summary: str = Field(..., description="Summary statement detailing the core business purpose and problem statement")
    features: list[FeatureModel] = Field(..., min_length=2, description="List of primary software requirements and features")

# ── Persona Schemas ──────────────────────────────────────────

class PersonaModel(BaseModel):
    name: str = Field(..., description="Full name of the user archetype")
    role: str = Field(..., description="Job role, profile, or demographic description")
    goal: str = Field(..., description="Key goal or objective they wish to accomplish using the website/app")
    frustration: str = Field(..., description="Core pain point, roadblock, or frustration they face in current workflows")

class PersonaListModel(BaseModel):
    personas: list[PersonaModel] = Field(..., min_length=2, description="List of target user personas")

# ── User Story Schemas ───────────────────────────────────────

class UserStoryModel(BaseModel):
    id: str = Field(..., description="Deterministically formatted unique story ID, e.g. US-001, US-002")
    title: str = Field(..., description="Short descriptive title of the user action")
    description: str = Field(..., description="Standard Agile description format: 'As a [role], I want to [action] so that [benefit]'")

class UserStoryListModel(BaseModel):
    stories: list[UserStoryModel] = Field(..., min_length=3, description="List of epic and feature-level user stories")

# ── Prioritization Schemas ───────────────────────────────────

class PrioritizationModel(BaseModel):
    must_have: list[str] = Field(..., description="List of story IDs that are absolutely critical for the MVP")
    should_have: list[str] = Field(..., description="List of story IDs that are important but not launch-critical")
    could_have: list[str] = Field(..., description="List of story IDs that represent nice-to-have features for future scopes")
