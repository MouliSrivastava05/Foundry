from datetime import timedelta
import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core import get_settings, hash_password, verify_password, create_access_token
from app.db import get_db
from app.models import User
from app.schemas import UserRegister, UserResponse, Token, UserLogin
from app.api.deps import get_current_user

logger = structlog.get_logger()
router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    """
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        logger.warning("signup_failed_user_exists", email=user_in.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    # Create user
    hashed_pwd = hash_password(user_in.password)
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        is_active=True
    )
    db.add(db_user)
    await db.flush() # Flush to populate ID
    logger.info("user_signup_success", email=user_in.email, user_id=db_user.id)
    return db_user

@router.post("/login", response_model=Token)
async def login_json(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Standard JSON login endpoint.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        logger.warning("login_failed_invalid_credentials", email=user_in.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active:
        logger.warning("login_failed_inactive_user", email=user_in.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )

    access_token = create_access_token(data={"sub": user.email})
    logger.info("user_login_success", email=user.email, user_id=user.id)
    return Token(access_token=access_token, token_type="bearer")

@router.post("/login/oauth", response_model=Token)
async def login_oauth(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth2 compatible token login, for Swagger UI.
    """
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user profile.
    """
    return current_user
