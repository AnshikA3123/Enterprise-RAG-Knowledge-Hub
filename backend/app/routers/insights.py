from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.insights_schema import InsightsResponse
from app.services.insights_service import InsightsService

router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"],
)


@router.get(
    "",
    response_model=InsightsResponse,
)
def get_ai_insights(
    db: Session = Depends(get_db),
):

    service = InsightsService(db)

    return service.get_insights()