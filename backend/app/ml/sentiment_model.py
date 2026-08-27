import os
import re
import string
import joblib
import numpy as np
from typing import Dict, Any, Tuple, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


class SentimentModel:
    """
    Robust Sentiment Classifier with NLP Preprocessing,
    TF-IDF Vectorization, Logistic Regression, and Lexicon-assisted boosting.
    """

    def __init__(self, model_path: str = None):
        self.model_path = model_path or os.path.join(os.path.dirname(__file__), "sentiment_model.joblib")
        self.pipeline: Pipeline = None
        self._init_model()

    def clean_text(self, text: str) -> str:
        """
        Preprocesses text:
        - Lowercase
        - Removes URLs, HTML tags, special symbols
        - Expands common contractions
        - Preserves important sentiment modifiers (e.g. 'not', 'never', 'no')
        """
        if not text or not isinstance(text, str):
            return ""

        text = text.lower()
        # Remove URLs
        text = re.sub(r"https?://\S+|www\.\S+", " ", text)
        # Remove HTML tags
        text = re.sub(r"<.*?>", " ", text)
        # Expand common contractions
        contractions = {
            "won't": "will not",
            "can't": "can not",
            "n't": " not",
            "'re": " are",
            "'s": " is",
            "'d": " would",
            "'ll": " will",
            "'ve": " have",
            "'m": " am",
        }
        for k, v in contractions.items():
            text = text.replace(k, v)

        # Remove punctuation except negation markers and basic spacing
        text = re.sub(r"[^\w\s]", " ", text)
        # Normalize whitespace
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def get_tokens(self, text: str) -> List[str]:
        """Extracts cleaned tokens for explainability."""
        cleaned = self.clean_text(text)
        stopwords = {
            "i", "me", "my", "myself", "we", "our", "ours", "you", "your", "he", "him", "his",
            "she", "her", "they", "them", "what", "which", "who", "this", "that", "these",
            "is", "am", "are", "was", "were", "be", "been", "being", "have", "has", "had",
            "do", "does", "did", "the", "a", "an", "and", "or", "because", "as", "until",
            "while", "of", "at", "by", "for", "with", "about", "into", "through", "to", "from"
        }
        tokens = [w for w in cleaned.split() if w not in stopwords and len(w) > 1]
        return tokens

    def _lexicon_booster(self, text: str) -> Tuple[float, float, float]:
        """
        Lexicon-based heuristic sentiment adjustment for handling explicit sentiment cues,
        negations, and strong emotional indicators.
        Returns: (pos_boost, neu_boost, neg_boost)
        """
        cleaned = " " + self.clean_text(text) + " "

        pos_words = {
            "excellent", "great", "amazing", "good", "love", "awesome", "fantastic", "perfect",
            "best", "fast", "helpful", "friendly", "satisfied", "recommend", "superb", "brilliant",
            "flawless", "smooth", "pleased", "happy", "wonderful", "outstanding", "top-notch"
        }
        neg_words = {
            "terrible", "horrible", "bad", "worst", "broken", "awful", "useless", "defective",
            "waste", "rude", "poor", "slow", "disappointed", "hate", "scam", "damaged",
            "unacceptable", "delay", "delayed", "late", "crash", "buggy", "frustrated", "regret"
        }

        pos_count = sum(1 for w in pos_words if f" {w} " in cleaned)
        neg_count = sum(1 for w in neg_words if f" {w} " in cleaned)

        # Check for negations like "not good", "never buy", "no support"
        negation_patterns = [
            r"\b(not|never|no|hardly|barely|without)\s+(\w+\s+)?(good|great|happy|working|satisfied|helpful|recommend|worth)\b"
        ]
        for pattern in negation_patterns:
            if re.search(pattern, cleaned):
                neg_count += 2
                pos_count = max(0, pos_count - 1)

        total = pos_count + neg_count
        if total == 0:
            return (0.33, 0.34, 0.33)

        pos_score = pos_count / (total + 1)
        neg_score = neg_count / (total + 1)
        neu_score = max(0.1, 1.0 - (pos_score + neg_score))

        # Normalize
        s = pos_score + neu_score + neg_score
        return (pos_score / s, neu_score / s, neg_score / s)

    def _init_model(self):
        """Loads saved model or initializes a trained baseline pipeline."""
        if os.path.exists(self.model_path):
            try:
                self.pipeline = joblib.load(self.model_path)
                return
            except Exception as e:
                print(f"Warning: Could not load saved model from {self.model_path}: {e}")

        # Build & train a robust baseline classifier
        self._train_baseline_model()

    def _train_baseline_model(self):
        """Trains an initial model on a curated benchmark review corpus."""
        # Curated balanced dataset covering positive, negative, and neutral reviews
        training_data = [
            # Positive (Label: 'positive')
            ("This product is amazing and exceeded all my expectations!", "positive"),
            ("Fast delivery and fantastic customer service. Highly recommend!", "positive"),
            ("The build quality is outstanding and works flawlessly.", "positive"),
            ("Super happy with my purchase. Value for money is great.", "positive"),
            ("Very friendly staff and delicious food. Will visit again.", "positive"),
            ("Easy to use, smooth interface, and very reliable performance.", "positive"),
            ("Excellent product, arrived 2 days earlier than expected!", "positive"),
            ("Top notch experience, everything was perfect.", "positive"),
            ("Brilliant quality, well packaged and exactly as described.", "positive"),
            ("Great support team, they resolved my issue in 5 minutes.", "positive"),
            ("The best service I have received so far. 5 stars!", "positive"),
            ("Clean packaging, crisp sound quality, love this device.", "positive"),
            ("Super fast shipping, neat packaging, very satisfied customer.", "positive"),
            ("Affordable price with premium feel. Loved it.", "positive"),
            ("Customer care was very polite and helpful.", "positive"),
            
            # Negative (Label: 'negative')
            ("The product stopped working after two days of use.", "negative"),
            ("Worst customer service ever. Rude staff and no response.", "negative"),
            ("Extremely slow delivery. The package arrived damaged and open.", "negative"),
            ("Terrible quality. Complete waste of money, do not buy.", "negative"),
            ("The item received is defective and customer support refused refund.", "negative"),
            ("Horrible experience. The app crashes every time I try to checkout.", "negative"),
            ("Overpriced for such low quality. Highly disappointed.", "negative"),
            ("They charged me twice and refused to give my money back.", "negative"),
            ("The courier guy was very rude and delayed the shipment by a week.", "negative"),
            ("Not good at all, completely broke on first usage.", "negative"),
            ("Poor material, cheap plastic, totally not worth the price.", "negative"),
            ("Scam! Missing parts inside the box and seal was broken.", "negative"),
            ("App is full of bugs and impossible to navigate.", "negative"),
            ("Very bad taste and food was cold when delivered.", "negative"),
            ("Waited 45 minutes and no one attended to us. Awful service.", "negative"),

            # Neutral (Label: 'neutral')
            ("The product is okay, neither good nor bad.", "neutral"),
            ("Average quality. Does the job as expected.", "neutral"),
            ("Delivery took normal time. Standard packaging.", "neutral"),
            ("It is an ordinary item, nothing special to mention.", "neutral"),
            ("Decent product for the price point, average performance.", "neutral"),
            ("Received the item on time. Functions as described in manual.", "neutral"),
            ("Fair experience, acceptable food and standard ambiance.", "neutral"),
            ("The app works fine for basic needs.", "neutral"),
            ("Average battery life, neither impressive nor terrible.", "neutral"),
            ("It is acceptable for everyday routine use.", "neutral"),
            ("Standard service, no complaints but nothing standout.", "neutral"),
            ("Price is standard compared to other market competitors.", "neutral")
        ]

        texts = [self.clean_text(item[0]) for item in training_data]
        labels = [item[1] for item in training_data]

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
            ("clf", LogisticRegression(C=1.0, max_iter=200, class_weight="balanced"))
        ])

        pipeline.fit(texts, labels)
        self.pipeline = pipeline

        # Save for future fast loading
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.pipeline, self.model_path)
        except Exception as e:
            print(f"Could not persist model: {e}")

    def predict(self, raw_text: str, rating: int = None) -> Dict[str, Any]:
        """
        Classifies sentiment for a given review text.
        Returns:
            - sentiment_label: 'positive' | 'negative' | 'neutral'
            - confidence_score: float (0.0 to 1.0)
            - positive_prob, neutral_prob, negative_prob
        """
        if not raw_text or not raw_text.strip():
            return {
                "sentiment_label": "neutral",
                "confidence_score": 0.5,
                "positive_prob": 0.33,
                "neutral_prob": 0.34,
                "negative_prob": 0.33,
            }

        cleaned = self.clean_text(raw_text)
        classes = list(self.pipeline.classes_)

        # Machine Learning model probabilities
        ml_probs = self.pipeline.predict_proba([cleaned])[0]
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, ml_probs)}

        # Lexicon booster probabilities
        pos_b, neu_b, neg_b = self._lexicon_booster(raw_text)

        # Weighted combination: 65% ML Classifier + 35% Lexicon booster
        final_pos = (prob_dict.get("positive", 0.0) * 0.65) + (pos_b * 0.35)
        final_neu = (prob_dict.get("neutral", 0.0) * 0.65) + (neu_b * 0.35)
        final_neg = (prob_dict.get("negative", 0.0) * 0.65) + (neg_b * 0.35)

        # If star rating is provided (1 to 5), incorporate rating prior
        if rating is not None and isinstance(rating, int):
            if rating >= 4:
                final_pos += 0.25
                final_neg = max(0.0, final_neg - 0.15)
            elif rating == 3:
                final_neu += 0.20
            elif rating <= 2:
                final_neg += 0.25
                final_pos = max(0.0, final_pos - 0.15)

        # Normalize
        total_p = final_pos + final_neu + final_neg
        final_pos /= total_p
        final_neu /= total_p
        final_neg /= total_p

        # Determine winner label
        probs = {"positive": final_pos, "neutral": final_neu, "negative": final_neg}
        top_label = max(probs, key=probs.get)
        confidence = probs[top_label]

        return {
            "sentiment_label": top_label,
            "confidence_score": round(float(confidence), 3),
            "positive_prob": round(float(final_pos), 3),
            "neutral_prob": round(float(final_neu), 3),
            "negative_prob": round(float(final_neg), 3),
        }


# Singleton instance
_model_instance = None

def get_sentiment_model() -> SentimentModel:
    global _model_instance
    if _model_instance is None:
        _model_instance = SentimentModel()
    return _model_instance
