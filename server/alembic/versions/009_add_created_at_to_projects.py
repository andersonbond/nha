"""add created_at to projects

Revision ID: 009
Revises: 008
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "009"
down_revision: Union[str, Sequence[str], None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("projects", "created_at")
