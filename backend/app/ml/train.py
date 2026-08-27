"""
Model Training Script for Sentiment Analysis.
Trains TF-IDF + Classifier on Amazon / Flipkart / Yelp CSV datasets or generates a synthetic benchmark.
Can be executed via CLI: python -m app.ml.train --dataset-path path/to/reviews.csv
"""

import os
import sys
import argparse
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

from app.ml.sentiment_model import SentimentModel


def map_rating_to_sentiment(rating: float) -> str:
    """Maps star rating (1-5) to sentiment label."""
    if rating >= 4:
        return "positive"
    elif rating == 3:
        return "neutral"
    else:
        return "negative"


def train_model(dataset_path: str = None, output_path: str = None):
    output_path = output_path or os.path.join(os.path.dirname(__file__), "sentiment_model.joblib")
    sm = SentimentModel()

    if dataset_path and os.path.exists(dataset_path):
        print(f"Loading dataset from {dataset_path}...")
        df = pd.read_csv(dataset_path)

        # Detect review text column
        text_cols = [c for c in df.columns if c.lower() in ["review", "review_text", "raw_text", "text", "content", "comments", "summary"]]
        rating_cols = [c for c in df.columns if c.lower() in ["rating", "stars", "star_rating", "score"]]
        label_cols = [c for c in df.columns if c.lower() in ["sentiment", "label", "sentiment_label"]]

        if not text_cols:
            raise ValueError(f"Could not find a review text column in {df.columns.tolist()}")

        text_col = text_cols[0]

        if label_cols:
            df["sentiment"] = df[label_cols[0]].str.lower()
        elif rating_cols:
            df["sentiment"] = df[rating_cols[0]].apply(map_rating_to_sentiment)
        else:
            raise ValueError("Dataset must contain either a 'rating' or 'sentiment' column.")

        # Clean dataframe
        df = df.dropna(subset=[text_col, "sentiment"])
        df = df[df["sentiment"].isin(["positive", "neutral", "negative"])]
        
        texts = [sm.clean_text(str(t)) for t in df[text_col]]
        labels = df["sentiment"].tolist()
    else:
        print("No external dataset provided. Training on comprehensive synthetic benchmark dataset...")
        # Balanced benchmark corpus
        samples = [
            ("Excellent product, great quality and fast shipping!", "positive"),
            ("Loved the fast delivery and top-notch packaging.", "positive"),
            ("Very satisfied, customer care was very polite and helpful.", "positive"),
            ("Best experience ever, highly recommend this store.", "positive"),
            ("The food was hot, fresh, and tasted delicious!", "positive"),
            ("Great battery life and sleek design. 5 stars.", "positive"),
            ("Works as advertised, smooth checkout and quick dispatch.", "positive"),
            ("Superb performance and outstanding build quality.", "positive"),
            ("Friendly staff, quick response time, very happy.", "positive"),
            ("Affordable and premium feel. Exceeded expectations.", "positive"),
            
            ("Terrible product, broke after 2 days of usage.", "negative"),
            ("Worst customer service. Rude agent and no refund.", "negative"),
            ("Delivery was delayed by 2 weeks and box arrived crushed.", "negative"),
            ("Defective item, does not turn on. Complete waste of money.", "negative"),
            ("They overcharged my credit card and customer support ignored me.", "negative"),
            ("App crashes constantly during payment. Very frustrating.", "negative"),
            ("Poor material quality, cheap plastic and horrible sound.", "negative"),
            ("Food was stale, cold, and missing side items.", "negative"),
            ("Scam alert! Seal was broken and parts were missing.", "negative"),
            ("Late shipping, unhelpful helpline, never buying again.", "negative"),

            ("Average product, does the job but nothing special.", "neutral"),
            ("Normal delivery time. Standard packaging.", "neutral"),
            ("It is an okay item for daily basic use.", "neutral"),
            ("Functions as described in user manual.", "neutral"),
            ("Decent value for the price, average quality.", "neutral"),
            ("Standard service, acceptable experience.", "neutral"),
            ("Neither good nor bad, meets minimum expectations.", "neutral"),
            ("Fair food quality, standard restaurant ambiance.", "neutral")
        ]
        texts = [sm.clean_text(s[0]) for s in samples]
        labels = [s[1] for s in samples]

    print(f"Total training samples: {len(texts)}")
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels if len(texts) > 20 else None
    )

    # Pipeline: TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            max_features=10000,
            sublinear_tf=True
        )),
        ("clf", LogisticRegression(C=1.5, max_iter=300, class_weight="balanced"))
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    print("\n--- Evaluation Report ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save trained model
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    joblib.dump(pipeline, output_path)
    print(f"Model saved successfully to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Sentiment Analysis Model")
    parser.add_argument("--dataset-path", type=str, default=None, help="Path to CSV dataset")
    parser.add_argument("--output-path", type=str, default=None, help="Path to save trained joblib model")
    args = parser.parse_args()

    train_model(args.dataset_path, args.output_path)
