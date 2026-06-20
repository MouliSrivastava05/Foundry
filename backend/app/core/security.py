"""
Foundry Backend – JWT & Password Security

Handles password hashing (bcrypt via passlib) and JWT token creation/verification.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt


from app.core.config import get_settings

# ── Password Hashing ─────────────────────────────────────────────────────────


def hash_password(password: str) -> str:
    """Return a bcrypt hash of the given plaintext password."""
    # bcrypt.hashpw expects bytes for password and salt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its bcrypt hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )



# ── JWT Tokens ────────────────────────────────────────────────────────────────


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload to encode (must include "sub" with user identifier).
        expires_delta: Optional custom expiry; defaults to config value.

    Returns:
        Encoded JWT string.
    """
    settings = get_settings()
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict:
    """
    Decode and verify a JWT access token.

    Raises:
        jwt.ExpiredSignatureError: If the token has expired.
        jwt.InvalidTokenError: If the token is malformed or invalid.
    """
    settings = get_settings()
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
