from app.repositories.slack_conversation_repository import (
    SlackConversationRepository,
)

from app.services.conversation_services import (
    ConversationService,
)


class SlackConversationService:

    def __init__(self, db):

        self.mapping_repo = SlackConversationRepository(db)

        self.conversation_service = ConversationService(db)

    def get_or_create_conversation(
        self,
        slack_user_id: str,
        slack_channel_id: str,
        first_question: str,
    ):

        # ---------------------------------
        # Check Existing Mapping
        # ---------------------------------

        mapping = self.mapping_repo.get_mapping(
            slack_user_id=slack_user_id,
            slack_channel_id=slack_channel_id,
        )

        if mapping:

            conversation = (
                self.conversation_service.get_conversation(
                    mapping.conversation_id
                )
            )

            if conversation:
                return conversation

        # ---------------------------------
        # Create New Conversation
        # ---------------------------------

        title = first_question[:40]

        conversation = (
            self.conversation_service.create_conversation(
                title
            )
        )

        # ---------------------------------
        # Save Slack Mapping
        # ---------------------------------

        self.mapping_repo.create_mapping(
            slack_user_id=slack_user_id,
            slack_channel_id=slack_channel_id,
            conversation_id=conversation.id,
        )

        return conversation