from datetime import datetime, timedelta
import random
from typing import List, Dict, Any
from app.ml.sentiment_model import get_sentiment_model
from app.ml.topic_extractor import get_topic_extractor
from app.db.database import get_db

SAMPLE_DATASETS = {
    "TechGear Electronics": [
        {"text": "The wireless headphones have crystal clear audio and the noise cancellation is wonderful!", "rating": 5, "source": "amazon", "author": "David K."},
        {"text": "Fast delivery! Arrived 2 days earlier than scheduled. Well packed and works great.", "rating": 5, "source": "flipkart", "author": "Anita S."},
        {"text": "Battery backup is exceptional, lasts nearly 30 hours on a single charge.", "rating": 5, "source": "amazon", "author": "Marcus W."},
        {"text": "The Bluetooth mouse stopped working after only one week. Extremely poor build quality.", "rating": 1, "source": "flipkart", "author": "Rahul M."},
        {"text": "Delivery was delayed by over 8 days and customer support refused to provide a tracking update.", "rating": 1, "source": "amazon", "author": "Elena R."},
        {"text": "Overpriced for what it offers. Found the exact same smartwatch for half the price elsewhere.", "rating": 2, "source": "google", "author": "Chris B."},
        {"text": "The box arrived crushed and the seal was clearly broken. Missing charging cable inside!", "rating": 1, "source": "amazon", "author": "Vikram P."},
        {"text": "App crashes every time I try to sync the fitness tracker. Very buggy interface.", "rating": 2, "source": "google", "author": "Sophia T."},
        {"text": "Average product. Sound is okay, nothing special but works for daily office calls.", "rating": 3, "source": "amazon", "author": "John D."},
        {"text": "Decent build quality. Standard delivery time, packaged properly.", "rating": 3, "source": "flipkart", "author": "Pooja K."},
        {"text": "Excellent customer service! They replaced my damaged charger without any hassle.", "rating": 5, "source": "google", "author": "Sam L."},
        {"text": "Rude customer care executive on phone. Waited 30 minutes with zero resolution.", "rating": 1, "source": "amazon", "author": "Michael H."},
        {"text": "The mechanical keyboard feels super tactile and typing experience is awesome.", "rating": 5, "source": "amazon", "author": "Priya N."},
        {"text": "USB port is loose and disconnects constantly. Defective unit.", "rating": 1, "source": "flipkart", "author": "Karthik R."},
        {"text": "Normal keyboard, works fine for typing emails. Acceptable price.", "rating": 3, "source": "manual", "author": "Liam G."}
    ],
    "Spice & Herb Bistro": [
        {"text": "The garlic butter pasta was absolute perfection! Ambiance and music were delightful.", "rating": 5, "source": "google", "author": "Emma W."},
        {"text": "Superb hospitality! The waiter gave great wine recommendations and service was swift.", "rating": 5, "source": "google", "author": "Rajesh V."},
        {"text": "Delicious food and cozy atmosphere. Best wood-fired pizza in town!", "rating": 5, "source": "manual", "author": "Carlos M."},
        {"text": "Food was served completely cold and the chicken was undercooked. Terrible quality.", "rating": 1, "source": "google", "author": "Zoe P."},
        {"text": "Extremely slow service. Waited 50 minutes just to get our appetizers.", "rating": 1, "source": "google", "author": "Aditya J."},
        {"text": "Heavily overpriced for such small portions. Surprise service charge added to the bill.", "rating": 2, "source": "google", "author": "Jessica H."},
        {"text": "Rude manager argued with us when we pointed out a hair in the salad. Unacceptable.", "rating": 1, "source": "google", "author": "Naveen S."},
        {"text": "Takeaway packaging was leaking soup all over the bag. Messy packaging.", "rating": 2, "source": "swiggy", "author": "Meera B."},
        {"text": "Standard restaurant experience. Food taste was okay, average pricing.", "rating": 3, "source": "google", "author": "Tom B."},
        {"text": "Nice place for a casual lunch. Nothing extraordinary but decent.", "rating": 3, "source": "manual", "author": "Sneha L."}
    ],
    "SwiftDrop Courier": [
        {"text": "Delivered my urgent parcel across state lines in less than 24 hours. Incredible speed!", "rating": 5, "source": "google", "author": "Suresh T."},
        {"text": "Very polite delivery driver and real-time live GPS tracking worked seamlessly.", "rating": 5, "source": "manual", "author": "Karen O."},
        {"text": "Package marked as delivered but never actually arrived. Customer helpline doesn't pick up!", "rating": 1, "source": "google", "author": "Arun K."},
        {"text": "Delayed delivery by 5 days without any notification. Tracking status was stuck.", "rating": 1, "source": "google", "author": "Daniel P."},
        {"text": "The fragile item inside was broken because the delivery guy threw the box over the gate.", "rating": 1, "source": "google", "author": "Divya R."},
        {"text": "Hidden surcharges at the time of pickup that were not mentioned during booking.", "rating": 2, "source": "google", "author": "Rohan M."},
        {"text": "Courier arrived on time. Standard transit experience.", "rating": 3, "source": "manual", "author": "Alex F."}
    ]
}


def seed_database():
    """Seeds sample businesses and analyzed reviews into the database."""
    db = get_db()
    sentiment_model = get_sentiment_model()
    topic_extractor = get_topic_extractor()

    businesses = db.get_businesses()
    business_map = {b["name"]: b["business_id"] for b in businesses}

    # If any business has 0 feedback, seed it
    for biz_name, reviews in SAMPLE_DATASETS.items():
        biz_id = business_map.get(biz_name)
        if not biz_id:
            cat = "E-Commerce" if "Electronics" in biz_name else ("Restaurant & Food" if "Bistro" in biz_name else "Logistics")
            biz = db.create_business(biz_name, cat)
            biz_id = biz["business_id"]

        # Check existing count
        existing = db.get_feedback_list(business_id=biz_id, limit=5)
        if len(existing) == 0:
            now = datetime.utcnow()
            for idx, item in enumerate(reviews):
                # Spread out timestamps across the last 14 days
                days_ago = random.randint(0, 14)
                hours_ago = random.randint(0, 23)
                review_time = (now - timedelta(days=days_ago, hours=hours_ago)).strftime("%Y-%m-%d %H:%M:%S")

                sentiment = sentiment_model.predict(item["text"], rating=item["rating"])
                topics = topic_extractor.extract_topics(item["text"], sentiment["sentiment_label"])

                db.insert_feedback(
                    business_id=biz_id,
                    source=item["source"],
                    raw_text=item["text"],
                    sentiment=sentiment,
                    topics=topics,
                    rating=item["rating"],
                    customer_name=item["author"],
                    submitted_at=review_time
                )
            print(f"Seeded {len(reviews)} sample reviews for '{biz_name}'.")
