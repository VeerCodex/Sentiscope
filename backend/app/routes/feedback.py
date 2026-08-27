import io
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, Depends
from datetime import datetime

from app.models.schemas import (
    FeedbackCreate, FeedbackResponse, AnalyzeRequest, AnalyzeResponse,
    CsvUploadResponse, GoogleReviewsRequest, SentimentResult, TopicItem
)
from app.ml.sentiment_model import get_sentiment_model, SentimentModel
from app.ml.topic_extractor import get_topic_extractor, TopicExtractor
from app.db.database import get_db, Database
from app.services.google_reviews import get_google_reviews_service

router = APIRouter(prefix="/feedback", tags=["Feedback Ingestion & Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_text(
    payload: AnalyzeRequest,
    sentiment_model: SentimentModel = Depends(get_sentiment_model),
    topic_extractor: TopicExtractor = Depends(get_topic_extractor),
    db: Database = Depends(get_db)
):
    """
    Real-time NLP sentiment classification and topic extraction for any text.
    Optionally saves to the database.
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    sentiment_dict = sentiment_model.predict(payload.text, rating=payload.rating)
    topics_list = topic_extractor.extract_topics(payload.text, sentiment_dict["sentiment_label"])
    tokens = sentiment_model.get_tokens(payload.text)

    saved_id = None
    if payload.save_to_db:
        saved_id = db.insert_feedback(
            business_id=payload.business_id,
            source=payload.source or "manual",
            raw_text=payload.text,
            sentiment=sentiment_dict,
            topics=topics_list,
            rating=payload.rating,
            customer_name=payload.customer_name or "Anonymous"
        )

    return AnalyzeResponse(
        raw_text=payload.text,
        sentiment=SentimentResult(**sentiment_dict),
        topics=[TopicItem(**t) for t in topics_list],
        cleaned_tokens=tokens,
        saved_feedback_id=saved_id
    )


@router.post("/single", response_model=FeedbackResponse)
def submit_single_feedback(
    payload: FeedbackCreate,
    sentiment_model: SentimentModel = Depends(get_sentiment_model),
    topic_extractor: TopicExtractor = Depends(get_topic_extractor),
    db: Database = Depends(get_db)
):
    """
    Submits a single customer review, performs NLP analysis, and saves to database.
    """
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty.")

    sentiment_dict = sentiment_model.predict(payload.raw_text, rating=payload.rating)
    topics_list = topic_extractor.extract_topics(payload.raw_text, sentiment_dict["sentiment_label"])

    sub_time = payload.submitted_at.strftime("%Y-%m-%d %H:%M:%S") if payload.submitted_at else None

    feedback_id = db.insert_feedback(
        business_id=payload.business_id,
        source=payload.source or "manual",
        raw_text=payload.raw_text,
        sentiment=sentiment_dict,
        topics=topics_list,
        rating=payload.rating,
        customer_name=payload.customer_name or "Anonymous",
        submitted_at=sub_time
    )

    # Fetch back created record
    results = db.get_feedback_list(limit=1, offset=0)
    for r in results:
        if r["feedback_id"] == feedback_id:
            return FeedbackResponse(**r)

    # Fallback return
    return FeedbackResponse(
        feedback_id=feedback_id,
        business_id=payload.business_id,
        source=payload.source or "manual",
        raw_text=payload.raw_text,
        rating=payload.rating,
        customer_name=payload.customer_name or "Anonymous",
        submitted_at=datetime.utcnow(),
        sentiment=SentimentResult(**sentiment_dict),
        topics=[TopicItem(**t) for t in topics_list]
    )


@router.post("/upload", response_model=CsvUploadResponse)
async def upload_csv_feedback(
    file: UploadFile = File(...),
    business_id: Optional[int] = Form(None),
    sentiment_model: SentimentModel = Depends(get_sentiment_model),
    topic_extractor: TopicExtractor = Depends(get_topic_extractor),
    db: Database = Depends(get_db)
):
    """
    Bulk uploads customer reviews from a CSV file.
    Automatically detects columns: text/review, rating/stars, customer/author, source, date.
    """
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Uploaded file must be a CSV file.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # Detect column mappings
    cols = {c.lower().strip(): c for c in df.columns}
    
    text_col = None
    for cand in ["review", "review_text", "raw_text", "text", "feedback", "comment", "comments", "description"]:
        if cand in cols:
            text_col = cols[cand]
            break

    if not text_col:
        raise HTTPException(
            status_code=400,
            detail=f"Could not find a review text column. Found columns: {list(df.columns)}. Expected 'review', 'text', 'feedback', or 'raw_text'."
        )

    rating_col = next((cols[c] for c in ["rating", "stars", "star_rating", "score"] if c in cols), None)
    author_col = next((cols[c] for c in ["customer_name", "customer", "author", "user", "name"] if c in cols), None)
    source_col = next((cols[c] for c in ["source", "platform", "channel"] if c in cols), None)
    date_col = next((cols[c] for c in ["submitted_at", "date", "created_at", "time"] if c in cols), None)

    successful = 0
    failed = 0
    sample_items = []

    for _, row in df.iterrows():
        raw_text = str(row[text_col]).strip() if pd.notna(row[text_col]) else ""
        if not raw_text or raw_text.lower() == "nan":
            failed += 1
            continue

        rating = None
        if rating_col and pd.notna(row[rating_col]):
            try:
                r_val = int(float(row[rating_col]))
                if 1 <= r_val <= 5:
                    rating = r_val
            except Exception:
                pass

        author = str(row[author_col]).strip() if author_col and pd.notna(row[author_col]) else "Anonymous"
        source = str(row[source_col]).strip().lower() if source_col and pd.notna(row[source_col]) else "csv"
        
        sub_time = None
        if date_col and pd.notna(row[date_col]):
            try:
                sub_time = pd.to_datetime(row[date_col]).strftime("%Y-%m-%d %H:%M:%S")
            except Exception:
                sub_time = None

        sentiment_dict = sentiment_model.predict(raw_text, rating=rating)
        topics_list = topic_extractor.extract_topics(raw_text, sentiment_dict["sentiment_label"])

        f_id = db.insert_feedback(
            business_id=business_id,
            source=source,
            raw_text=raw_text,
            sentiment=sentiment_dict,
            topics=topics_list,
            rating=rating,
            customer_name=author,
            submitted_at=sub_time
        )
        successful += 1

        if len(sample_items) < 5:
            sample_items.append(FeedbackResponse(
                feedback_id=f_id,
                business_id=business_id,
                source=source,
                raw_text=raw_text,
                rating=rating,
                customer_name=author,
                submitted_at=datetime.utcnow(),
                sentiment=SentimentResult(**sentiment_dict),
                topics=[TopicItem(**t) for t in topics_list]
            ))

    return CsvUploadResponse(
        status="success",
        total_processed=len(df),
        successful_count=successful,
        failed_count=failed,
        business_id=business_id,
        sample_records=sample_items
    )


@router.post("/fetch-google")
def fetch_google_reviews(
    payload: GoogleReviewsRequest,
    sentiment_model: SentimentModel = Depends(get_sentiment_model),
    topic_extractor: TopicExtractor = Depends(get_topic_extractor),
    db: Database = Depends(get_db)
):
    """
    Fetches live or simulated Google Places reviews for a business query,
    classifies sentiment and topics, and stores them in the database.
    """
    service = get_google_reviews_service()
    reviews = service.fetch_reviews(payload.place_query, limit=payload.limit or 8)

    analyzed_records = []
    for r in reviews:
        sentiment_dict = sentiment_model.predict(r["text"], rating=r["rating"])
        topics_list = topic_extractor.extract_topics(r["text"], sentiment_dict["sentiment_label"])

        f_id = db.insert_feedback(
            business_id=payload.business_id,
            source="google",
            raw_text=r["text"],
            sentiment=sentiment_dict,
            topics=topics_list,
            rating=r["rating"],
            customer_name=r["author_name"],
            submitted_at=r["time"]
        )

        analyzed_records.append({
            "feedback_id": f_id,
            "business_id": payload.business_id,
            "source": "google",
            "raw_text": r["text"],
            "rating": r["rating"],
            "customer_name": r["author_name"],
            "submitted_at": r["time"],
            "sentiment": sentiment_dict,
            "topics": topics_list
        })

    return {
        "status": "success",
        "query": payload.place_query,
        "count": len(analyzed_records),
        "records": analyzed_records
    }


@router.get("", response_model=List[FeedbackResponse])
def get_feedback_list(
    business_id: Optional[int] = Query(None, description="Filter by business ID"),
    sentiment_label: Optional[str] = Query(None, description="Filter: positive, neutral, negative"),
    topic_name: Optional[str] = Query(None, description="Filter by complaint topic"),
    source: Optional[str] = Query(None, description="Filter by source (amazon, flipkart, google, csv, manual)"),
    search: Optional[str] = Query(None, description="Search in review text or customer name"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Database = Depends(get_db)
):
    """
    Retrieves stored feedback items with sentiment predictions and complaint topics.
    Supports filtering and pagination.
    """
    items = db.get_feedback_list(
        business_id=business_id,
        sentiment_label=sentiment_label,
        topic_name=topic_name,
        source=source,
        search_query=search,
        limit=limit,
        offset=offset
    )
    return [FeedbackResponse(**item) for item in items]


@router.delete("/{feedback_id}")
def delete_feedback_item(
    feedback_id: int,
    db: Database = Depends(get_db)
):
    """Deletes a feedback record."""
    deleted = db.delete_feedback(feedback_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Feedback not found.")
    return {"status": "deleted", "feedback_id": feedback_id}
