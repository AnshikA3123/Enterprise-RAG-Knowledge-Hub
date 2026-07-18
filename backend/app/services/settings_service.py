from sqlalchemy.orm import Session

from app.repositories.settings_repository import SettingsRepository


class SettingsService:

    def __init__(self, db: Session):
        self.repository = SettingsRepository(db)

    def get_settings(self):
        return self.repository.get_settings()