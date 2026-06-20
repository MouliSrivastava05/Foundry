import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_signup_success(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "password" not in data

@pytest.mark.anyio
async def test_signup_duplicate_email(client: AsyncClient):
    # Signup once
    await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    # Signup duplicate
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Another User",
            "email": "test@example.com",
            "password": "anotherpassword"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "A user with this email already exists."

@pytest.mark.anyio
async def test_login_success(client: AsyncClient):
    # Signup first
    await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.anyio
async def test_login_invalid_credentials(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

@pytest.mark.anyio
async def test_get_me(client: AsyncClient):
    # Signup and Login
    await client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Get Me
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
