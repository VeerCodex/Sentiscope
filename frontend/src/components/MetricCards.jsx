import React from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  MessageSquare, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp
} from 'lucide-react';

export default function MetricCards({ summary }) {
  if (!summary) return null;

  const {
    total_feedback = 0,
    positive_count = 0,
    neutral_count = 0,
    negative_count = 0,
    positive_pct = 0,
    neutral_pct = 0,
    negative_pct = 0,
    net_sentiment_score = 0,
    average_rating = null,
    top_complaint_topic = null
  } = summary;

  const isNetPositive = net_sentiment_score >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. Total Feedback */}
      <div className="md-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
            Total Reviews
          </span>
          <div className="p-2 rounded-xl bg-brand-subtle text-brand border border-brand-border">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-text-primary font-mono tracking-tight">
            {total_feedback.toLocaleString()}
          </span>
          <span className="text-xs text-text-tertiary font-sans">ingested</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-[11px] text-text-tertiary font-mono">
          <span>Active Ingestion Log</span>
        </div>
      </div>

      {/* 2. Positive Feedback (Google Green) */}
      <div className="md-card p-5 flex flex-col justify-between hover:border-pos-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-pos uppercase tracking-wider font-sans">
            Positive
          </span>
          <div className="p-2 rounded-xl bg-pos-subtle text-pos border border-pos-border">
            <Smile className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-pos font-mono tracking-tight">
            {positive_pct}%
          </span>
          <span className="text-xs font-mono text-text-tertiary">({positive_count})</span>
        </div>
        <div className="mt-3 w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-pos h-full rounded-full transition-all duration-500" 
            style={{ width: `${positive_pct}%` }}
          />
        </div>
      </div>

      {/* 3. Neutral Feedback (Google Yellow) */}
      <div className="md-card p-5 flex flex-col justify-between hover:border-neu-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neu uppercase tracking-wider font-sans">
            Neutral
          </span>
          <div className="p-2 rounded-xl bg-neu-subtle text-neu border border-neu-border">
            <Meh className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-neu font-mono tracking-tight">
            {neutral_pct}%
          </span>
          <span className="text-xs font-mono text-text-tertiary">({neutral_count})</span>
        </div>
        <div className="mt-3 w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-neu h-full rounded-full transition-all duration-500" 
            style={{ width: `${neutral_pct}%` }}
          />
        </div>
      </div>

      {/* 4. Negative Feedback (Google Red) */}
      <div className="md-card p-5 flex flex-col justify-between hover:border-neg-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neg uppercase tracking-wider font-sans">
            Negative
          </span>
          <div className="p-2 rounded-xl bg-neg-subtle text-neg border border-neg-border">
            <Frown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-neg font-mono tracking-tight">
            {negative_pct}%
          </span>
          <span className="text-xs font-mono text-text-tertiary">({negative_count})</span>
        </div>
        <div className="mt-3 w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-neg h-full rounded-full transition-all duration-500" 
            style={{ width: `${negative_pct}%` }}
          />
        </div>
      </div>

      {/* 5. Net Sentiment Score (NSS) */}
      <div className="md-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-sans">
            Net Score (NSS)
          </span>
          <div className={`p-2 rounded-xl border ${isNetPositive ? 'bg-pos-subtle text-pos border-pos-border' : 'bg-neg-subtle text-neg border-neg-border'}`}>
            {isNetPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className={`text-3xl font-bold font-mono tracking-tight ${isNetPositive ? 'text-pos' : 'text-neg'}`}>
            {isNetPositive ? `+${net_sentiment_score}` : net_sentiment_score}
          </span>
          {average_rating && (
            <span className="flex items-center gap-1 text-xs font-mono font-semibold text-neu bg-surface-variant px-2 py-0.5 rounded-full border border-border">
              <Star className="w-3 h-3 fill-current text-neu" />
              {average_rating}★
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] text-text-tertiary font-sans truncate">
          {top_complaint_topic ? (
            <span>Top Issue: <strong className="text-text-primary capitalize font-medium">{top_complaint_topic}</strong></span>
          ) : (
            <span>No top complaint identified</span>
          )}
        </div>
      </div>

    </div>
  );
}
