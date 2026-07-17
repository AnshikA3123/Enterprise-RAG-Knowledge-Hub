from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.message_service import MessageService

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.get("/{conversation_id}")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):

    service = MessageService(db)

    return service.get_messages(conversation_id)