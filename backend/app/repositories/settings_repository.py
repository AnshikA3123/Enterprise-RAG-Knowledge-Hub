from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository


class SettingsRepository:

    def __init__(self, db: Session):
        self.analytics_repo = AnalyticsRepository(db)

    def get_settings(self):

        analytics = self.analytics_repo.get_analytics()

        return {

            "ai_configuration": {
                "llm_provider": "Gemini 2.0 Flash",
                "embedding_model": analytics["embedding_model"],
                "vector_database": analytics["vector_database"],
                "collection_name": analytics["collection_name"],
            },

            "knowledge_base": {
                "documents": analytics["summary"]["documents"],
                "departments": analytics["summary"]["departments"],
                "chunks": analytics["summary"]["chunks"],
                "vectors": analytics["summary"]["vectors"],
            },

            "application": {
                "version": "1.0.0",
                "environment": "Development",
                "backend_status": analytics["system_health"]["backend"],
                "api_url": "http://127.0.0.1:8000",
            },

            "security": {
                "authentication": "JWT Enabled",
                "cors": "Enabled",
                "https": "Development",
                "api_status": "Connected",
            },

            "about": {
                "project_name": "Enterprise AI Knowledge Hub",
                "developer": "Anshika",
                "tech_stack": "FastAPI • React • LangChain • Qdrant • Gemini",
                "last_updated": "Live",
            },
        }