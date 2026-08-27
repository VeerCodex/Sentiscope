import React, { useState } from 'react';
import { Sparkles, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { FeedbackService } from '../services/api';

const PRESET_EXAMPLES = [
  {
    label: "Positive Audio Review",
    text: "Outstanding noise cancellation and battery life easily lasts 35 hours. Best headphones I have purchased!",
    author: "Rachel Green"
  },
  {
    label: "Negative Delivery & Support",
    text: "Package was delayed by 6 days and the item arrived cracked. Support agent refused to refund my money.",
    author: "Ross Geller"
  },
  {
    label: "Neutral General Feedback",
    text: "The device works okay, nothing extraordinary. Standard packaging and normal delivery speed.",
    author: "Chandler Bing"
  },
  {
    label: "Broken App & Usability",
    text: "The application crashes every single time I try to complete my checkout process. Terrible UI bug.",
    author: "Monica Geller"
  }
];

export default function RealTimeAnalyzer({ businesses = [], selectedBusiness, onFeedbackAdded }) {
  const [text, setText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState('Manual');
  const [businessId, setBusinessId] = useState(selectedBusiness || (businesses[0]?.business_id || ''));
  const [saveToDb, setSaveToDb] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const data = await FeedbackService.analyzeText({
        text: text.trim(),
        customer_name: customerName || undefined,
        rating: rating ? parseInt(rating) : undefined,
        source: source || 'Manual',
        business_id: businessId || undefined,
        save_to_db: saveToDb
      });

      setResult(data);
      if (saveToDb && data.feedback_id) {
        setSavedSuccess(true);
        if (onFeedbackAdded) onFeedbackAdded();
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to classify feedback. Please check that the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset) => {
    setText(preset.text);
    setCustomerName(preset.author);
    setResult(null);
    setSavedSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Machine Learning Testing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1 font-display">
          Real-Time NLP Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
          Type custom customer feedback to inspect TF-IDF tokenization, sentiment class probabilities, and complaint theme extraction.
        </p>
      </div>

      {/* Preset Review Chips */}
      <div>
        <span className="text-xs font-mono text-text-tertiary block mb-2 font-medium">Quick Benchmark Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="px-3 py-1.5 rounded-full text-xs bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary border border-border transition-colors font-sans"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Live Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form Card */}
        <div className="lg:col-span-7 md-card p-6 space-y-5">
          <form onSubmit={handleAnalyze} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 font-sans">
                Customer Review / Feedback Text: *
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter customer feedback..."
                className="md-input w-full text-sm leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Anonymous"
                  className="md-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
                  Rating (1-5)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="md-input w-full text-xs bg-surface cursor-pointer"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                  <option value={2}>2 Stars ★★☆☆☆</option>
                  <option value={1}>1 Star ★☆☆☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
                  Source Channel
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="md-input w-full text-xs bg-surface cursor-pointer"
                >
                  <option value="Manual">Manual Entry</option>
                  <option value="Amazon">Amazon Review</option>
                  <option value="Google">Google Maps</option>
                  <option value="Survey">Customer Survey</option>
                  <option value="Email">Support Ticket</option>
                </select>
              </div>
            </div>

            {/* Business selection & Save to DB toggle */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border">
              {businesses.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary font-sans">Workspace:</span>
                  <select
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    className="md-input text-xs py-1 px-2.5 bg-surface cursor-pointer"
                  >
                    <option value="">Default Business</option>
                    {businesses.map((b) => (
                      <option key={b.business_id} value={b.business_id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer font-sans select-none">
                <input
                  type="checkbox"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                  className="rounded text-brand focus:ring-brand"
                />
                <span>Save record to database</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="md-btn-pill md-btn-primary w-full gap-2 text-sm shadow-md-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Classifying NLP Tokens...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Feedback</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Output Results Card */}
        <div className="lg:col-span-5 md-card p-6 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <h3 className="font-bold text-text-primary text-sm font-display">Inference Output</h3>
              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-pos">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved to DB</span>
                </span>
              )}
            </div>

            {!result ? (
              <div className="py-16 text-center text-text-tertiary space-y-2 font-sans">
                <Sparkles className="w-8 h-8 text-brand mx-auto opacity-50" />
                <p className="text-xs">Enter text or select a preset to view classified probabilities and complaint themes.</p>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in">
                
                {/* Sentiment Pill */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-variant border border-border">
                  <span className="text-xs text-text-secondary font-sans">Predicted Sentiment:</span>
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

                {/* Probability Distribution */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono font-semibold text-text-secondary uppercase tracking-wider block">
                    Class Probabilities (Roboto Mono)
                  </span>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-pos mb-0.5">
                        <span>Positive</span>
                        <span>{Math.round((result.sentiment?.positive_prob || 0) * 100)}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div className="bg-pos h-full rounded-full" style={{ width: `${(result.sentiment?.positive_prob || 0) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-neu mb-0.5">
                        <span>Neutral</span>
                        <span>{Math.round((result.sentiment?.neutral_prob || 0) * 100)}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div className="bg-neu h-full rounded-full" style={{ width: `${(result.sentiment?.neutral_prob || 0) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-neg mb-0.5">
                        <span>Negative</span>
                        <span>{Math.round((result.sentiment?.negative_prob || 0) * 100)}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div className="bg-neg h-full rounded-full" style={{ width: `${(result.sentiment?.negative_prob || 0) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complaint Topics */}
                <div className="pt-3 border-t border-border">
                  <span className="text-[11px] font-mono font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                    Extracted Complaint Root Causes
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {result.topics && result.topics.length > 0 ? (
                      result.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-neg-subtle text-neg border border-neg-border capitalize"
                        >
                          #{t.topic_name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-tertiary font-sans italic">
                        No complaint themes detected in this feedback.
                      </span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border text-[11px] font-mono text-text-tertiary flex items-center justify-between">
            <span>Latency: &lt;15ms</span>
            <span>TF-IDF + Logistic Regression</span>
          </div>

        </div>

      </div>

    </div>
  );
}
