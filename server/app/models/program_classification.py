from sqlalchemy import Column, Numeric, String

from app.database import Base


class ProgramClassification(Base):
    """Lookup table for program classifications. Referenced by projects.program_class."""

    __tablename__ = "program_classifications"

    program_class = Column(Numeric(5, 2), primary_key=True)
    description = Column(String(50), nullable=True)
    program_code = Column(String(12), nullable=True)
