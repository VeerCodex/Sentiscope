-- ==========================================================
-- Sentiment Analysis Software for Businesses
-- Database Schema for Supabase (PostgreSQL) / Standard SQL
-- ==========================================================

-- 1. Businesses Table (Supports multi-tenancy)
CREATE TABLE IF NOT EXISTS businesses (
    business_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Raw Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(business_id) ON DELETE CASCADE,
    source VARCHAR(50) DEFAULT 'manual', -- 'amazon' | 'flipkart' | 'google' | 'csv' | 'manual'
    raw_text TEXT NOT NULL,
    rating INT DEFAULT NULL,              -- 1 to 5 stars if available
    customer_name VARCHAR(150) DEFAULT 'Anonymous',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sentiment Classification Results Table
CREATE TABLE IF NOT EXISTS sentiment_results (
    result_id SERIAL PRIMARY KEY,
    feedback_id INT NOT NULL REFERENCES feedback(feedback_id) ON DELETE CASCADE,
    sentiment_label VARCHAR(20) NOT NULL, -- 'positive' | 'negative' | 'neutral'
    confidence_score FLOAT NOT NULL DEFAULT 1.0,
    positive_prob FLOAT DEFAULT 0.0,
    neutral_prob FLOAT DEFAULT 0.0,
    negative_prob FLOAT DEFAULT 0.0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Complaint Topics / Categories Table
CREATE TABLE IF NOT EXISTS topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'delivery', 'pricing', 'quality', 'service', 'packaging', 'support'
    description TEXT
);

-- 5. Feedback-Topics Many-to-Many Mapping
CREATE TABLE IF NOT EXISTS feedback_topics (
    feedback_id INT NOT NULL REFERENCES feedback(feedback_id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    confidence FLOAT DEFAULT 1.0,
    PRIMARY KEY (feedback_id, topic_id)
);

-- ==========================================================
-- Seed Default Topics (Complaint Categories)
-- ==========================================================
INSERT INTO topics (topic_name, description) VALUES
    ('delivery', 'Issues regarding late shipment, delayed delivery, courier handling, or tracking'),
    ('pricing', 'Complaints regarding high price, unexpected charges, refund issues, or value for money'),
    ('quality', 'Issues concerning product defects, poor build, malfunction, bad taste, or durability'),
    ('service', 'Complaints regarding rude staff, unhelpful customer support, or slow response'),
    ('packaging', 'Issues with damaged boxes, missing items, poor wrapping, or broken seal'),
    ('usability', 'Complaints about confusing software, difficult interface, bugs, or user experience')
ON CONFLICT (topic_name) DO NOTHING;

-- Seed Default Demo Businesses
INSERT INTO businesses (name, category) VALUES
    ('TechGear Electronics', 'E-Commerce'),
    ('Spice & Herb Bistro', 'Restaurant & Food'),
    ('SwiftDrop Logistics', 'Courier & Logistics')
ON CONFLICT DO NOTHING;
