"""create programs table

Revision ID: 007
Revises: 006
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "007"
down_revision: Union[str, Sequence[str], None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "programs",
        sa.Column("project_prog_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("mc_ref", sa.String(50), nullable=True),
        sa.Column("interest_rate", sa.Numeric(7, 4), nullable=False, server_default=sa.text("0.0000")),
        sa.Column("delinquency_rate", sa.Numeric(7, 4), nullable=False, server_default=sa.text("0.0000")),
        sa.Column("max_term_yrs", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("programs")
