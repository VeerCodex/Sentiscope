# Sentiment Analysis Software for Businesses
### *AI-Powered Customer Feedback & Complaint Theme Intelligence Platform*
**B.Tech 3rd Year Mini Project**

---

## 1. Problem Statement
Businesses across e-commerce, hospitality, logistics, and retail receive vast streams of customer feedback daily through product reviews (Amazon, Flipkart), Google Maps reviews, social media, and internal surveys. Manually reading, categorizing, and prioritizing thousands of reviews is slow, error-prone, and expensive. As a result:
- **Delayed Intervention**: Critical product defects or delivery failures go unnoticed until customer churn spikes.
- **Lack of Root Cause Attribution**: Knowing feedback is "negative" without knowing *why* (e.g. shipping delay vs. rude support vs. broken packaging) leaves teams unable to take corrective action.
- **Fragmented Data**: Businesses lack a unified analytics dashboard to compare feedback across multiple branches or products over time.

---

## 2. Proposed Solution
**SentiScope** is a full-stack, AI-powered platform that ingests customer feedback from multiple channels, performs machine learning sentiment classification (Positive / Negative / Neutral) with confidence scoring, extracts specific complaint themes (Delivery, Pricing, Quality, Service, Packaging, Usability), and visualizes the intelligence on a live executive dashboard.

---

## 3. System Architecture & Data Flow

```
                     ┌──────────────────────────────────────────────┐
                     │              Feedback Sources                │
                     │  - CSV Bulk Upload (Amazon/Flipkart/Surveys) │
                     │  - Live Text Input (NLP Sandbox)             │
                     │  - Google Places API / Live Review Fetcher   │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          FastAPI Backend (Python)            │
                     │  - Text Cleaning & Tokenization              │
                     │  - Contraction Expansion & Stopword Filter   │
                     └──────────────┬────────────────┬──────────────┘
                                    │                │
            ┌───────────────────────┘                └────────────────────────┐
            ▼                                                                 ▼
┌───────────────────────────────┐                         ┌───────────────────────────────┐
│     Sentiment Classifier      │                         │   Complaint Topic Extractor   │
│ - TF-IDF Feature Extraction   │                         │ - Rule-Based Keyword Engine   │
│ - Logistic Regression Model   │                         │ - Multi-Label Complaint Theme │
│ - Lexicon Confidence Booster  │                         │   (Delivery, Pricing, Quality)│
└───────────────┬───────────────┘                         └───────────────┬───────────────┘
                │                                                         │
                └───────────────────────────┬─────────────────────────────┘
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          Database Storage Layer              │
                     │  - Supabase (Managed PostgreSQL)             │
                     │  - High-Performance SQLite Local Fallback   │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │        React.js Analytics Dashboard          │
                     │  - Executive KPI Cards (NSS, %, Averages)    │
                     │  - Sentiment Timeline Trends (Chart.js)      │
                     │  - Complaint Topic Frequency Breakdown       │
                     │  - Interactive Feedback Explorer & CSV Export│
                     └──────────────────────────────────────────────┘
```

---

## 4. Key Features

1. **Multi-Source Feedback Ingestion**:
   - **CSV Bulk Uploader**: Drag & drop CSV reviews with automatic column mapping (`review`, `rating`, `customer_name`, `source`, `date`).
   - **Real-Time NLP Sandbox**: Type or paste any text to test tokenization, class probabilities, and topic detection.
   - **Google Places Live Review Fetcher**: Ingest reviews for any physical or online business query (e.g. "Starbucks Seattle", "Apple Store NYC").
2. **Dual-Engine Machine Learning**:
   - **Sentiment Model**: Hybrid TF-IDF + Logistic Regression calibrated with lexicon boosting for negations (*"not good"*, *"never arrived"*) and confidence scores.
   - **Topic Extractor**: Identifies complaint categories (*Delivery, Pricing, Quality, Service, Packaging, Usability*) from customer feedback.
3. **Executive Analytics Dashboard**:
   - **KPI Metrics**: Total Reviews, Positive %, Neutral %, Negative %, Net Sentiment Score (NSS: -100 to +100), and Average Rating.
   - **Sentiment Trends Over Time**: Interactive Chart.js timeline showing sentiment trajectory over days/weeks.
   - **Root Cause & Complaint Distribution**: Bar meters and expandable sample quotes for each problem category.
4. **Multi-Business / Workspace Management**:
   - Filter analytics and feedback by specific business or view cross-business aggregated metrics.
5. **Zero-Friction Dual Database**:
   - Works immediately out-of-the-box with local SQLite.
   - Connects seamlessly to Supabase PostgreSQL simply by providing `SUPABASE_URL` and `SUPABASE_KEY` in `.env`.

---

## 5. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js (Vite), TailwindCSS, Chart.js, Lucide Icons | Modern, responsive dark-mode analytics dashboard |
| **Backend** | FastAPI (Python 3.10+), Uvicorn, Pydantic | High-performance RESTful API & data processing |
| **Machine Learning** | Scikit-Learn, TF-IDF, NLTK, Pandas, NumPy | NLP text preprocessing, sentiment classification & topic extraction |
| **Database** | Supabase (PostgreSQL) / Local SQLite | Persistent storage for businesses, reviews, sentiment, and topic mappings |
| **Data Ingestion** | Python-Multipart, Pandas, Google Places API | CSV parsing, batch ingestion, and live review fetching |

---

## 6. Database Schema

The database schema is defined in `database/schema.sql` and includes:

```sql
-- 1. Businesses (Supports multi-tenancy)
CREATE TABLE businesses (
    business_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Raw Feedback
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id) ON DELETE CASCADE,
    source VARCHAR(50) DEFAULT 'manual', -- 'amazon' | 'flipkart' | 'google' | 'csv' | 'manual'
    raw_text TEXT NOT NULL,
    rating INT DEFAULT NULL,              -- 1 to 5 stars
    customer_name VARCHAR(150) DEFAULT 'Anonymous',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sentiment Classification Results
CREATE TABLE sentiment_results (
    result_id SERIAL PRIMARY KEY,
    feedback_id INT NOT NULL REFERENCES feedback(feedback_id) ON DELETE CASCADE,
    sentiment_label VARCHAR(20) NOT NULL, -- 'positive' | 'negative' | 'neutral'
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    positive_prob FLOAT DEFAULT 0.0,
    neutral_prob FLOAT DEFAULT 0.0,
    negative_prob FLOAT DEFAULT 0.0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Complaint Topics / Categories
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100) NOT NULL UNIQUE, -- 'delivery', 'pricing', 'quality', 'service', 'packaging', 'usability'
    description TEXT
);

-- 5. Feedback-Topics Many-to-Many Mapping
CREATE TABLE feedback_topics (
    feedback_id INT NOT NULL REFERENCES feedback(feedback_id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    confidence FLOAT DEFAULT 1.0,
    PRIMARY KEY (feedback_id, topic_id)
);
```

---

## 7. Project Structure

```
Business Analysis/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entrypoint, lifespan startup & CORS
│   │   ├── db/
│   │   │   ├── database.py          # Unified database layer (SQLite & Supabase)
│   │   │   └── supabase_client.py   # Supabase client wrapper
│   │   ├── ml/
│   │   │   ├── sentiment_model.py   # TF-IDF + Logistic Regression + Lexicon booster
│   │   │   ├── topic_extractor.py   # Complaint theme keyword extractor
│   │   │   └── train.py             # Model training script for Kaggle/CSV datasets
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── analytics.py         # Summary KPIs, sentiment trend & topic endpoints
│   │   │   ├── businesses.py        # Business management & demo seeder
│   │   │   └── feedback.py          # CSV upload, live NLP sandbox & feedback log
│   │   └── services/
│   │       ├── google_reviews.py    # Google Places API / live simulator
│   │       └── sample_data.py       # Rich sample feedback datasets
│   ├── data/
│   │   └── sample_reviews.csv       # Sample test dataset for CSV upload
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment configuration template
│   └── .env                         # Active configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Header, business switcher & tab navigation
│   │   │   ├── MetricCards.jsx      # Summary KPI cards (Total, Pos%, Neu%, Neg%, NSS)
│   │   │   ├── SentimentChart.jsx   # Chart.js trend timeline & donut chart
│   │   │   ├── TopicBreakdown.jsx   # Complaint topic breakdown & quote viewer
│   │   │   ├── FeedbackTable.jsx    # Filterable feedback table with CSV export
│   │   │   └── BusinessSelector.jsx # Modal to add new business profiles
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Executive analytics dashboard
│   │   │   ├── RealTimeAnalyzer.jsx # Interactive NLP sandbox
│   │   │   ├── UploadFeedback.jsx   # CSV file drag & drop uploader
│   │   │   ├── LiveReviews.jsx      # Google Places review ingestion
│   │   │   └── FeedbackList.jsx     # Feedback log repository
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx                  # Root React application
│   │   ├── main.jsx                 # React DOM mount
│   │   └── index.css                # Tailwind CSS & glassmorphism styling
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite build & proxy configuration
│   └── tailwind.config.js           # Tailwind CSS configuration
├── database/
│   └── schema.sql                   # Supabase PostgreSQL schema script
└── README.md                        # Complete project documentation
```

---

## 8. Getting Started & Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. The API is now active at `http://127.0.0.1:8000`.
   - Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

---

### Step 2: Start the Frontend (React + Vite)

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

### Step 3 (Optional): Connect to Supabase PostgreSQL
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and paste the contents of `database/schema.sql`.
3. In `backend/.env`, set:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-or-service-key
   ```
4. Restart the backend server. The app will automatically connect to Supabase.

---

## 9. Machine Learning Training on Custom Datasets

To train the sentiment model on Kaggle datasets (e.g. Amazon / Flipkart / Yelp review CSVs):

```bash
cd backend
python -m app.ml.train --dataset-path data/your_reviews.csv --output-path app/ml/sentiment_model.joblib
```

The training pipeline:
1. Automatically detects review text and rating/sentiment columns.
2. Applies NLP preprocessing (lowercasing, punctuation normalization, contraction expansion).
3. Computes TF-IDF n-grams (1-gram and 2-gram).
4. Fits a balanced Logistic Regression classifier.
5. Prints accuracy, precision, recall, and F1-score evaluation metrics.

---

## 10. Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/feedback/analyze` | Real-time NLP sentiment & topic analysis on arbitrary text |
| `POST` | `/feedback/single` | Submit a single review and persist to database |
| `POST` | `/feedback/upload` | Bulk upload reviews from a CSV file |
| `POST` | `/feedback/fetch-google` | Fetch and classify live/simulated Google Places reviews |
| `GET` | `/feedback` | List feedback records with sentiment, topics, and filters |
| `DELETE`| `/feedback/{id}` | Delete a feedback entry |
| `GET` | `/analytics/summary` | Get KPI metrics, percentages, NSS score, and trends |
| `GET` | `/analytics/sentiment-trend` | Time-series sentiment counts over time |
| `GET` | `/analytics/top-topics` | Complaint category frequency breakdown |
| `GET` | `/businesses` | List all registered business profiles |
| `POST` | `/businesses` | Create a new business profile |
| `POST` | `/businesses/seed-demo`| Seed realistic sample businesses & reviews |

---

## 11. Viva Voce & Presentation Q&A Guide

### Q1: Why use TF-IDF with Logistic Regression instead of just a rule-based dictionary?
> **Answer**: Rule-based dictionaries struggle with context, vocabulary variations, and statistical weightings. TF-IDF (Term Frequency - Inverse Document Frequency) captures the relative importance of words and n-gram pairs (e.g., *"not good"* vs *"good"*), while Logistic Regression computes calibrated class probabilities. We also combine this with a lexicon booster to handle subtle negations and intensifiers.

### Q2: What is Net Sentiment Score (NSS)?
> **Answer**: Net Sentiment Score is a standard customer intelligence metric calculated as:
> $$\text{NSS} = \frac{\text{Positive Reviews} - \text{Negative Reviews}}{\text{Total Reviews}} \times 100$$
> It ranges from $-100$ (all negative) to $+100$ (all positive), providing an instant benchmark of customer sentiment.

### Q3: How does the system extract complaint themes?
> **Answer**: The topic extractor processes negative and neutral reviews against categorized semantic dictionaries covering key business operational domains (*Delivery, Pricing, Quality, Service, Packaging, Usability*). It matches lemmatized keywords and regex patterns to tag specific root causes for every complaint.

### Q4: How is data persistence handled?
> **Answer**: We implemented a hybrid architecture: it defaults to local SQLite for instant zero-configuration offline execution, and seamlessly connects to a managed PostgreSQL cluster on Supabase when environment credentials are provided.

---

## 12. Future Scope
- **Transformer Integration**: Fine-tuning BERT / RoBERTa models for multi-lingual sentiment classification.
- **Automated Anomaly Alerting**: Email / Slack webhook triggers when negative sentiment spikes beyond a threshold.
- **Aspect-Based Sentiment Analysis (ABSA)**: Evaluating sentiment at individual phrase levels within a single sentence.
