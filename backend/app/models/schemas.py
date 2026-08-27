from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class BusinessBase(BaseModel):
    name: str = Field(..., example="TechGear Electronics")
    category: Optional[str] = Field("General", example="E-Commerce")


class BusinessCreate(BusinessBase):
    pass


class BusinessResponse(BusinessBase):
    business_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    business_id: Optional[int] = Field(None, description="Business ID to associate this feedback with")
    source: Optional[str] = Field("manual", description="Source: 'amazon', 'flipkart', 'google', 'csv', 'manual'")
    raw_text: str = Field(..., description="The raw review or feedback text")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Star rating (1 to 5) if available")
    customer_name: Optional[str] = Field("Anonymous", description="Customer or reviewer name")
    submitted_at: Optional[datetime] = None


class SentimentResult(BaseModel):
    sentiment_label: str = Field(..., example="positive")  # 'positive', 'neutral', 'negative'
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    positive_prob: float = Field(0.0, ge=0.0, le=1.0)
    neutral_prob: float = Field(0.0, ge=0.0, le=1.0)
    negative_prob: float = Field(0.0, ge=0.0, le=1.0)


class TopicItem(BaseModel):
    topic_id: Optional[int] = None
    topic_name: str
    description: Optional[str] = None
    confidence: Optional[float] = 1.0


class FeedbackResponse(BaseModel):
    feedback_id: int
    business_id: Optional[int] = None
    business_name: Optional[str] = None
    source: str
    raw_text: str
    rating: Optional[int] = None
    customer_name: Optional[str] = "Anonymous"
    submitted_at: Optional[datetime] = None
    sentiment: Optional[SentimentResult] = None
    topics: List[TopicItem] = []

    class Config:
        from_attributes = True


class AnalyzeRequest(BaseModel):
    text: str = Field(..., example="The product stopped working after two days and delivery was very late.")
    business_id: Optional[int] = None
    save_to_db: Optional[bool] = False
    source: Optional[str] = "manual"
    rating: Optional[int] = None
    customer_name: Optional[str] = "Anonymous"


class AnalyzeResponse(BaseModel):
    raw_text: str
    sentiment: SentimentResult
    topics: List[TopicItem]
    cleaned_tokens: List[str] = []
    saved_feedback_id: Optional[int] = None


class CsvUploadResponse(BaseModel):
    status: str
    total_processed: int
    successful_count: int
    failed_count: int
    business_id: Optional[int]
    sample_records: List[FeedbackResponse] = []


class SentimentTrendItem(BaseModel):
    date: str  # YYYY-MM-DD
    positive: int = 0
    neutral: int = 0
    negative: int = 0
    total: int = 0


class TopicBreakdownItem(BaseModel):
    topic_name: str
    count: int
    percentage: float
    sample_reviews: List[str] = []


class AnalyticsSummary(BaseModel):
    total_feedback: int
    positive_count: int
    neutral_count: int
    negative_count: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    net_sentiment_score: float  # (Positive - Negative) / Total * 100
    average_rating: Optional[float] = None
    top_complaint_topic: Optional[str] = None
    sentiment_trends: List[SentimentTrendItem] = []
    topic_breakdowns: List[TopicBreakdownItem] = []


class GoogleReviewsRequest(BaseModel):
    place_query: str = Field(..., example="Starbucks Seattle")
    business_id: Optional[int] = None
    limit: Optional[int] = 10
