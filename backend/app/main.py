from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base
from app.database.database import engine
from app.api.message import router as message_router
# Import models so SQLAlchemy creates tables
from app.models import conversation
from app.routers.dashboard import router as dashboard_router
from app.routers.knowledge import router as knowledge_router
from app.routers.insights import router as insights_router
from app.routers.analytics import router as analytics_router
from app.routers import settings
from app.api.slack import router as slack_router
from app.models import conversation
from app.models import slack_conversation



# Routers
from app.api.chat import router as chat_router
from app.api.conversation import router as conversation_router


app = FastAPI(
    title="Enterprise AI Knowledge Hub",
    version="1.0.0"
)

# ------------------------
# Database
# ------------------------

Base.metadata.create_all(bind=engine)

# ------------------------
# CORS
# ------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Routers
# ------------------------

app.include_router(chat_router)
app.include_router(message_router)
app.include_router(conversation_router)
app.include_router(dashboard_router)
app.include_router(knowledge_router)
app.include_router(insights_router)
app.include_router(analytics_router)
app.include_router(settings.router)
app.include_router(slack_router)
# ------------------------
# Health Check
# ------------------------

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Enterprise AI Knowledge Hub",
        "version": "1.0.0"
    }