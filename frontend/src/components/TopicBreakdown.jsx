import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp,
  Quote,
  Filter
} from 'lucide-react';

export default function TopicBreakdown({ summary, onTopicClick }) {
  const [expandedTopic, setExpandedTopic] = useState(null);

  if (!summary) return null;
  const topics = summary.topic_breakdowns || [];

  const toggleExpand = (topicName) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  return (
    <div className="md-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-neg" />
            <h3 className="font-bold text-text-primary text-base font-display">Top Complaint Themes & Root Causes</h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">
            NLP extracted problem categories from customer feedback
          </p>
        </div>
        <span className="text-xs font-mono text-text-tertiary hidden sm:block">
          {topics.length} Categories
        </span>
      </div>

      {topics.length === 0 ? (
        <div className="py-10 text-center text-text-tertiary font-sans">
          <p className="text-sm">No complaint themes detected yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => {
            const isExpanded = expandedTopic === t.topic_name;

            return (
              <div 
                key={t.topic_name}
                className="p-4 rounded-xl bg-surface-variant border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary capitalize font-display">
                        {t.topic_name}
                      </h4>
                      <span className="text-xs font-mono text-text-secondary">
                        {t.count} mentions ({t.percentage}%)
                      </span>
                    </div>

                    <button
                      onClick={() => onTopicClick && onTopicClick(t.topic_name)}
                      title="Filter feedback table by this topic"
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface hover:bg-border text-text-primary transition-colors border border-border"
                    >
                      Filter
                    </button>
                  </div>

                  {/* Frequency Progress Bar */}
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden mt-3">
                    <div 
                      className="h-full rounded-full bg-neg"
                      style={{ width: `${Math.min(100, t.percentage * 1.5)}%` }}
                    />
                  </div>
                </div>

                {/* Sample reviews expander */}
                {t.sample_reviews && t.sample_reviews.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleExpand(t.topic_name)}
                      className="w-full flex items-center justify-between text-xs text-text-secondary hover:text-text-primary transition-colors font-sans"
                    >
                      <span>Sample Quotes ({t.sample_reviews.length})</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 animate-in fade-in">
                        {t.sample_reviews.map((quote, qIdx) => (
                          <div key={qIdx} className="p-2.5 rounded-lg bg-surface border border-border text-xs text-text-secondary italic flex items-start gap-1.5 font-sans">
                            <Quote className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">"{quote}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
