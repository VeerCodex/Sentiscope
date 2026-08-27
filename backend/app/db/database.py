import os
import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.db.supabase_client import get_supabase_client

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sentiment_analysis.db")


class Database:
    """
    Unified Database Layer.
    Automatically uses Supabase if configured, or high-performance local SQLite.
    """

    def __init__(self):
        self.supabase = get_supabase_client()
        self.is_supabase = self.supabase is not None
        self._init_sqlite_schema()

    def _get_connection(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_sqlite_schema(self):
        """Initializes SQLite tables if they do not exist and seeds default records."""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS businesses (
            business_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS feedback (
            feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_id INTEGER,
            source TEXT DEFAULT 'manual',
            raw_text TEXT NOT NULL,
            rating INTEGER DEFAULT NULL,
            customer_name TEXT DEFAULT 'Anonymous',
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES businesses(business_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sentiment_results (
            result_id INTEGER PRIMARY KEY AUTOINCREMENT,
            feedback_id INTEGER NOT NULL,
            sentiment_label TEXT NOT NULL,
            confidence_score REAL DEFAULT 1.0,
            positive_prob REAL DEFAULT 0.0,
            neutral_prob REAL DEFAULT 0.0,
            negative_prob REAL DEFAULT 0.0,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (feedback_id) REFERENCES feedback(feedback_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS topics (
            topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_name TEXT NOT NULL UNIQUE,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS feedback_topics (
            feedback_id INTEGER NOT NULL,
            topic_id INTEGER NOT NULL,
            confidence REAL DEFAULT 1.0,
            PRIMARY KEY (feedback_id, topic_id),
            FOREIGN KEY (feedback_id) REFERENCES feedback(feedback_id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
        );
        """)

        # Seed default topics if not exists
        default_topics = [
            ("delivery", "Issues regarding late shipment, delayed delivery, courier handling, or tracking"),
            ("pricing", "Complaints regarding high price, unexpected charges, refund issues, or value for money"),
            ("quality", "Issues concerning product defects, poor build, malfunction, bad taste, or durability"),
            ("service", "Complaints regarding rude staff, unhelpful customer support, or slow response"),
            ("packaging", "Issues with damaged boxes, missing items, poor wrapping, or broken seal"),
            ("usability", "Complaints about confusing software, difficult interface, bugs, or user experience")
        ]
        for name, desc in default_topics:
            cursor.execute("INSERT OR IGNORE INTO topics (topic_name, description) VALUES (?, ?)", (name, desc))

        # Check if businesses exist, seed defaults if empty
        cursor.execute("SELECT COUNT(*) FROM businesses")
        if cursor.fetchone()[0] == 0:
            default_businesses = [
                ("TechGear Electronics", "E-Commerce"),
                ("Spice & Herb Bistro", "Restaurant & Hospitality"),
                ("SwiftDrop Courier", "Logistics & Shipping")
            ]
            for b_name, b_cat in default_businesses:
                cursor.execute("INSERT INTO businesses (name, category) VALUES (?, ?)", (b_name, b_cat))

        conn.commit()
        conn.close()

    # -------------------------------------------------------------
    # Business Management
    # -------------------------------------------------------------
    def get_businesses(self) -> List[Dict[str, Any]]:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM businesses ORDER BY business_id ASC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows

    def get_business_by_id(self, business_id: int) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM businesses WHERE business_id = ?", (business_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    def create_business(self, name: str, category: str = "General") -> Dict[str, Any]:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO businesses (name, category) VALUES (?, ?)", (name, category))
        business_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return {"business_id": business_id, "name": name, "category": category, "created_at": datetime.utcnow().isoformat()}

    # -------------------------------------------------------------
    # Feedback & Sentiment Ingestion
    # -------------------------------------------------------------
    def insert_feedback(
        self,
        business_id: Optional[int],
        source: str,
        raw_text: str,
        sentiment: Dict[str, Any],
        topics: List[Dict[str, Any]],
        rating: Optional[int] = None,
        customer_name: Optional[str] = "Anonymous",
        submitted_at: Optional[str] = None
    ) -> int:
        """Inserts feedback, sentiment classification result, and topic associations in a transaction."""
        conn = self._get_connection()
        cursor = conn.cursor()

        sub_time = submitted_at or datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        # 1. Insert Feedback
        cursor.execute(
            "INSERT INTO feedback (business_id, source, raw_text, rating, customer_name, submitted_at) VALUES (?, ?, ?, ?, ?, ?)",
            (business_id, source, raw_text, rating, customer_name, sub_time)
        )
        feedback_id = cursor.lastrowid

        # 2. Insert Sentiment Result
        cursor.execute(
            """INSERT INTO sentiment_results 
               (feedback_id, sentiment_label, confidence_score, positive_prob, neutral_prob, negative_prob, analyzed_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                feedback_id,
                sentiment.get("sentiment_label", "neutral"),
                sentiment.get("confidence_score", 1.0),
                sentiment.get("positive_prob", 0.0),
                sentiment.get("neutral_prob", 0.0),
                sentiment.get("negative_prob", 0.0),
                datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            )
        )

        # 3. Associate Topics
        for t in topics:
            t_name = t.get("topic_name", "").lower()
            if not t_name:
                continue

            # Ensure topic exists
            cursor.execute("SELECT topic_id FROM topics WHERE topic_name = ?", (t_name,))
            topic_row = cursor.fetchone()
            if topic_row:
                topic_id = topic_row[0]
            else:
                cursor.execute("INSERT INTO topics (topic_name, description) VALUES (?, ?)", (t_name, t.get("description", "")))
                topic_id = cursor.lastrowid

            cursor.execute(
                "INSERT OR IGNORE INTO feedback_topics (feedback_id, topic_id, confidence) VALUES (?, ?, ?)",
                (feedback_id, topic_id, t.get("confidence", 1.0))
            )

        conn.commit()
        conn.close()
        return feedback_id

    # -------------------------------------------------------------
    # Feedback Querying & Listing
    # -------------------------------------------------------------
    def get_feedback_list(
        self,
        business_id: Optional[int] = None,
        sentiment_label: Optional[str] = None,
        topic_name: Optional[str] = None,
        search_query: Optional[str] = None,
        source: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        conn = self._get_connection()
        cursor = conn.cursor()

        query = """
            SELECT 
                f.feedback_id, f.business_id, b.name as business_name, f.source, f.raw_text, 
                f.rating, f.customer_name, f.submitted_at,
                s.sentiment_label, s.confidence_score, s.positive_prob, s.neutral_prob, s.negative_prob
            FROM feedback f
            LEFT JOIN businesses b ON f.business_id = b.business_id
            LEFT JOIN sentiment_results s ON f.feedback_id = s.feedback_id
            WHERE 1=1
        """
        params = []

        if business_id is not None:
            query += " AND f.business_id = ?"
            params.append(business_id)

        if sentiment_label:
            query += " AND s.sentiment_label = ?"
            params.append(sentiment_label.lower())

        if source:
            query += " AND f.source = ?"
            params.append(source.lower())

        if search_query:
            query += " AND (f.raw_text LIKE ? OR f.customer_name LIKE ?)"
            search_param = f"%{search_query}%"
            params.extend([search_param, search_param])

        if topic_name:
            query += """ AND f.feedback_id IN (
                SELECT ft.feedback_id FROM feedback_topics ft
                JOIN topics t ON ft.topic_id = t.topic_id
                WHERE t.topic_name = ?
            )"""
            params.append(topic_name.lower())

        query += " ORDER BY f.submitted_at DESC, f.feedback_id DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()

        results = []
        for r in rows:
            f_id = r["feedback_id"]
            # Fetch topics for this feedback
            cursor.execute("""
                SELECT t.topic_id, t.topic_name, t.description, ft.confidence
                FROM feedback_topics ft
                JOIN topics t ON ft.topic_id = t.topic_id
                WHERE ft.feedback_id = ?
            """, (f_id,))
            t_rows = [dict(tr) for tr in cursor.fetchall()]

            item = {
                "feedback_id": r["feedback_id"],
                "business_id": r["business_id"],
                "business_name": r["business_name"],
                "source": r["source"],
                "raw_text": r["raw_text"],
                "rating": r["rating"],
                "customer_name": r["customer_name"],
                "submitted_at": r["submitted_at"],
                "sentiment": {
                    "sentiment_label": r["sentiment_label"] or "neutral",
                    "confidence_score": r["confidence_score"] or 1.0,
                    "positive_prob": r["positive_prob"] or 0.0,
                    "neutral_prob": r["neutral_prob"] or 0.0,
                    "negative_prob": r["negative_prob"] or 0.0,
                },
                "topics": t_rows
            }
            results.append(item)

        conn.close()
        return results

    def delete_feedback(self, feedback_id: int) -> bool:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM feedback WHERE feedback_id = ?", (feedback_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    # -------------------------------------------------------------
    # Analytics & Trend Calculations
    # -------------------------------------------------------------
    def get_analytics_summary(self, business_id: Optional[int] = None) -> Dict[str, Any]:
        conn = self._get_connection()
        cursor = conn.cursor()

        filter_clause = "WHERE f.business_id = ?" if business_id is not None else ""
        params = [business_id] if business_id is not None else []

        # Total and sentiment breakdown
        cursor.execute(f"""
            SELECT 
                COUNT(f.feedback_id) as total_count,
                SUM(CASE WHEN s.sentiment_label = 'positive' THEN 1 ELSE 0 END) as pos_count,
                SUM(CASE WHEN s.sentiment_label = 'neutral' THEN 1 ELSE 0 END) as neu_count,
                SUM(CASE WHEN s.sentiment_label = 'negative' THEN 1 ELSE 0 END) as neg_count,
                AVG(f.rating) as avg_rating
            FROM feedback f
            LEFT JOIN sentiment_results s ON f.feedback_id = s.feedback_id
            {filter_clause}
        """, params)
        stat = cursor.fetchone()

        total = stat["total_count"] or 0
        pos = stat["pos_count"] or 0
        neu = stat["neu_count"] or 0
        neg = stat["neg_count"] or 0
        avg_rating = round(stat["avg_rating"], 1) if stat["avg_rating"] is not None else None

        pos_pct = round((pos / total * 100), 1) if total > 0 else 0.0
        neu_pct = round((neu / total * 100), 1) if total > 0 else 0.0
        neg_pct = round((neg / total * 100), 1) if total > 0 else 0.0

        # Net Sentiment Score: (Positive - Negative) / Total * 100  (-100 to +100)
        net_score = round(((pos - neg) / total * 100), 1) if total > 0 else 0.0

        # Trends over time (grouped by date)
        cursor.execute(f"""
            SELECT 
                DATE(f.submitted_at) as review_date,
                SUM(CASE WHEN s.sentiment_label = 'positive' THEN 1 ELSE 0 END) as pos_count,
                SUM(CASE WHEN s.sentiment_label = 'neutral' THEN 1 ELSE 0 END) as neu_count,
                SUM(CASE WHEN s.sentiment_label = 'negative' THEN 1 ELSE 0 END) as neg_count,
                COUNT(f.feedback_id) as day_total
            FROM feedback f
            LEFT JOIN sentiment_results s ON f.feedback_id = s.feedback_id
            {filter_clause}
            GROUP BY DATE(f.submitted_at)
            ORDER BY review_date ASC
            LIMIT 30
        """, params)
        trend_rows = cursor.fetchall()
        trends = [
            {
                "date": r["review_date"] or "Unknown",
                "positive": r["pos_count"] or 0,
                "neutral": r["neu_count"] or 0,
                "negative": r["neg_count"] or 0,
                "total": r["day_total"] or 0
            }
            for r in trend_rows
        ]

        # Top Topics (Complaint Breakdown)
        topic_params = [business_id] if business_id is not None else []
        topic_filter = "WHERE f.business_id = ?" if business_id is not None else ""
        cursor.execute(f"""
            SELECT 
                t.topic_name,
                COUNT(ft.feedback_id) as topic_count
            FROM feedback_topics ft
            JOIN topics t ON ft.topic_id = t.topic_id
            JOIN feedback f ON ft.feedback_id = f.feedback_id
            {topic_filter}
            GROUP BY t.topic_name
            ORDER BY topic_count DESC
        """, topic_params)
        topic_rows = cursor.fetchall()

        total_topic_mentions = sum(r["topic_count"] for r in topic_rows) or 1
        topic_breakdowns = []
        top_topic = None

        for idx, r in enumerate(topic_rows):
            if idx == 0:
                top_topic = r["topic_name"]

            # Sample review for this topic
            cursor.execute(f"""
                SELECT f.raw_text FROM feedback f
                JOIN feedback_topics ft ON f.feedback_id = ft.feedback_id
                JOIN topics t ON ft.topic_id = t.topic_id
                WHERE t.topic_name = ? {'AND f.business_id = ?' if business_id is not None else ''}
                LIMIT 2
            """, [r["topic_name"]] + ([business_id] if business_id is not None else []))
            sample_texts = [sr[0] for sr in cursor.fetchall()]

            topic_breakdowns.append({
                "topic_name": r["topic_name"],
                "count": r["topic_count"],
                "percentage": round((r["topic_count"] / total_topic_mentions) * 100, 1),
                "sample_reviews": sample_texts
            })

        conn.close()

        return {
            "total_feedback": total,
            "positive_count": pos,
            "neutral_count": neu,
            "negative_count": neg,
            "positive_pct": pos_pct,
            "neutral_pct": neu_pct,
            "negative_pct": neg_pct,
            "net_sentiment_score": net_score,
            "average_rating": avg_rating,
            "top_complaint_topic": top_topic,
            "sentiment_trends": trends,
            "topic_breakdowns": topic_breakdowns
        }


# Singleton database instance
_db_instance = None

def get_db() -> Database:
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
    return _db_instance
