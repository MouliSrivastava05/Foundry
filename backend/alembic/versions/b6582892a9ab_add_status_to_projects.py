"""add status to projects

Revision ID: b6582892a9ab
Revises: d1fb0e2076e8
Create Date: 2026-06-29 15:19:18.236987

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b6582892a9ab'
down_revision: Union[str, Sequence[str], None] = 'd1fb0e2076e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('projects', sa.Column('status', sa.String(length=50), nullable=False, server_default='idle'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('projects', 'status')
