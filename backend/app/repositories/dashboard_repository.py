from pathlib import Path

from pathlib import Path

from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.rag.vector_store import VectorStore

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class DashboardRepository:

    def __init__(self, db: Session):
        self.db = db
        self.vector_store = VectorStore()

    def get_dashboard_stats(self):

        kb_path = PROJECT_ROOT / "knowledge_base"

        departments = 0
        documents = 0

        if kb_path.exists():

            departments = len(
                [d for d in kb_path.iterdir() if d.is_dir()]
            )

            for department in kb_path.iterdir():

                if department.is_dir():

                    documents += len(
                        [
                            file
                            for file in department.iterdir()
                            if file.is_file()
                        ]
                    )

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