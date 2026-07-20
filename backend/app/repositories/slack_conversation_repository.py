from sqlalchemy.orm import Session

from app.models.slack_conversation import SlackConversation


class SlackConversationRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_mapping(
        self,
        slack_user_id: str,
        slack_channel_id: str,
    ):
        return (
            self.db.query(SlackConversation)
            .filter(
                SlackConversation.slack_user_id == slack_user_id,
                SlackConversation.slack_channel_id == slack_channel_id,
            )
            .first()
        )

    def create_mapping(
        self,
        slack_user_id: str,
        slack_channel_id: str,
        conversation_id: int,
    ):
        mapping = SlackConversation(
            slack_user_id=slack_user_id,
            slack_channel_id=slack_channel_id,
            conversation_id=conversation_id,
        )

        self.db.add(mapping)
        self.db.commit()
        self.db.refresh(mapping)

        return mapping