"""add approval workflow columns to projects and programs

Revision ID: 012
Revises: 011
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "012"
down_revision: Union[str, Sequence[str], None] = "011"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # projects
    op.add_column(
        "projects",
        sa.Column("approval_status", sa.String(20), server_default="pending_approval", nullable=False),
    )
    op.add_column(
        "projects",
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column("approved_by", sa.String(255), nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column("rejection_reason", sa.Text(), nullable=True),
    )
    op.execute(sa.text("UPDATE projects SET approval_status = 'approved'"))

    # programs
    op.add_column(
        "programs",
        sa.Column("approval_status", sa.String(20), server_default="pending_approval", nullable=False),
    )
    op.add_column(
        "programs",
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "programs",
        sa.Column("approved_by", sa.String(255), nullable=True),
    )
    op.add_column(
        "programs",
        sa.Column("rejection_reason", sa.Text(), nullable=True),
    )
    op.execute(sa.text("UPDATE programs SET approval_status = 'approved'"))


def downgrade() -> None:
    op.drop_column("projects", "rejection_reason")
    op.drop_column("projects", "approved_by")
    op.drop_column("projects", "approved_at")
    op.drop_column("projects", "approval_status")
    op.drop_column("programs", "rejection_reason")
    op.drop_column("programs", "approved_by")
    op.drop_column("programs", "approved_at")
    op.drop_column("programs", "approval_status")
