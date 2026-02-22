from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.application import Application
from app.models.beneficiary import Beneficiary
from app.models.program import Program
from app.models.project import Project
from app.schemas.application import ApplicationResponse
from app.schemas.beneficiary import BeneficiaryResponse
from app.schemas.program import ProgramResponse
from app.schemas.project import ProjectResponse
from pydantic import BaseModel

router = APIRouter()

# Response shape for OpenAPI
class SearchResponse(BaseModel):
    projects: list[ProjectResponse]
    programs: list[ProgramResponse]
    applications: list[ApplicationResponse]
    beneficiaries: list[BeneficiaryResponse]


def _limit_cap(limit: int, cap: int = 20) -> int:
    return min(max(1, limit), cap)


@router.get("/", response_model=SearchResponse)
def search(
    q: Optional[str] = None,
    limit: int = 5,
    db: Session = Depends(get_db),
):
    phrase = (q or "").strip()
    limit_per_type = _limit_cap(limit)

    if len(phrase) < 2:
        return SearchResponse(
            projects=[],
            programs=[],
            applications=[],
            beneficiaries=[],
        )

    pattern = f"%{phrase}%"

    # Projects: non-deleted, match project_code or project_name
    projects_q = (
        db.query(Project)
        .filter(Project.deleted_at.is_(None))
        .filter(
            or_(
                Project.project_code.ilike(pattern),
                Project.project_name.ilike(pattern),
            )
        )
        .limit(limit_per_type)
        .all()
    )

    # Programs: non-deleted, match mc_ref
    programs_q = (
        db.query(Program)
        .filter(Program.deleted_at.is_(None))
        .filter(Program.mc_ref.ilike(pattern))
        .limit(limit_per_type)
        .all()
    )

    # Applications: non-deleted, match prequalification_no, last_name, first_name
    applications_q = (
        db.query(Application)
        .filter(Application.deleted_at.is_(None))
        .filter(
            or_(
                Application.prequalification_no.ilike(pattern),
                Application.last_name.ilike(pattern),
                Application.first_name.ilike(pattern),
            )
        )
        .limit(limit_per_type)
        .all()
    )

    # Beneficiaries: non-deleted, match last_name, first_name, bin, common_code
    beneficiaries_q = (
        db.query(Beneficiary)
        .filter(Beneficiary.deleted_at.is_(None))
        .filter(
            or_(
                Beneficiary.last_name.ilike(pattern),
                Beneficiary.first_name.ilike(pattern),
                Beneficiary.bin.ilike(pattern),
                Beneficiary.common_code.ilike(pattern),
            )
        )
        .limit(limit_per_type)
        .all()
    )

    return SearchResponse(
        projects=projects_q,
        programs=programs_q,
        applications=applications_q,
        beneficiaries=beneficiaries_q,
    )
