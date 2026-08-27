import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import feedback, analytics, businesses
from app.db.database import get_db
from app.ml.sentiment_model import get_sentiment_model
from app.ml.topic_extractor import get_topic_extractor
from app.services.sample_data import seed_database

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown routines."""
    print("Initializing Sentiment Analysis Backend...")
    # Initialize DB & ML Model
    get_db()
    get_sentiment_model()
    get_topic_extractor()
    # Seed initial demo data
    try:
        seed_database()
    except Exception as e:
        print(f"Notice: Initial data seeding skipped/completed ({e})")
    print("Backend ready to accept requests.")
    yield
    print("Shutting down Sentiment Analysis Backend.")


app = FastAPI(
    title="Sentiment Analysis Software for Businesses",
    description="AI-Powered Customer Feedback & Complaint Theme Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(feedback.router)
app.include_router(analytics.router)
app.include_router(businesses.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Sentiment Analysis API is active",
        "docs": "/docs",
        "endpoints": {
            "upload_csv": "POST /feedback/upload",
            "analyze_text": "POST /feedback/analyze",
            "feedback_list": "GET /feedback",
            "analytics_summary": "GET /analytics/summary",
            "sentiment_trend": "GET /analytics/sentiment-trend",
            "top_topics": "GET /analytics/top-topics",
            "businesses": "GET /businesses"
        }
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
