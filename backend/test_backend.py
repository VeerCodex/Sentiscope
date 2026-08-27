"""
Automated Verification Script for Sentiment Analysis Backend.
Tests ML classifier, topic extractor, database operations, and analytics calculation.
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from app.ml.sentiment_model import get_sentiment_model
from app.ml.topic_extractor import get_topic_extractor
from app.db.database import get_db


def run_tests():
    print("=" * 60)
    print("Running Sentiment Analysis Backend Test Suite")
    print("=" * 60)

    # 1. Test ML Sentiment Model
    print("\n[1/4] Testing Sentiment Classification Model...")
    sm = get_sentiment_model()
    
    test_cases = [
        ("The product is fantastic and exceeded my expectations!", "positive"),
        ("Delivery was 5 days late and package arrived completely broken.", "negative"),
        ("The item is okay, neither good nor bad.", "neutral"),
        ("Not good at all, completely broke on first usage.", "negative"),
        ("Overpriced item and rude customer support.", "negative")
    ]

    all_passed = True
    for text, expected in test_cases:
        res = sm.predict(text)
        pred = res["sentiment_label"]
        conf = res["confidence_score"]
        status = "PASSED" if pred == expected else "FAILED"
        if pred != expected:
            all_passed = False
        print(f"  [{status}] Text: '{text[:40]}...' -> Predicted: {pred} ({conf*100:.1f}%), Expected: {expected}")

    assert all_passed, "Some sentiment classification test cases failed."
    print("  -> Sentiment Model tests passed successfully!")

    # 2. Test Topic Extractor
    print("\n[2/4] Testing Topic / Complaint Theme Extractor...")
    te = get_topic_extractor()
    topic_cases = [
        ("My order was delayed by 6 days and the courier tracking was lost.", "delivery"),
        ("They charged me twice and refused to give a refund.", "pricing"),
        ("The plastic build is broken and stopped working.", "quality"),
        ("Customer support on phone was very rude and unhelpful.", "service"),
        ("The box was torn and items were missing inside.", "packaging"),
        ("App crashes every time I try to login.", "usability"),
    ]

    for text, expected_topic in topic_cases:
        topics = te.extract_topics(text, "negative")
        matched = [t["topic_name"] for t in topics]
        assert expected_topic in matched, f"Expected topic '{expected_topic}' not found in {matched} for text: '{text}'"
        print(f"  [PASSED] Text: '{text[:40]}...' -> Detected Topics: {matched}")
    print("  -> Topic Extractor tests passed successfully!")

    # 3. Test Database Layer
    print("\n[3/4] Testing Database Layer & Ingestion...")
    db = get_db()
    businesses = db.get_businesses()
    print(f"  -> Found {len(businesses)} existing businesses: {[b['name'] for b in businesses]}")
    assert len(businesses) > 0, "Businesses table is empty."

    # Insert a test feedback
    biz_id = businesses[0]["business_id"]
    test_text = "Automated test review: Excellent product and fast delivery!"
    sent_res = sm.predict(test_text)
    topics_res = te.extract_topics(test_text, sent_res["sentiment_label"])

    fb_id = db.insert_feedback(
        business_id=biz_id,
        source="automated_test",
        raw_text=test_text,
        sentiment=sent_res,
        topics=topics_res,
        rating=5,
        customer_name="Test Runner"
    )
    assert fb_id > 0, "Failed to insert feedback into database."
    print(f"  -> Inserted test feedback item with ID: {fb_id}")

    # 4. Test Analytics Calculations
    print("\n[4/4] Testing Analytics KPI Calculations...")
    summary = db.get_analytics_summary(business_id=biz_id)
    print(f"  -> Total Feedback: {summary['total_feedback']}")
    print(f"  -> Positive %: {summary['positive_pct']}%, Neutral %: {summary['neutral_pct']}%, Negative %: {summary['negative_pct']}%")
    print(f"  -> Net Sentiment Score (NSS): {summary['net_sentiment_score']}")
    print(f"  -> Sentiment Trends Count: {len(summary['sentiment_trends'])}")
    print(f"  -> Top Topics Breakdown Count: {len(summary['topic_breakdowns'])}")

    assert summary["total_feedback"] > 0, "Analytics returned 0 total feedback."
    print("  -> Analytics calculation tests passed successfully!")

    # Cleanup test feedback
    db.delete_feedback(fb_id)
    print(f"  -> Cleaned up test record {fb_id}.")

    print("\n" + "=" * 60)
    print("ALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! (100%)")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
