from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.conversation_services import ConversationService

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)


@router.post("")
def create(db: Session = Depends(get_db)):

    service = ConversationService(db)

    return service.create_conversation()


@router.get("")
def get_all(db: Session = Depends(get_db)):

    service = ConversationService(db)

    return service.get_all_conversations()


@router.delete("/{conversation_id}")
def delete(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    service = ConversationService(db)

    service.delete_conversation(conversation_id)

    return {
        "message": "Conversation deleted"
    }