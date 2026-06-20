"""
Foundry Backend – SQLAlchemy Declarative Base

All models inherit from this Base so Alembic can auto-detect them.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Application-wide declarative base for SQLAlchemy models."""
    pass
