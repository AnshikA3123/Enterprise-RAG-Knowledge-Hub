from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.knowledge_repository import KnowledgeRepository


class InsightsRepository:

    def __init__(self, db: Session):
        self.db = db
        self.dashboard_repo = DashboardRepository(db)
        self.knowledge_repo = KnowledgeRepository(db)

    def get_insights(self):

        dashboard = self.dashboard_repo.get_dashboard_stats()
        knowledge = self.knowledge_repo.get_knowledge_base()

        return {

            "knowledge_overview": {

                "documents": dashboard["documents"],
                "departments": dashboard["departments"],
                "chunks": dashboard["chunks"],
                "indexed_documents": dashboard["documents"],
            },

            "infrastructure": {

                "llm_providers": [
                    "Gemini 2.0 Flash",
                    "Grok",
                ],

                "embedding_model": dashboard["embedding_model"],
                "vector_database": dashboard["vector_database"],
                "collection_name": dashboard["collection_name"],
            },

            "department_distribution": [

                {
                    "department": department["name"],
                    "document_count": department["document_count"],
                }

                for department in knowledge["departments"]

            ],

            "system_health": {

                "backend": "Healthy",
                "knowledge_base": "Synced",
                "vector_database": "Running",
                "embeddings": "Ready",
            },
        }