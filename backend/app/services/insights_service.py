from sqlalchemy.orm import Session

from app.repositories.insights_repository import InsightsRepository


class InsightsService:

    def __init__(self, db: Session):
        self.repository = InsightsRepository(db)

    def get_insights(self):
        return self.repository.get_insights()