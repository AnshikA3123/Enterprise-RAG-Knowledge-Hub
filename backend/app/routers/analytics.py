from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.analytics_schema import AnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "",
    response_model=AnalyticsResponse
)
def get_analytics(
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)

    return service.get_analytics()