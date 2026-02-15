"""create beneficiaries table

Revision ID: 002
Revises: 001
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, Sequence[str], None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "beneficiaries",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("bin", sa.String(9), nullable=True),
        sa.Column("app_id", sa.String(10), nullable=True),
        sa.Column("last_name", sa.String(25), nullable=True),
        sa.Column("first_name", sa.String(25), nullable=True),
        sa.Column("middle_name", sa.String(25), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("sex", sa.CHAR(1), nullable=True),
        sa.Column("civil_status", sa.CHAR(1), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("membership_code", sa.CHAR(1), nullable=True),
        sa.Column("old_common_code", sa.String(20), nullable=True),
        sa.Column("common_code", sa.String(20), nullable=True),
        sa.Column("act_tag", sa.CHAR(1), nullable=True),
        sa.Column("indicator", sa.CHAR(1), nullable=True),
        sa.Column("inp_date", sa.Date(), nullable=True),
        sa.Column("ssp", sa.CHAR(1), nullable=True),
        sa.Column("category", sa.String(10), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("beneficiaries")
