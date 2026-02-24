"""widen project address code columns for Philippine admin codes

Revision ID: 017
Revises: 016
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "017"
down_revision: Union[str, Sequence[str], None] = "016"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "projects",
        "region_code",
        existing_type=sa.String(4),
        type_=sa.String(8),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "province_code",
        existing_type=sa.String(4),
        type_=sa.String(12),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "municipal_code",
        existing_type=sa.String(4),
        type_=sa.String(14),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "barangay_code",
        existing_type=sa.String(4),
        type_=sa.String(16),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "projects",
        "region_code",
        existing_type=sa.String(8),
        type_=sa.String(4),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "province_code",
        existing_type=sa.String(12),
        type_=sa.String(4),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "municipal_code",
        existing_type=sa.String(14),
        type_=sa.String(4),
        existing_nullable=True,
    )
    op.alter_column(
        "projects",
        "barangay_code",
        existing_type=sa.String(16),
        type_=sa.String(4),
        existing_nullable=True,
    )
