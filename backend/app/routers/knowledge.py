from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.knowledge_schema import KnowledgeBaseResponse
from app.services.knowledge_service import KnowledgeService

router = APIRouter(
    prefix="/knowledge-base",
    tags=["Knowledge Base"],
)


@router.get(
    "",
    response_model=KnowledgeBaseResponse,
)
def get_knowledge_base(
    db: Session = Depends(get_db),
):
    service = KnowledgeService(db)
    return service.get_knowledge_base()