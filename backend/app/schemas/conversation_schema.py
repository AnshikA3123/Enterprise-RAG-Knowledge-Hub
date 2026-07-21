from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True