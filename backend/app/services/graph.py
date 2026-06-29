import time
import json
from typing import TypedDict, Optional, Any
import structlog
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage

from app.db.session import async_session_factory
from app.models import AgentOutput, Project
from app.services.llm import get_llm, invoke_llm_with_retry
from app.services.schemas import (
    PRDModel,
    PersonaListModel,
    UserStoryListModel,
    PrioritizationModel
)

logger = structlog.get_logger()

# ── State Definition ──────────────────────────────────────────────────────────

class GraphState(TypedDict):
    project_id: int
    idea: str
    industry: Optional[str]
    prd: Optional[dict[str, Any]]
    personas: Optional[list[dict[str, Any]]]
    user_stories: Optional[list[dict[str, Any]]]
    prioritization: Optional[dict[str, Any]]
    tokens_used: int
    duration_ms: int
    version: int

# ── Helper function to save outputs to DB ─────────────────────────────────────

async def save_agent_output(
    project_id: int,
    agent_name: str,
    version: int,
    raw_response: str,
    parsed_output: dict[str, Any],
    tokens_used: int,
    duration_ms: int
):
    """Saves an agent output row to the database asynchronously."""
    async with async_session_factory() as session:
        async with session.begin():
            db_output = AgentOutput(
                project_id=project_id,
                agent_name=agent_name,
                version=version,
                raw_llm_response=raw_response,
                parsed_output=parsed_output,
                tokens_used=tokens_used,
                duration_ms=duration_ms
            )
            session.add(db_output)
        await session.commit()
    logger.info("agent_output_saved", agent_name=agent_name, project_id=project_id)

# ── Node 1: PRD Generator ─────────────────────────────────────────────────────

async def generate_prd_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_prd", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(PRDModel)
    
    system_prompt = (
        "You are an expert Principal Product Manager. Your task is to analyze a startup idea "
        "and produce a comprehensive Product Requirements Document (PRD). "
        "You must output a structured JSON document conforming to the schema with: "
        "1. A clean title. "
        "2. A detailed summary describing the core user pain point and target solution. "
        "3. A list of exactly 3 primary features, each containing a name and full description."
    )
    
    user_content = f"Startup Idea: {state['idea']}\nIndustry: {state.get('industry') or 'General'}"
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: PRDModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    prd_dict = result.model_dump()
    raw_response = json.dumps(prd_dict)
    
    # Save output to DB
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="PRD_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=prd_dict,
        tokens_used=0, # Groq metadata token tracking will be wired up later
        duration_ms=duration_ms
    )
    
    return {
        "prd": prd_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 2: Persona Generator ─────────────────────────────────────────────────

async def generate_personas_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_personas", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(PersonaListModel)
    
    system_prompt = (
        "You are an expert UX Researcher. Given a startup idea and its Product Requirements Document (PRD), "
        "generate exactly 2 distinct user personas (target customer profiles). "
        "Conform strictly to the JSON schema. Each persona must include: "
        "1. A name. "
        "2. Their role/demographic background. "
        "3. A core goal they want to achieve. "
        "4. A primary frustration or pain point they experience."
    )
    
    user_content = (
        f"Startup Idea: {state['idea']}\n"
        f"PRD: {json.dumps(state['prd'])}"
    )
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: PersonaListModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    personas_dict = result.model_dump()
    raw_response = json.dumps(personas_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Persona_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=personas_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "personas": personas_dict["personas"],
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 3: User Story Generator ──────────────────────────────────────────────

async def generate_stories_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_stories", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(UserStoryListModel)
    
    system_prompt = (
        "You are an expert Agile Scrum Master and Systems Analyst. "
        "Given the PRD features and target user personas, write exactly 4 detailed user stories. "
        "Conform strictly to the JSON schema. "
        "Each story must have a deterministic ID (e.g. US-001, US-002, US-003, US-004), a title, "
        "and a standard Agile description: 'As a [role], I want to [action] so that [benefit]'."
    )
    
    user_content = (
        f"PRD Features: {json.dumps(state['prd'].get('features', []))}\n"
        f"Personas: {json.dumps(state['personas'])}"
    )
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: UserStoryListModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    stories_dict = result.model_dump()
    raw_response = json.dumps(stories_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Story_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=stories_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "user_stories": stories_dict["stories"],
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 4: Prioritization Generator ──────────────────────────────────────────

async def generate_prioritization_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_prioritization", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(PrioritizationModel)
    
    system_prompt = (
        "You are an expert Agile Scrum Master. Given a list of user stories, "
        "categorize the story IDs into MoSCoW buckets: 'must_have', 'should_have', and 'could_have'. "
        "Every single story ID provided in the list must be allocated to exactly one bucket. "
        "Output a structured JSON document conforming to the schema."
    )
    
    story_ids = [story["id"] for story in state["user_stories"]]
    user_content = f"User Stories: {json.dumps(state['user_stories'])}"
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: PrioritizationModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    priority_dict = result.model_dump()
    raw_response = json.dumps(priority_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Prioritization_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=priority_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "prioritization": priority_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Graph Compilation ─────────────────────────────────────────────────────────

workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("generate_prd", generate_prd_node)
workflow.add_node("generate_personas", generate_personas_node)
workflow.add_node("generate_stories", generate_stories_node)
workflow.add_node("generate_prioritization", generate_prioritization_node)

# Set Entry and Edges
workflow.set_entry_point("generate_prd")
workflow.add_edge("generate_prd", "generate_personas")
workflow.add_edge("generate_personas", "generate_stories")
workflow.add_edge("generate_stories", "generate_prioritization")
workflow.add_edge("generate_prioritization", END)

# Compile the LangGraph
ai_graph = workflow.compile()
