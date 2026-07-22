from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.rag.vector_store import VectorStore
from app.repositories.knowledge_repository import KnowledgeRepository


class DashboardRepository:

    def __init__(self, db: Session):
        self.db = db
        self.vector_store = VectorStore()

    def get_dashboard_stats(self):

        # Reuse the same repository that powers the Knowledge Base page.
        knowledge = KnowledgeRepository(self.db).get_knowledge_base()

        departments = len(knowledge["departments"])
        documents = len(knowledge["documents"])

        collection = self.vector_store.client.get_collection(
            collection_name=self.vector_store.COLLECTION_NAME
        )

        vectors = collection.points_count

        recent = (
            self.db.query(Conversation)
            .order_by(Conversation.created_at.desc())
            .limit(5)
            .all()
        )

        recent_titles = [c.title for c in recent]

        return {
            "departments": departments,
            "documents": documents,
            "chunks": vectors,
            "vectors": vectors,
            "provider": "Gemini 2.0",
            "embedding_model": "BAAI/bge-small-en-v1.5",
            "vector_database": "Qdrant",
            "collection_name": self.vector_store.COLLECTION_NAME,
            "recent_conversations": recent_titles,
        }