from typing import List
from pydantic import BaseModel


class Summary(BaseModel):
    documents: int
    departments: int
    chunks: int
    vectors: int


class DepartmentDistribution(BaseModel):
    department: str
    count: int


class SystemHealth(BaseModel):
    backend: str
    knowledge_base: str
    vector_database: str
    embeddings: str


class AnalyticsResponse(BaseModel):
    summary: Summary
    department_distribution: List[DepartmentDistribution]
    providers: List[str]
    embedding_model: str
    vector_database: str
    collection_name: str
    system_health: SystemHealth