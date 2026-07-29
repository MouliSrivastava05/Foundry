import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime
    groq_api_key: str | None = None
    tavily_api_key: str | None = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdateProfile(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    groq_api_key: str | None = None
    tavily_api_key: str | None = None

class UserUpdatePassword(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6, max_length=100)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str | None = None
