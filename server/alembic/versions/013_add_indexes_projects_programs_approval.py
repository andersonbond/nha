"""add indexes for projects, programs and approval workflow

Revision ID: 013
Revises: 012
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op

revision: str = "013"
down_revision: Union[str, Sequence[str], None] = "012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # projects: list filters by deleted_at, approval_status, project_prog_id; approval workflow by approval_status
    op.create_index(
        "ix_projects_deleted_at",
        "projects",
        ["deleted_at"],
        unique=False,
    )
    op.create_index(
        "ix_projects_approval_status",
        "projects",
        ["approval_status"],
        unique=False,
    )
    op.create_index(
        "ix_projects_project_prog_id",
        "projects",
        ["project_prog_id"],
        unique=False,
    )
    # Composite index for common query: non-deleted + approval filter (e.g. pending_approval)
    op.create_index(
        "ix_projects_deleted_at_approval_status",
        "projects",
        ["deleted_at", "approval_status"],
        unique=False,
    )

    # programs: list and approval workflow filter by deleted_at, approval_status
    op.create_index(
        "ix_programs_deleted_at",
        "programs",
        ["deleted_at"],
        unique=False,
    )
    op.create_index(
        "ix_programs_approval_status",
        "programs",
        ["approval_status"],
        unique=False,
    )
    op.create_index(
        "ix_programs_deleted_at_approval_status",
        "programs",
        ["deleted_at", "approval_status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_programs_deleted_at_approval_status", table_name="programs")
    op.drop_index("ix_programs_approval_status", table_name="programs")
    op.drop_index("ix_programs_deleted_at", table_name="programs")
    op.drop_index("ix_projects_deleted_at_approval_status", table_name="projects")
    op.drop_index("ix_projects_project_prog_id", table_name="projects")
    op.drop_index("ix_projects_approval_status", table_name="projects")
    op.drop_index("ix_projects_deleted_at", table_name="projects")
