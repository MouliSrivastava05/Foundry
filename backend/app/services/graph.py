import time
import json
from typing import TypedDict, Optional, Any
import structlog
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage

from app.db.session import async_session_factory
from app.models import AgentOutput, Project
from app.services.llm import get_llm, invoke_llm_with_retry
from app.services.research import perform_web_search
from app.services.schemas import (
    PRDModel,
    PersonaListModel,
    UserStoryListModel,
    PrioritizationModel,
    ResearchModel,
    ArchitectModel,
    RoadmapModel,
    CostModel,
    ScaffoldingModel
)

logger = structlog.get_logger()

# ── State Definition ──────────────────────────────────────────────────────────

class GraphState(TypedDict):
    project_id: int
    idea: str
    industry: Optional[str]
    research: Optional[dict[str, Any]]
    prd: Optional[dict[str, Any]]
    personas: Optional[list[dict[str, Any]]]
    user_stories: Optional[list[dict[str, Any]]]
    prioritization: Optional[dict[str, Any]]
    architecture: Optional[dict[str, Any]]
    roadmap: Optional[dict[str, Any]]
    cost_estimate: Optional[dict[str, Any]]
    scaffolding: Optional[dict[str, Any]]
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

# ── Node 0: Competitor Research Generator ──────────────────────────────────────

async def generate_research_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_research", project_id=state["project_id"])
    
    # 1. Fetch live competitor/market details using Tavily
    query = f"{state['idea']} competitors {state.get('industry') or ''}"
    search_context = perform_web_search(query)
    
    # 2. Invoke Groq LLM to structure competitor and market details
    llm = get_llm()
    structured_llm = llm.with_structured_output(ResearchModel)
    
    system_prompt = (
        "You are an expert Market Researcher. Given a startup idea and real-world web search snippets, "
        "analyze and identify direct or indirect competitors, provide a market trend overview, "
        "and list opportunity gaps or differentiators. "
        "Conform strictly to the JSON schema. Provide exactly 2-3 competitors with names, urls, and summaries."
    )
    
    user_content = f"Startup Idea: {state['idea']}\nSearch Snippets:\n{search_context}"
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: ResearchModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    research_dict = result.model_dump()
    raw_response = json.dumps(research_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Research_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=research_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "research": research_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 1: PRD Generator ─────────────────────────────────────────────────────

async def generate_prd_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_prd", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(PRDModel)
    
    system_prompt = (
        "You are an expert Principal Product Manager. Your task is to analyze a startup idea "
        "and produce a comprehensive Product Requirements Document (PRD). "
        "Take into consideration competitor data to highlight how your product differentiates itself. "
        "You must output a structured JSON document conforming to the schema with: "
        "1. A clean title. "
        "2. A detailed summary describing the core user pain point and target solution. "
        "3. A list of exactly 3 primary features, each containing a name and description."
    )
    
    user_content = (
        f"Startup Idea: {state['idea']}\n"
        f"Industry: {state.get('industry') or 'General'}\n"
        f"Competitor Research: {json.dumps(state['research'])}"
    )
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: PRDModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    prd_dict = result.model_dump()
    raw_response = json.dumps(prd_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="PRD_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=prd_dict,
        tokens_used=0,
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

# ── Node 5: Tech Architect Generator ──────────────────────────────────────────

async def generate_architecture_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_architecture", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(ArchitectModel)
    
    system_prompt = (
        "You are a Lead Software Architect. Given the PRD requirements and features, "
        "design a high-level technical architecture. "
        "Output a structured JSON document conforming to the schema with: "
        "1. Exactly 3 database table designs with names and column attributes. "
        "2. Exactly 3 core REST API endpoints with path, method, and description."
    )
    
    user_content = f"PRD: {json.dumps(state['prd'])}"
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: ArchitectModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    arch_dict = result.model_dump()
    raw_response = json.dumps(arch_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Architect_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=arch_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "architecture": arch_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 6: Sprint Roadmap Generator ──────────────────────────────────────────

async def generate_roadmap_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_roadmap", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(RoadmapModel)
    
    system_prompt = (
        "You are an expert Agile Scrum Master. Given a list of user stories, "
        "allocate every single user story ID into a 4-sprint milestone roadmap "
        "(Sprint 1, Sprint 2, Sprint 3, and Sprint 4). "
        "Conform strictly to the JSON schema. Each sprint list must contain story ID strings."
    )
    
    user_content = f"User Stories: {json.dumps(state['user_stories'])}"
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: RoadmapModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    roadmap_dict = result.model_dump()
    raw_response = json.dumps(roadmap_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Roadmap_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=roadmap_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "roadmap": roadmap_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 7: Cost Estimator Generator ──────────────────────────────────────────

async def generate_cost_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_cost_estimate", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(CostModel)
    
    system_prompt = (
        "You are a Cloud FinOps Architect. Analyze the technical architecture design "
        "and calculate monthly cost estimates for hosting Compute, Database, and CDN infrastructure "
        "at three tiers: 100 users, 1,000 users, and 10,000 concurrent users. "
        "Conform strictly to the JSON schema. Include a dollar sign and context in estimates (e.g. '$15/mo' or '$250/mo')."
    )
    
    user_content = f"Technical Architecture: {json.dumps(state['architecture'])}"
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: CostModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    cost_dict = result.model_dump()
    raw_response = json.dumps(cost_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Cost_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=cost_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "cost_estimate": cost_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Node 8: Code Scaffolder Generator ─────────────────────────────────────────

async def generate_scaffolding_node(state: GraphState) -> dict[str, Any]:
    logger.info("generating_scaffolding", project_id=state["project_id"])
    llm = get_llm()
    structured_llm = llm.with_structured_output(ScaffoldingModel)
    
    system_prompt = (
        "You are a Senior Lead Developer. Design a copy-pasteable monorepo folder file tree structure "
        "for a tech stack based on the architecture, and compile a quick onboarding command instructions text. "
        "Use standard ascii layout for the file tree. Conform strictly to the JSON schema."
    )
    
    user_content = (
        f"Startup Idea: {state['idea']}\n"
        f"Technical Architecture: {json.dumps(state['architecture'])}"
    )
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    start_time = time.time()
    result: ScaffoldingModel = structured_llm.invoke(messages)
    duration_ms = int((time.time() - start_time) * 1000)
    
    scaffold_dict = result.model_dump()
    raw_response = json.dumps(scaffold_dict)
    
    await save_agent_output(
        project_id=state["project_id"],
        agent_name="Scaffolding_Agent",
        version=state["version"],
        raw_response=raw_response,
        parsed_output=scaffold_dict,
        tokens_used=0,
        duration_ms=duration_ms
    )
    
    return {
        "scaffolding": scaffold_dict,
        "duration_ms": state["duration_ms"] + duration_ms
    }

# ── Graph Compilation ─────────────────────────────────────────────────────────

workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("generate_research", generate_research_node)
workflow.add_node("generate_prd", generate_prd_node)
workflow.add_node("generate_personas", generate_personas_node)
workflow.add_node("generate_stories", generate_stories_node)
workflow.add_node("generate_prioritization", generate_prioritization_node)
workflow.add_node("generate_architecture", generate_architecture_node)
workflow.add_node("generate_roadmap", generate_roadmap_node)
workflow.add_node("generate_cost", generate_cost_node)
workflow.add_node("generate_scaffolding", generate_scaffolding_node)

# Set Entry and Edges
workflow.set_entry_point("generate_research")
workflow.add_edge("generate_research", "generate_prd")
workflow.add_edge("generate_prd", "generate_personas")
workflow.add_edge("generate_personas", "generate_stories")
workflow.add_edge("generate_stories", "generate_prioritization")
workflow.add_edge("generate_prioritization", "generate_architecture")
workflow.add_edge("generate_architecture", "generate_roadmap")
workflow.add_edge("generate_roadmap", "generate_cost")
workflow.add_edge("generate_cost", "generate_scaffolding")
workflow.add_edge("generate_scaffolding", END)

# Compile the LangGraph
ai_graph = workflow.compile()
