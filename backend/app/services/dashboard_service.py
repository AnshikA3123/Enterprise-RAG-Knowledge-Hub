from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    def __init__(self, db):

        self.repo = DashboardRepository(db)

    def get_dashboard(self):

        return self.repo.get_dashboard_stats()