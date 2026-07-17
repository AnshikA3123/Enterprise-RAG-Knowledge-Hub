from app.repositories.knowledge_repository import KnowledgeRepository


class KnowledgeService:

    def __init__(self, db):
        self.repository = KnowledgeRepository(db)

    def get_knowledge_base(self):
        return self.repository.get_knowledge_base()