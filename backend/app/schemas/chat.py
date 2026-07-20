from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[int] = None


class Source(BaseModel):
    file: str
    page: int


class ChatResponse(BaseModel):
    conversation_id: int
    answer: str
    sources: list[Source]
    