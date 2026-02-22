"""add soft delete deleted_at to applications and beneficiaries

Revision ID: 011
Revises: 010
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "011"
down_revision: Union[str, Sequence[str], None] = "010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "applications",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "beneficiaries",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("applications", "deleted_at")
    op.drop_column("beneficiaries", "deleted_at")
