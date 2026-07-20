from app.repositories.conversation_repository import ConversationRepository


class ConversationService:

    def __init__(self, db):

        self.repo = ConversationRepository(db)

    def create_conversation(self, title="New Chat"):

        return self.repo.create(title)

    def get_conversation(self, conversation_id):

        return self.repo.get(conversation_id)

    def get_all_conversations(self):

        return self.repo.get_all()

    def delete_conversation(self, conversation_id):

        self.repo.delete(conversation_id)