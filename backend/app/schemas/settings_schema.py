from pydantic import BaseModel


class AIConfiguration(BaseModel):
    llm_provider: str
    embedding_model: str
    vector_database: str
    collection_name: str


class KnowledgeBaseInfo(BaseModel):
    documents: int
    departments: int
    chunks: int
    vectors: int


class ApplicationInfo(BaseModel):
    version: str
    environment: str
    backend_status: str
    api_url: str


class SecurityInfo(BaseModel):
    authentication: str
    cors: str
    https: str
    api_status: str


class AboutInfo(BaseModel):
    project_name: str
    developer: str
    tech_stack: str
    last_updated: str


class SettingsResponse(BaseModel):
    ai_configuration: AIConfiguration
    knowledge_base: KnowledgeBaseInfo
    application: ApplicationInfo
    security: SecurityInfo
    about: AboutInfo