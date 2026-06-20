import pytest
from httpx import AsyncClient

@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict[str, str]:
    # Register user
    await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Project Creator",
            "email": "creator@example.com",
            "password": "securepassword123"
        }
    )
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "creator@example.com",
            "password": "securepassword123"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.anyio
async def test_create_project(client: AsyncClient, auth_headers: dict[str, str]):
    response = await client.post(
        "/api/v1/projects",
        json={
            "title": "My Awesome Project",
            "idea": "An AI agent that optimizes startup infrastructure cost estimates.",
            "industry": "Technology"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My Awesome Project"
    assert data["idea"] == "An AI agent that optimizes startup infrastructure cost estimates."
    assert data["industry"] == "Technology"
    assert "id" in data
    assert data["version"] == 1

@pytest.mark.anyio
async def test_list_projects(client: AsyncClient, auth_headers: dict[str, str]):
    # Create two projects
    await client.post(
        "/api/v1/projects",
        json={"title": "Project One", "idea": "Idea for project one", "industry": "Finance"},
        headers=auth_headers
    )
    await client.post(
        "/api/v1/projects",
        json={"title": "Project Two", "idea": "Idea for project two", "industry": "Healthcare"},
        headers=auth_headers
    )
    
    # List projects
    response = await client.get("/api/v1/projects", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Project Two"  # Ordered by created_at desc
    assert data[1]["title"] == "Project One"

@pytest.mark.anyio
async def test_get_project_by_id(client: AsyncClient, auth_headers: dict[str, str]):
    # Create project
    create_response = await client.post(
        "/api/v1/projects",
        json={"title": "Single Project", "idea": "This is a single project", "industry": "Retail"},
        headers=auth_headers
    )
    project_id = create_response.json()["id"]

    # Get project
    response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Single Project"

@pytest.mark.anyio
async def test_get_project_not_found(client: AsyncClient, auth_headers: dict[str, str]):
    response = await client.get("/api/v1/projects/9999", headers=auth_headers)
    assert response.status_code == 404

@pytest.mark.anyio
async def test_update_project(client: AsyncClient, auth_headers: dict[str, str]):
    # Create project
    create_response = await client.post(
        "/api/v1/projects",
        json={"title": "Old Project Title", "idea": "This is a simple project description", "industry": "Retail"},
        headers=auth_headers
    )
    project_id = create_response.json()["id"]

    # Update project
    response = await client.put(
        f"/api/v1/projects/{project_id}",
        json={"title": "New Project Title", "industry": "E-commerce"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Project Title"
    assert data["industry"] == "E-commerce"
    assert data["idea"] == "This is a simple project description" # unchanged

@pytest.mark.anyio
async def test_delete_project(client: AsyncClient, auth_headers: dict[str, str]):
    # Create project
    create_response = await client.post(
        "/api/v1/projects",
        json={"title": "Delete Me", "idea": "This is a project to delete", "industry": "Retail"},
        headers=auth_headers
    )
    project_id = create_response.json()["id"]

    # Delete project
    response = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify deleted
    get_response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert get_response.status_code == 404
