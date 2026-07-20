import os
import json

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from slack_sdk import WebClient

from app.database.database import SessionLocal

from app.services.retrieval_service import RetrievalService
from app.services.slack_conversation_service import (
    SlackConversationService,
)
from app.services.message_service import MessageService
from app.services.conversation_memory_service import (
    ConversationMemoryService,
)

router = APIRouter(
    prefix="/slack",
    tags=["Slack"]
)

retrieval_service = RetrievalService()

slack_client = WebClient(
    token=os.getenv("SLACK_BOT_TOKEN")
)

# --------------------------------------------------
# In-Memory Slack Event Deduplication Cache
# --------------------------------------------------
# Slack retries event delivery (e.g. on slow responses,
# network issues, or missing 200 acks) which causes the
# same event_id to be received more than once. This cache
# tracks event_ids we've already processed so retries are
# ignored instead of triggering duplicate AI answers.

processed_event_ids = set()

MAX_PROCESSED_EVENT_IDS = 5000


def _mark_event_processed(event_id: str):

    processed_event_ids.add(event_id)

    # Simple cache size guard so this doesn't grow unbounded
    # over a long-running process.

    if len(processed_event_ids) > MAX_PROCESSED_EVENT_IDS:
        processed_event_ids.clear()
        processed_event_ids.add(event_id)


@router.post("/events")
async def slack_events(request: Request):

    # --------------------------------------------------
    # Parse JSON
    # --------------------------------------------------

    try:
        body = await request.json()

    except Exception:

        return JSONResponse(
            status_code=400,
            content={
                "message": "Invalid JSON"
            }
        )

    # --------------------------------------------------
    # Slack URL Verification
    # --------------------------------------------------

    if body.get("type") == "url_verification":

        return JSONResponse(
            content={
                "challenge": body.get("challenge")
            }
        )

    # --------------------------------------------------
    # Event Callback
    # --------------------------------------------------

    if body.get("type") == "event_callback":

        # ---------------------------------------
        # Slack Event Deduplication
        # ---------------------------------------

        event_id = body.get("event_id")

        if event_id:

            if event_id in processed_event_ids:

                return JSONResponse(
                    content={
                        "status": "duplicate_ignored"
                    }
                )

            _mark_event_processed(event_id)

        event = body.get("event", {})

        # Ignore Bot Messages

        if event.get("bot_id"):

            return JSONResponse(
                content={
                    "status": "ignored"
                }
            )

        # Ignore edited / deleted / any subtype events
        # (message_changed, message_deleted, etc.)

        if event.get("subtype"):

            return JSONResponse(
                content={
                    "status": "ignored"
                }
            )

        event_type = event.get("type")

        # ======================================================
        # APP MENTION
        # ======================================================

        if event_type == "app_mention":

            user = event.get("user")
            channel = event.get("channel")
            text = event.get("text", "")

            question = text.split(">", 1)[-1].strip()

            db = SessionLocal()

            try:

                slack_conversation_service = (
                    SlackConversationService(db)
                )

                message_service = (
                    MessageService(db)
                )

                memory_service = (
                    ConversationMemoryService(db)
                )

                # ---------------------------------------
                # Get Conversation
                # ---------------------------------------

                conversation = (
                    slack_conversation_service
                    .get_or_create_conversation(
                        slack_user_id=user,
                        slack_channel_id=channel,
                        first_question=question,
                    )
                )

                # ---------------------------------------
                # Load Conversation Memory
                # ---------------------------------------

                conversation_history = (
                    memory_service.build_history(
                        conversation.id
                    )
                )

                # ---------------------------------------
                # Save User Message
                # ---------------------------------------

                message_service.save_user_message(
                    conversation.id,
                    question
                )

                print("\n" + "=" * 50)
                print("Slack Event Received")
                print("=" * 50)
                print(f"User         : {user}")
                print(f"Channel      : {channel}")
                print(f"Conversation : {conversation.id}")
                print(f"Question     : {question}")

                # ---------------------------------------
                # Ask Enterprise AI
                # ---------------------------------------

                result = retrieval_service.ask(
                    question=question,
                    conversation_history=conversation_history
                )

                answer = result["answer"]

                # ---------------------------------------
                # Save AI Response
                # ---------------------------------------

                message_service.save_ai_message(
                    conversation.id,
                    answer,
                    json.dumps(result["sources"])
                )

                print("-" * 50)
                print("AI Answer")
                print("-" * 50)
                print(answer)
                print("=" * 50 + "\n")

                # ---------------------------------------
                # Send Response To Slack
                # ---------------------------------------

                slack_client.chat_postMessage(
                    channel=channel,
                    text=answer
                )

                return JSONResponse(
                    content={
                        "status": "received"
                    }
                )

            except Exception as e:

                print("\nSlack Error")
                print(e)

                return JSONResponse(
                    status_code=500,
                    content={
                        "status": "error",
                        "message": str(e)
                    }
                )

            finally:

                db.close()

        # ======================================================
        # DIRECT MESSAGE
        # ======================================================

        if event_type == "message":

            user = event.get("user")
            channel = event.get("channel")
            text = event.get("text", "")

            db = SessionLocal()

            try:

                slack_conversation_service = (
                    SlackConversationService(db)
                )

                message_service = (
                    MessageService(db)
                )

                memory_service = (
                    ConversationMemoryService(db)
                )

                conversation = (
                    slack_conversation_service
                    .get_or_create_conversation(
                        slack_user_id=user,
                        slack_channel_id=channel,
                        first_question=text,
                    )
                )

                conversation_history = (
                    memory_service.build_history(
                        conversation.id
                    )
                )

                message_service.save_user_message(
                    conversation.id,
                    text
                )

                print("\n" + "=" * 50)
                print("Slack Direct Message")
                print("=" * 50)
                print(f"User         : {user}")
                print(f"Channel      : {channel}")
                print(f"Conversation : {conversation.id}")
                print(f"Question     : {text}")

                result = retrieval_service.ask(
                    question=text,
                    conversation_history=conversation_history
                )

                answer = result["answer"]

                message_service.save_ai_message(
                    conversation.id,
                    answer,
                    json.dumps(result["sources"])
                )

                print("-" * 50)
                print("AI Answer")
                print("-" * 50)
                print(answer)
                print("=" * 50 + "\n")

                slack_client.chat_postMessage(
                    channel=channel,
                    text=answer
                )

                return JSONResponse(
                    content={
                        "status": "received"
                    }
                )

            except Exception as e:

                print("\nSlack Error")
                print(e)

                return JSONResponse(
                    status_code=500,
                    content={
                        "status": "error",
                        "message": str(e)
                    }
                )

            finally:

                db.close()

    return JSONResponse(
        content={
            "status": "ignored"
        }
    )