from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.knowledge_repository import KnowledgeRepository


class AnalyticsRepository:

    def __init__(self, db: Session):
        self.dashboard_repo = DashboardRepository(db)
        self.knowledge_repo = KnowledgeRepository(db)

    def get_analytics(self):

        dashboard = self.dashboard_repo.get_dashboard_stats()
        knowledge = self.knowledge_repo.get_knowledge_base()

        return {

            "summary": {

                "documents": dashboard["documents"],
                "departments": dashboard["departments"],
                "chunks": dashboard["chunks"],
                "vectors": dashboard["vectors"]

            },

            "department_distribution": [

                {
                    "department": dept["name"],
                    "count": dept["document_count"]
                }

                for dept in knowledge["departments"]

            ],

            "providers": [

                "Gemini 2.0 Flash",
                "Grok"

            ],

            "embedding_model": dashboard["embedding_model"],

            "vector_database": dashboard["vector_database"],

            "collection_name": dashboard["collection_name"],

            "system_health": {

                "backend": "Healthy",

                "knowledge_base": "Synced",

                "vector_database": "Running",

                "embeddings": "Ready"

            }

        }