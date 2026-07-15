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

# ── Research Schemas ──────────────────────────────────────────

class CompetitorModel(BaseModel):
    name: str = Field(..., description="Name of the competitor startup or product")
    url: str = Field(..., description="Web URL of the competitor, e.g. https://competitor.com")
    summary: str = Field(..., description="Brief summary of their value proposition, strengths, or weaknesses")

class ResearchModel(BaseModel):
    competitors: list[CompetitorModel] = Field(..., description="List of direct and indirect competitors identified")
    market_overview: str = Field(..., description="High-level description of market trends, size, and landscape")
    opportunities: str = Field(..., description="Market gaps, opportunities, or differentiators identified")

# ── Architecture Schemas ──────────────────────────────────────

class TableDesignModel(BaseModel):
    name: str = Field(..., description="Name of the database table, e.g. users, products")
    columns: list[str] = Field(..., description="List of key columns, data types, and constraints, e.g. id (SERIAL, PK)")

class RouteDesignModel(BaseModel):
    path: str = Field(..., description="REST API endpoint route path, e.g. /api/v1/auth/login")
    method: str = Field(..., description="HTTP Method, e.g. GET, POST, PUT, DELETE")
    description: str = Field(..., description="Brief description of what the endpoint does")

class ArchitectModel(BaseModel):
    tables: list[TableDesignModel] = Field(..., description="List of recommended database tables")
    api_endpoints: list[RouteDesignModel] = Field(..., description="List of core REST API endpoints")

# ── Roadmap Schemas ───────────────────────────────────────────

class RoadmapModel(BaseModel):
    sprint_1: list[str] = Field(..., description="Story IDs allocated to Sprint 1 (Foundation & Setup)")
    sprint_2: list[str] = Field(..., description="Story IDs allocated to Sprint 2 (Core MVP Features)")
    sprint_3: list[str] = Field(..., description="Story IDs allocated to Sprint 3 (Advanced Features & Integrations)")
    sprint_4: list[str] = Field(..., description="Story IDs allocated to Sprint 4 (Hardening, Testing & Launch Prep)")

# ── Cost Estimation Schemas ───────────────────────────────────

class CostTierModel(BaseModel):
    scale_100: str = Field(..., description="Estimated cost details for 100 users")
    scale_1k: str = Field(..., description="Estimated cost details for 1,000 users")
    scale_10k: str = Field(..., description="Estimated cost details for 10,000 users")

class CostModel(BaseModel):
    compute_cost: CostTierModel = Field(..., description="Estimate for hosting/compute costs")
    database_cost: CostTierModel = Field(..., description="Estimate for database/storage costs")
    cdn_cost: CostTierModel = Field(..., description="Estimate for content delivery network and bandwidth")
    total_monthly: CostTierModel = Field(..., description="Estimated sum of total monthly cloud costs")

# ── Scaffolding Schemas ───────────────────────────────────────

class ScaffoldingModel(BaseModel):
    file_tree: str = Field(..., description="Ascii/text based directory tree showing folder and file structure layout")
    instructions: str = Field(..., description="Quick start developer instructions to set up the scaffolding")

# ── UI Blueprint Schemas ──────────────────────────────────────

class UIModel(BaseModel):
    html_code: str = Field(
        ...,
        description=(
            "A complete, self-contained HTML document (including inline <style> CSS) that serves "
            "as a professional landing page for the startup. Must include a hero section with a "
            "headline and CTA button, a features/benefits section, and a footer. Use modern CSS "
            "with a visually impressive color palette chosen to match the startup's brand/industry. "
            "Do NOT use external CDN links or JavaScript frameworks — pure HTML and inline CSS only."
        )
    )
    style_description: str = Field(
        ...,
        description="A one-sentence description of the visual style chosen, e.g. 'Dark glassmorphism with violet accents targeting fintech professionals.'"
    )

