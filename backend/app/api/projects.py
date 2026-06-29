import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import Project, User, AgentOutput
from app.schemas import ProjectCreate, ProjectResponse, ProjectUpdate, AgentOutputResponse
from app.api.deps import get_current_user

logger = structlog.get_logger()
router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new project.
    """
    db_project = Project(
        title=project_in.title,
        idea=project_in.idea,
        industry=project_in.industry,
        version=1,
        created_by=current_user.id
    )
    db.add(db_project)
    await db.flush()
    logger.info("project_created", project_id=db_project.id, user_id=current_user.id)
    return db_project

@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all projects for the current user.
    """
    result = await db.execute(
        select(Project)
        .where(Project.created_by == current_user.id)
        .order_by(Project.created_at.desc())
    )
    projects = result.scalars().all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific project by ID.
    """
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.created_by == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        logger.warning("project_not_found", project_id=project_id, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a specific project.
    """
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.created_by == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        logger.warning("project_not_found_for_update", project_id=project_id, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    for field, value in project_in.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.flush()
    logger.info("project_updated", project_id=project.id, user_id=current_user.id)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a specific project.
    """
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.created_by == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        logger.warning("project_not_found_for_delete", project_id=project_id, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    await db.delete(project)
    logger.info("project_deleted", project_id=project_id, user_id=current_user.id)
    return None

@router.post("/{project_id}/run", status_code=status.HTTP_202_ACCEPTED)
async def run_project_pipeline(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trigger the asynchronous AI agent blueprint generation pipeline.
    """
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.created_by == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        logger.warning("project_not_found_for_run", project_id=project_id, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Import here to avoid circular dependencies
    from app.services.tasks import run_ai_pipeline_task
    
    # Trigger Celery task asynchronously
    run_ai_pipeline_task.delay(project_id)
    
    logger.info("project_pipeline_triggered", project_id=project_id, user_id=current_user.id)
    return {"status": "processing", "message": "AI pipeline generation triggered"}

@router.get("/{project_id}/outputs", response_model=list[AgentOutputResponse])
async def get_project_outputs(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all generated agent outputs for a specific project.
    """
    # Verify project ownership
    proj_result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.created_by == current_user.id)
    )
    project = proj_result.scalars().first()
    if not project:
        logger.warning("project_not_found_for_outputs", project_id=project_id, user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
        
    outputs_result = await db.execute(
        select(AgentOutput)
        .where(AgentOutput.project_id == project_id)
        .order_by(AgentOutput.version.desc(), AgentOutput.created_at.asc())
    )
    outputs = outputs_result.scalars().all()
    return outputs

