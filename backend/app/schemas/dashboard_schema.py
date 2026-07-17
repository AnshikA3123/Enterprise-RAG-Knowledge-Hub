from pydantic import BaseModel
from typing import List


class DashboardStats(BaseModel):
    departments: int
    documents: int
    chunks: int
    vectors: int

    provider: str
    embedding_model: str

    vector_database: str
    collection_name: str

    recent_conversations: List[str]