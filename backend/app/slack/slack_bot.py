import os

from slack_bolt import App
from slack_bolt.adapter.fastapi import SlackRequestHandler

# Read credentials from environment variables
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_SIGNING_SECRET = os.getenv("SLACK_SIGNING_SECRET")

# Create Slack App
slack_app = App(
    token=SLACK_BOT_TOKEN,
    signing_secret=SLACK_SIGNING_SECRET,
)

# FastAPI adapter
handler = SlackRequestHandler(slack_app)


# ----------------------------------------------------
# Temporary test command
# ----------------------------------------------------

@slack_app.event("app_mention")
def handle_app_mention(event, say):
    user = event.get("user")

    say(
        f"Hello <@{user}> 👋\n"
        "Enterprise AI Assistant is connected successfully."
    )