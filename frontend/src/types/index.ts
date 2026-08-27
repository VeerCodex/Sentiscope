export interface SentimentResult {
  sentiment_label: 'positive' | 'neutral' | 'negative';
  confidence_score: number;
  positive_prob: number;
  neutral_prob: number;
  negative_prob: number;
}

export interface TopicItem {
  topic_id?: number;
  topic_name: string;
  description?: string;
  confidence?: number;
}

export interface FeedbackItem {
  feedback_id: number;
  business_id?: number | null;
  business_name?: string | null;
  source: string;
  raw_text: string;
  rating?: number | null;
  customer_name?: string;
  submitted_at?: string;
  sentiment?: SentimentResult;
  topics?: TopicItem[];
}

export interface SentimentTrendItem {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface TopicBreakdownItem {
  topic_name: string;
  count: number;
  percentage: number;
  sample_reviews?: string[];
}

export interface AnalyticsSummary {
  total_feedback: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  net_sentiment_score: number;
  average_rating?: number | null;
  top_complaint_topic?: string | null;
  sentiment_trends: SentimentTrendItem[];
  topic_breakdowns: TopicBreakdownItem[];
}

export interface Business {
  business_id: number;
  name: string;
  category?: string;
  created_at?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  tagline: string;
  accentColor: string;
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  techDetails: string[];
  iconName: string;
  highlightText: string;
}
