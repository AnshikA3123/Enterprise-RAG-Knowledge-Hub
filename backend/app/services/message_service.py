from app.repositories.message_repository import MessageRepository


class MessageService:

    def __init__(self, db):

        self.repo = MessageRepository(db)

    def save_user_message(
        self,
        conversation_id,
        content
    ):

        return self.repo.create(
            conversation_id=conversation_id,
            role="user",
            content=content
        )

    def save_ai_message(
        self,
        conversation_id,
        content,
        sources=""
    ):

        return self.repo.create(
            conversation_id=conversation_id,
            role="assistant",
            content=content,
            sources=sources
        )

    def get_messages(
        self,
        conversation_id
    ):

        return self.repo.get_messages(
            conversation_id
        )