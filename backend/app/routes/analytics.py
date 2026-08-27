from typing import Optional, List
from fastapi import APIRouter, Query, Depends

from app.models.schemas import AnalyticsSummary, SentimentTrendItem, TopicBreakdownItem
from app.db.database import get_db, Database

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    business_id: Optional[int] = Query(None, description="Filter analytics by business ID"),
    db: Database = Depends(get_db)
):
    """
    Returns comprehensive analytics KPIs:
    - Total feedback count
    - Positive / Neutral / Negative counts and percentages
    - Net Sentiment Score (NSS: -100 to +100)
    - Average star rating
    - Top complaint topic
    - Sentiment timeline trends
    - Complaint category distribution breakdown
    """
    summary = db.get_analytics_summary(business_id=business_id)
    return AnalyticsSummary(**summary)


@router.get("/sentiment-trend", response_model=List[SentimentTrendItem])
def get_sentiment_trends(
    business_id: Optional[int] = Query(None, description="Filter trend by business ID"),
    db: Database = Depends(get_db)
):
    """
    Returns time-series counts of positive, neutral, and negative feedback aggregated by date.
    """
    summary = db.get_analytics_summary(business_id=business_id)
    return [SentimentTrendItem(**item) for item in summary.get("sentiment_trends", [])]


@router.get("/top-topics", response_model=List[TopicBreakdownItem])
def get_top_topics(
    business_id: Optional[int] = Query(None, description="Filter topics by business ID"),
    db: Database = Depends(get_db)
):
    """
    Returns the distribution of complaint themes and frequency counts.
    """
    summary = db.get_analytics_summary(business_id=business_id)
    return [TopicBreakdownItem(**item) for item in summary.get("topic_breakdowns", [])]
