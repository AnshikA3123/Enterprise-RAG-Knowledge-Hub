from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.settings_schema import SettingsResponse
from app.services.settings_service import SettingsService

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get(
    "",
    response_model=SettingsResponse,
)
def get_settings(
    db: Session = Depends(get_db),
):

    service = SettingsService(db)

    return service.get_settings()