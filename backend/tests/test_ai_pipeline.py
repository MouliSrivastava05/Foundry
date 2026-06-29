import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.future import select

from app.models import Project, AgentOutput, User
from app.services.graph import ai_graph
from app.services.tasks import run_ai_pipeline_async
from app.services.schemas import (
    PRDModel, FeatureModel, PersonaListModel, PersonaModel,
    UserStoryListModel, UserStoryModel, PrioritizationModel
)

# ── Mocking LLM Output Classes ──────────────────────────────────────────────

class MockStructuredLLM:
    def __init__(self, response_model):
        self.response_model = response_model

    def invoke(self, messages, **kwargs):
        if self.response_model == PRDModel:
            return PRDModel(
                title="Mock Project PRD",
                summary="This is a mock startup summary.",
                features=[
                    FeatureModel(name="Mock Feature 1", description="Description for mock feature 1"),
                    FeatureModel(name="Mock Feature 2", description="Description for mock feature 2")
                ]
            )
        elif self.response_model == PersonaListModel:
            return PersonaListModel(
                personas=[
                    PersonaModel(name="Mock Persona 1", role="Developer", goal="Write code fast", frustration="Slow API response"),
                    PersonaModel(name="Mock Persona 2", role="Product Manager", goal="Plan features", frustration="Misaligned requirements")
                ]
            )
        elif self.response_model == UserStoryListModel:
            return UserStoryListModel(
                stories=[
                    UserStoryModel(id="US-001", title="Code scaffolding", description="As a developer I want scaffolding so that I save time"),
                    UserStoryModel(id="US-002", title="PRD view", description="As a PM I want to view PRD so that I can verify alignment"),
                    UserStoryModel(id="US-003", title="Prioritize dashboard", description="As a user I want to prioritize stories")
                ]
            )
        elif self.response_model == PrioritizationModel:
            return PrioritizationModel(
                must_have=["US-001"],
                should_have=["US-002"],
                could_have=["US-003"]
            )
        raise ValueError(f"Unknown response model: {self.response_model}")

def mock_get_llm(*args, **kwargs):
    mock_llm = MagicMock()
    def side_effect(response_model):
        return MockStructuredLLM(response_model)
    mock_llm.with_structured_output.side_effect = side_effect
    return mock_llm


# ── AI Pipeline Test Cases ───────────────────────────────────────────────────

@pytest.mark.anyio
@patch("app.services.graph.get_llm", side_effect=mock_get_llm)
async def test_langgraph_workflow_nodes(mock_llm_getter, db, monkeypatch):
    """
    Test that the LangGraph sequential nodes execute and transition
    correctly, saving agent output files into the database.
    """
    # 1. Setup Test Database session overrides sharing the test session
    from contextlib import asynccontextmanager

    @asynccontextmanager
    async def mock_session_factory():
        yield db

    monkeypatch.setattr("app.services.graph.async_session_factory", mock_session_factory)
    monkeypatch.setattr("app.services.tasks.async_session_factory", mock_session_factory)

    # 2. Create mock creator & project
    creator = User(name="AI Test User", email="aitest@example.com", hashed_password="hashed")
    db.add(creator)
    await db.flush()

    project = Project(
        title="AI Workflow Test",
        idea="Building a dynamic system for automated software generation specifications.",
        industry="SaaS",
        version=1,
        created_by=creator.id,
        status="idle"
    )
    db.add(project)
    await db.commit()

    # 3. Invoke LangGraph direct DAG
    initial_state = {
        "project_id": project.id,
        "idea": project.idea,
        "industry": project.industry,
        "prd": None,
        "personas": None,
        "user_stories": None,
        "prioritization": None,
        "tokens_used": 0,
        "duration_ms": 0,
        "version": 1
    }

    final_state = await ai_graph.ainvoke(initial_state)

    # 4. Assert State Transition Completeness
    assert final_state["prd"]["title"] == "Mock Project PRD"
    assert len(final_state["personas"]) == 2
    assert final_state["personas"][0]["name"] == "Mock Persona 1"
    assert len(final_state["user_stories"]) == 3
    assert final_state["prioritization"]["must_have"] == ["US-001"]

    # 5. Verify database persists outputs for each node
    res = await db.execute(
        select(AgentOutput).where(AgentOutput.project_id == project.id).order_by(AgentOutput.created_at.asc())
    )
    outputs = res.scalars().all()
    
    assert len(outputs) == 4
    agent_names = [out.agent_name for out in outputs]
    assert "PRD_Agent" in agent_names
    assert "Persona_Agent" in agent_names
    assert "Story_Agent" in agent_names
    assert "Prioritization_Agent" in agent_names


@pytest.mark.anyio
@patch("app.services.graph.get_llm", side_effect=mock_get_llm)
async def test_celery_task_wrapper(mock_llm_getter, db, monkeypatch):
    """
    Test the complete execution cycle of the async Celery wrapper function.
    Checks status changes: idle -> processing -> completed.
    """
    # 1. Setup Test Database session overrides sharing the test session
    from contextlib import asynccontextmanager

    @asynccontextmanager
    async def mock_session_factory():
        yield db

    monkeypatch.setattr("app.services.graph.async_session_factory", mock_session_factory)
    monkeypatch.setattr("app.services.tasks.async_session_factory", mock_session_factory)

    # 2. Create user and project
    creator = User(name="AI Task User", email="aitest2@example.com", hashed_password="hashed")
    db.add(creator)
    await db.flush()

    project = Project(
        title="Celery Wrapper Test",
        idea="Testing our Celery background task processing workflow.",
        industry="DevOps",
        version=1,
        created_by=creator.id,
        status="idle"
    )
    db.add(project)
    await db.commit()

    # 3. Call the asynchronous runner directly
    await run_ai_pipeline_async(project.id)

    # 4. Refresh project status from database and assert it set to 'completed'
    await db.refresh(project)
    assert project.status == "completed"

    # 5. Test failure state updates status to 'failed' on LLM exception
    err_project = Project(
        title="Failure Scenario Test",
        idea="Invalid concept that raises an LLM API error scenario.",
        industry="QA",
        version=1,
        created_by=creator.id,
        status="idle"
    )
    db.add(err_project)
    await db.commit()

    # Mock LLM to throw an exception
    with patch("app.services.graph.get_llm") as mock_err_llm:
        mock_err_llm.side_effect = Exception("Groq API Timeout Error")
        
        with pytest.raises(Exception):
            await run_ai_pipeline_async(err_project.id)
            
    await db.refresh(err_project)
    assert err_project.status == "failed"
