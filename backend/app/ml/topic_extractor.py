import re
from typing import List, Dict, Any


class TopicExtractor:
    """
    NLP Topic / Complaint Theme Extractor.
    Extracts recurring problem categories from customer feedback:
    - Delivery & Shipping
    - Pricing & Billing
    - Product Quality
    - Customer Service
    - Packaging & Condition
    - App & Usability
    """

    # Comprehensive domain keyword dictionary with weighted patterns
    TOPIC_DEFINITIONS = {
        "delivery": {
            "keywords": [
                "delivery", "shipping", "courier", "delay", "delayed", "late", "arrived late",
                "transit", "dispatch", "tracking", "lost package", "undelivered", "slow delivery",
                "days late", "shipment", "delivery boy", "delivery agent", "late delivery"
            ],
            "description": "Late delivery, courier tracking issues, delayed shipment"
        },
        "pricing": {
            "keywords": [
                "price", "pricing", "expensive", "overpriced", "cost", "costly", "refund",
                "money", "charged", "billing", "fee", "hidden fee", "rip off", "scam",
                "not worth the money", "discount", "payment", "overcharge", "double charged"
            ],
            "description": "High price, unexpected billing, refund delays, value for money"
        },
        "quality": {
            "keywords": [
                "quality", "broken", "defective", "defect", "poor build", "broke", "stopped working",
                "malfunction", "cheap plastic", "material", "terrible quality", "low quality",
                "durability", "damaged", "faulty", "smell", "taste", "spoiled", "cold food"
            ],
            "description": "Product defects, poor build quality, malfunction, durability issues"
        },
        "service": {
            "keywords": [
                "service", "customer support", "support", "customer care", "rude", "staff",
                "attitude", "agent", "unhelpful", "no response", "wait time", "waited",
                "manager", "behavior", "disrespectful", "ignored", "call center", "helpline"
            ],
            "description": "Rude staff, unhelpful customer care, long waiting times"
        },
        "packaging": {
            "keywords": [
                "package", "packaging", "box", "seal", "unsealed", "seal broken", "torn",
                "missing item", "missing parts", "crushed", "wrapping", "dented", "opened box"
            ],
            "description": "Damaged box, unsealed package, missing items or accessories"
        },
        "usability": {
            "keywords": [
                "app", "website", "bug", "crash", "interface", "ui", "login", "checkout",
                "error", "slow", "freeze", "navigation", "glitch", "update", "difficult to use"
            ],
            "description": "Software bugs, app crashes, difficult interface, login problems"
        }
    }

    def __init__(self):
        # Compile regex patterns for fast matching
        self.compiled_patterns = {}
        for topic, data in self.TOPIC_DEFINITIONS.items():
            pattern_str = r"\b(" + "|".join(re.escape(k) for k in data["keywords"]) + r")\b"
            self.compiled_patterns[topic] = re.compile(pattern_str, re.IGNORECASE)

    def extract_topics(self, raw_text: str, sentiment_label: str = None) -> List[Dict[str, Any]]:
        """
        Extracts matching topics for a given feedback text.
        For negative and neutral reviews, extracts all matching complaint themes.
        For positive reviews, only tags if strongly mentioned.
        """
        if not raw_text or not isinstance(raw_text, str):
            return []

        matched_topics = []
        text_lower = raw_text.lower()

        for topic, pattern in self.compiled_patterns.items():
            matches = pattern.findall(text_lower)
            if matches:
                # Count frequency of topic-related keywords in the text
                match_count = len(matches)
                confidence = min(1.0, 0.5 + (match_count * 0.25))

                matched_topics.append({
                    "topic_name": topic,
                    "description": self.TOPIC_DEFINITIONS[topic]["description"],
                    "confidence": round(confidence, 2),
                    "matched_keywords": list(set(matches))
                })

        # If sentiment is negative and no specific topic matched, tag as general service/quality
        if sentiment_label == "negative" and not matched_topics:
            matched_topics.append({
                "topic_name": "quality",
                "description": self.TOPIC_DEFINITIONS["quality"]["description"],
                "confidence": 0.5,
                "matched_keywords": ["general complaint"]
            })

        # Sort by confidence descending
        matched_topics.sort(key=lambda x: x["confidence"], reverse=True)
        return matched_topics


# Singleton instance
_extractor_instance = None

def get_topic_extractor() -> TopicExtractor:
    global _extractor_instance
    if _extractor_instance is None:
        _extractor_instance = TopicExtractor()
    return _extractor_instance
