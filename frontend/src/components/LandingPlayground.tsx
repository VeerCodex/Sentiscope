import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { FeedbackService } from '../services/api';

const SAMPLE_PROMPTS = [
  "Delivery was delayed by 6 days and customer support refused to refund my money.",
  "Super fast shipping! The noise cancellation is crystal clear and battery lasts 30 hours.",
  "The product is acceptable, neither good nor bad. Standard delivery time.",
  "The mobile app crashes every time I try to add items to my shopping cart."
];

export const LandingPlayground: React.FC = () => {
  const [text, setText] = useState(SAMPLE_PROMPTS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async (testText = text) => {
    if (!testText.trim()) return;
    setLoading(true);
    try {
      const res = await FeedbackService.analyzeText({
        text: testText.trim(),
        save_to_db: false,
        source: 'landing_demo'
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-10 space-y-3">
          <span className="text-xs font-semibold text-brand tracking-wider uppercase font-display">
            Live interactive demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            Test the sentiment classifier live
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            Type any customer review or pick a preset to see the model classify sentiment and extract root causes in real time.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-mono text-text-tertiary mr-1">Presets:</span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setText(p);
                handleTest(p);
              }}
              className="text-xs font-sans px-3 py-1.5 rounded-full bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary transition-colors border border-border max-w-xs truncate text-left"
            >
              "{p.slice(0, 32)}..."
            </button>
          ))}
        </div>

        {/* Playground Surface Card */}
        <div className="md-card p-6 sm:p-7 space-y-5">
          
          <div className="space-y-2">
            <label className="block text-xs font-medium text-text-secondary font-sans">
              Enter customer feedback text:
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write customer feedback..."
              className="md-input w-full text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
              Model: TF-IDF + Logistic Regression
            </span>

            <button
              onClick={() => handleTest()}
              disabled={loading || !text.trim()}
              className="md-btn-pill md-btn-primary gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Classifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="mt-4 pt-5 border-t border-border space-y-4 animate-in fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary font-sans">Result:</span>
                  {result.sentiment?.sentiment_label === 'positive' && (
                    <span className="sentiment-pill sentiment-pill-pos">
                      <span className="w-1.5 h-1.5 rounded-full bg-pos" />
                      <span>{Math.round((result.sentiment?.confidence_score || 1) * 100)}% POSITIVE</span>
                    </span>
                  )}
                  {result.sentiment?.sentiment_label === 'neutral' && (
                    <span className="sentiment-pill sentiment-pill-neu">
                      <span className="w-1.5 h-1.5 rounded-full bg-neu" />
                      <span>{Math.round((result.sentiment?.confidence_score || 1) * 100)}% NEUTRAL</span>
                    </span>
                  )}
                  {result.sentiment?.sentiment_label === 'negative' && (
                    <span className="sentiment-pill sentiment-pill-neg">
                      <span className="w-1.5 h-1.5 rounded-full bg-neg" />
                      <span>{Math.round((result.sentiment?.confidence_score || 1) * 100)}% NEGATIVE</span>
                    </span>
                  )}
                </div>

                {/* Complaint Topics */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-text-secondary font-sans">Topics:</span>
                  {result.topics && result.topics.length > 0 ? (
                    result.topics.map((t: any, i: number) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-neg-subtle text-neg border border-neg-border font-semibold capitalize"
                      >
                        #{t.topic_name}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-text-tertiary text-[11px]">None detected</span>
                  )}
                </div>
              </div>

              {/* Class Probabilities in Roboto Mono */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-surface-variant border border-border">
                  <div className="flex justify-between text-xs font-mono text-pos mb-1 font-semibold">
                    <span>Positive</span>
                    <span>{Math.round((result.sentiment?.positive_prob || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-pos h-full rounded-full" style={{ width: `${(result.sentiment?.positive_prob || 0) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-variant border border-border">
                  <div className="flex justify-between text-xs font-mono text-neu mb-1 font-semibold">
                    <span>Neutral</span>
                    <span>{Math.round((result.sentiment?.neutral_prob || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-neu h-full rounded-full" style={{ width: `${(result.sentiment?.neutral_prob || 0) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-variant border border-border">
                  <div className="flex justify-between text-xs font-mono text-neg mb-1 font-semibold">
                    <span>Negative</span>
                    <span>{Math.round((result.sentiment?.negative_prob || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-neg h-full rounded-full" style={{ width: `${(result.sentiment?.negative_prob || 0) * 100}%` }} />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
