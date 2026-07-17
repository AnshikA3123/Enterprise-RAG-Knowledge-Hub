from typing import List

from pydantic import BaseModel


class DepartmentInfo(BaseModel):
    name: str
    document_count: int


class DocumentInfo(BaseModel):
    name: str
    department: str
    file_type: str
    file_size: str
    indexed: bool


class KnowledgeBaseResponse(BaseModel):
    departments: List[DepartmentInfo]
    documents: List[DocumentInfo]