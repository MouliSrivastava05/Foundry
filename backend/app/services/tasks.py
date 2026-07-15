import asyncio
# pyrefly: ignore [missing-import]
import structlog
from app.services.celery_app import celery_app
from app.db.session import async_session_factory
from app.models import Project, AgentOutput
from app.services.graph import ai_graph
# pyrefly: ignore [missing-import]
from sqlalchemy import select, func

logger = structlog.get_logger()

async def run_ai_pipeline_async(project_id: int):
    logger.info("starting_async_ai_pipeline", project_id=project_id)
    
    # 1. Fetch Project and determine current output version
    async with async_session_factory() as session:
        async with session.begin():
            # Get project
            project = await session.get(Project, project_id)
            if not project:
                logger.error("project_not_found", project_id=project_id)
                return
            
            # Update status to processing
            project.status = "processing"
            session.add(project)
            
            # Find next version number for this project's outputs
            version_query = select(func.coalesce(func.max(AgentOutput.version), 0)).where(
                AgentOutput.project_id == project_id
            )
            res = await session.execute(version_query)
            current_max_version = res.scalar_one()
            next_version = current_max_version + 1
            
        await session.commit()

    # 2. Run the compiled LangGraph workflow
    initial_state = {
        "project_id": project_id,
        "idea": project.idea,
        "industry": project.industry,
        "research": None,
        "prd": None,
        "personas": None,
        "user_stories": None,
        "prioritization": None,
        "architecture": None,
        "roadmap": None,
        "cost_estimate": None,
        "scaffolding": None,
        "ui": None,
        "tokens_used": 0,
        "duration_ms": 0,
        "version": next_version
    }
    
    try:
        # Run graph to completion
        final_state = await ai_graph.ainvoke(initial_state)
        
        # 3. Update project status to completed
        async with async_session_factory() as session:
            async with session.begin():
                db_project = await session.get(Project, project_id)
                if db_project:
                    db_project.status = "completed"
                    session.add(db_project)
            await session.commit()
            
        logger.info(
            "ai_pipeline_completed_successfully",
            project_id=project_id,
            duration_ms=final_state.get("duration_ms", 0)
        )
    except Exception as e:
        logger.error("ai_pipeline_failed", project_id=project_id, error=str(e))
        
        # Update project status to failed
        async with async_session_factory() as session:
            async with session.begin():
                db_project = await session.get(Project, project_id)
                if db_project:
                    db_project.status = "failed"
                    session.add(db_project)
            await session.commit()
        raise e

@celery_app.task(name="app.services.tasks.run_ai_pipeline_task")
def run_ai_pipeline_task(project_id: int):
    """Celery task entrypoint."""
    # Run the async loop inside the Celery worker thread
    return asyncio.run(run_ai_pipeline_async(project_id))
