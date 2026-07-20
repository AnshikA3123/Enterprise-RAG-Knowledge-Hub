from sqlalchemy.orm import Session

from app.services.retrieval_service import RetrievalService
from app.services.conversation_services import ConversationService
from app.services.message_service import MessageService
from app.services.conversation_memory_service import ConversationMemoryService

import json


class ChatService:

    def __init__(self, db: Session):
        self.db = db

        self.retrieval_service = RetrievalService()
        self.conversation_service = ConversationService(db)
        self.message_service = MessageService(db)
        self.memory_service = ConversationMemoryService(db)

    def ask(
        self,
        question: str,
        conversation_id: int | None = None
    ):

        # --------------------------
        # Conversation
        # --------------------------

        if conversation_id:

            conversation = self.conversation_service.get_conversation(
                conversation_id
            )

            if conversation is None:

                conversation = self.conversation_service.create_conversation(
                    question[:40]
                )

        else:

            conversation = self.conversation_service.create_conversation(
                question[:40]
            )

        # --------------------------
        # Memory
        # --------------------------

        history = self.memory_service.build_history(
            conversation.id
        )

        # --------------------------
        # Save User
        # --------------------------

        self.message_service.save_user_message(
            conversation.id,
            question
        )

        # --------------------------
        # Ask RAG
        # --------------------------

        result = self.retrieval_service.ask(
            question=question,
            conversation_history=history
        )

        # --------------------------
        # Save AI
        # --------------------------

        self.message_service.save_ai_message(
            conversation.id,
            result["answer"],
            json.dumps(result["sources"])
        )

        return {
            "conversation_id": conversation.id,
            "answer": result["answer"],
            "sources": result["sources"]
        }