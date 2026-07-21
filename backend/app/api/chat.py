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
from app.services.conversation_memory_service import ConversationMemoryService

import json

router = APIRouter()




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
    memory_service = ConversationMemoryService(db)

    # --------------------------------------------------
    # Continue existing conversation OR create new one
    # --------------------------------------------------

    if request.conversation_id:

        conversation = conversation_service.get_conversation(
            request.conversation_id
        )

        if conversation is None:

            title = request.question[:40]

            conversation = conversation_service.create_conversation(
                title
            )

    else:

        title = request.question[:40]

        conversation = conversation_service.create_conversation(
            title
        )

    # ------------------------------------
    # Load previous conversation history
    # ------------------------------------

    conversation_history = memory_service.build_history(
        conversation.id
    )

    # Save current user message

    message_service.save_user_message(
        conversation.id,
        request.question
    )

    # Ask RAG with memory
    service = RetrievalService()

    result = service.ask(
        question=request.question,
        conversation_history=conversation_history
    )

    # Save AI response

    message_service.save_ai_message(
        conversation.id,
        result["answer"],
        json.dumps(result["sources"])
    )

    return ChatResponse(
        conversation_id=conversation.id,
        answer=result["answer"],
        sources=[
            Source(
                file=s["file"],
                page=s["page"]
            )
            for s in result["sources"]
        ]
    )