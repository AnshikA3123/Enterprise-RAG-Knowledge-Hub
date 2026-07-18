from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository


class AnalyticsService:

    def __init__(self, db: Session):
        self.repository = AnalyticsRepository(db)

    def get_analytics(self):
        return self.repository.get_analytics()