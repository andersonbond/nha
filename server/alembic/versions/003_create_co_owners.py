"""create co_owners table

Revision ID: 003
Revises: 002
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, Sequence[str], None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "co_owners",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("beneficiary_id", sa.Integer(), nullable=True),
        sa.Column("last_name", sa.String(25), nullable=True),
        sa.Column("first_name", sa.String(25), nullable=True),
        sa.Column("middle_name", sa.String(25), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("sex", sa.CHAR(1), nullable=True),
        sa.Column("civil_status", sa.CHAR(1), nullable=True),
        sa.Column("relationship_type", sa.CHAR(1), nullable=True),
        sa.Column("sequence", sa.Integer(), nullable=True),
        sa.Column("address1", sa.String(30), nullable=True),
        sa.Column("address2", sa.String(30), nullable=True),
        sa.Column("spouse_last_name", sa.String(25), nullable=True),
        sa.Column("spouse_first_name", sa.String(25), nullable=True),
        sa.Column("spouse_middle_name", sa.String(25), nullable=True),
        sa.Column("spouse_birth_date", sa.Date(), nullable=True),
        sa.Column("membership_code", sa.CHAR(1), nullable=True),
        sa.Column("ssp", sa.CHAR(1), nullable=True),
        sa.Column("category", sa.String(10), nullable=True),
    )
    op.create_foreign_key(
        "co_owners_beneficiary_id_fkey",
        "co_owners",
        "beneficiaries",
        ["beneficiary_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("co_owners_beneficiary_id_fkey", "co_owners", type_="foreignkey")
    op.drop_table("co_owners")
