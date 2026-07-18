from pydantic import BaseModel
from typing import List


class AIInfrastructure(BaseModel):
    llm_providers: List[str]
    embedding_model: str
    vector_database: str
    collection_name: str


class KnowledgeOverview(BaseModel):
    documents: int
    departments: int
    chunks: int
    indexed_documents: int


class DepartmentStat(BaseModel):
    department: str
    document_count: int


class SystemHealth(BaseModel):
    backend: str
    knowledge_base: str
    vector_database: str
    embeddings: str


class InsightsResponse(BaseModel):
    knowledge_overview: KnowledgeOverview
    infrastructure: AIInfrastructure
    department_distribution: List[DepartmentStat]
    system_health: SystemHealth