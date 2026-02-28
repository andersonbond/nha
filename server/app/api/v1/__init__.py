from fastapi import APIRouter

from app.api.v1.address import router as address_router
from app.api.v1.applications import router as applications_router
from app.api.v1.beneficiaries import router as beneficiaries_router
from app.api.v1.co_owners import router as co_owners_router
from app.api.v1.employment_profiles import router as employment_profiles_router
from app.api.v1.program_classifications import router as program_classifications_router
from app.api.v1.programs import router as programs_router
from app.api.v1.properties import router as properties_router
from app.api.v1.projects import router as projects_router
from app.api.v1.search import router as search_router
from app.api.v1.user_account_roles import router as user_account_roles_router
from app.api.v1.user_accounts import router as user_accounts_router
from app.api.v1.user_roles import router as user_roles_router

api_router = APIRouter()
api_router.include_router(address_router, prefix="/address", tags=["address"])
api_router.include_router(applications_router, prefix="/applications", tags=["applications"])
api_router.include_router(beneficiaries_router, prefix="/beneficiaries", tags=["beneficiaries"])
api_router.include_router(co_owners_router, prefix="/co-owners", tags=["co_owners"])
api_router.include_router(
    employment_profiles_router,
    prefix="/employment-profiles",
    tags=["employment_profiles"],
)
api_router.include_router(
    program_classifications_router,
    prefix="/program-classifications",
    tags=["program_classifications"],
)
api_router.include_router(programs_router, prefix="/programs", tags=["programs"])
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(properties_router, prefix="/properties", tags=["properties"])
api_router.include_router(search_router, prefix="/search", tags=["search"])
api_router.include_router(
    user_account_roles_router,
    prefix="/user-account-roles",
    tags=["user_account_roles"],
)
api_router.include_router(user_accounts_router, prefix="/user-accounts", tags=["user_accounts"])
api_router.include_router(user_roles_router, prefix="/user-roles", tags=["user_roles"])
