from app.repositories.message_repository import MessageRepository


class ConversationMemoryService:
    """
    Builds formatted conversation history for the LLM.

    Responsibilities:
    - Load previous messages
    - Keep only recent context
    - Format into chat transcript
    """

    MAX_HISTORY_MESSAGES = 8

    def __init__(self, db):
        self.repo = MessageRepository(db)

    def build_history(self, conversation_id: int) -> str:

        messages = self.repo.get_messages(conversation_id)

        if not messages:
            return ""

        # Keep only recent messages
        messages = messages[-self.MAX_HISTORY_MESSAGES:]

        history = []

        for message in messages:

            role = "User" if message.role == "user" else "Assistant"

            history.append(
                f"{role}: {message.content}"
            )

        return "\n".join(history)