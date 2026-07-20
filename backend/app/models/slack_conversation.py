from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database.database import Base


class SlackConversation(Base):

    __tablename__ = "slack_conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    slack_user_id = Column(
        String,
        nullable=False
    )

    slack_channel_id = Column(
        String,
        nullable=False
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )