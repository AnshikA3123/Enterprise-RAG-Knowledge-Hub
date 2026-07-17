from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    Source
)

from app.services.retrieval_service import RetrievalService
from app.services.conversation_services import ConversationService
from app.services.message_service import MessageService

import json

router = APIRouter()

service = RetrievalService()


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    conversation_service = ConversationService(db)
    message_service = MessageService(db)

    # Generate conversation title from first question
    title = request.question[:40]

    # Create conversation
    conversation = conversation_service.create_conversation(title)

    # Save user message
    message_service.save_user_message(
        conversation.id,
        request.question
    )

    # Ask RAG
    result = service.ask(
        request.question
    )

    # Save AI response
    message_service.save_ai_message(
        conversation.id,
        result["answer"],
        json.dumps(result["sources"])
    )

    return ChatResponse(
        answer=result["answer"],
        sources=[
            Source(
                file=s["file"],
                page=s["page"]
            )
            for s in result["sources"]
        ]
    )