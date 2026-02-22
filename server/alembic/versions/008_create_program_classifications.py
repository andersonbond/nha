"""create program_classifications table

Revision ID: 008
Revises: 007
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "008"
down_revision: Union[str, Sequence[str], None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "program_classifications",
        sa.Column("program_class", sa.Numeric(5, 2), primary_key=True),
        sa.Column("description", sa.String(50), nullable=True),
        sa.Column("program_code", sa.String(12), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("program_classifications")
