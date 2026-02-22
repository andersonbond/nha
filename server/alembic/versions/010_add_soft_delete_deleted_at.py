"""add soft delete deleted_at to projects and programs

Revision ID: 010
Revises: 009
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "010"
down_revision: Union[str, Sequence[str], None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "programs",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("projects", "deleted_at")
    op.drop_column("programs", "deleted_at")
