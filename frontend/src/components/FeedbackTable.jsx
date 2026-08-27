import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  Star, 
  Smile, 
  Meh, 
  Frown, 
  ShoppingBag,
  MapPin,
  FileText,
  Sparkles
} from 'lucide-react';

export default function FeedbackTable({ 
  feedbackList = [], 
  onDeleteFeedback, 
  onFilterChange,
  filters = {},
  totalCount = 0
}) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search });
  };

  const exportCSV = () => {
    if (feedbackList.length === 0) return;
    const headers = ['Feedback ID', 'Customer', 'Source', 'Rating', 'Sentiment', 'Confidence', 'Topics', 'Submitted At', 'Review Text'];
    const rows = feedbackList.map(f => [
      f.feedback_id,
      `"${(f.customer_name || 'Anonymous').replace(/"/g, '""')}"`,
      f.source,
      f.rating || '',
      f.sentiment?.sentiment_label || '',
      f.sentiment?.confidence_score || '',
      `"${f.topics?.map(t => t.topic_name).join(', ') || ''}"`,
      f.submitted_at || '',
      `"${(f.raw_text || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSentimentBadge = (sentiment) => {
    const label = sentiment?.sentiment_label?.toLowerCase() || 'neutral';
    const conf = Math.round((sentiment?.confidence_score || 1.0) * 100);

    if (label === 'positive') {
      return (
        <span className="sentiment-pill sentiment-pill-pos">
          <Smile className="w-3.5 h-3.5" />
          <span>Pos ({conf}%)</span>
        </span>
      );
    } else if (label === 'negative') {
      return (
        <span className="sentiment-pill sentiment-pill-neg">
          <Frown className="w-3.5 h-3.5" />
          <span>Neg ({conf}%)</span>
        </span>
      );
    } else {
      return (
        <span className="sentiment-pill sentiment-pill-neu">
          <Meh className="w-3.5 h-3.5" />
          <span>Neu ({conf}%)</span>
        </span>
      );
    }
  };

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'amazon':
      case 'flipkart':
        return <ShoppingBag className="w-3.5 h-3.5 text-neu" />;
      case 'google':
        return <MapPin className="w-3.5 h-3.5 text-brand" />;
      case 'csv':
        return <FileText className="w-3.5 h-3.5 text-pos" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-text-tertiary" />;
    }
  };

  return (
    <div className="md-card p-6">
      
      {/* Table Header & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-text-primary text-base font-display">Feedback Ingestion Log</h3>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">Inspect individual customer reviews, sentiment probabilities, and topic tags</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className="md-input text-xs py-1.5 pl-8 pr-3 w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-2.5" />
          </form>

          {/* Sentiment Filter */}
          <select
            value={filters.sentiment_label || ''}
            onChange={(e) => onFilterChange({ ...filters, sentiment_label: e.target.value || undefined })}
            className="md-input text-xs py-1.5 px-3 bg-surface cursor-pointer"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          {/* Topic Filter */}
          <select
            value={filters.topic_name || ''}
            onChange={(e) => onFilterChange({ ...filters, topic_name: e.target.value || undefined })}
            className="md-input text-xs py-1.5 px-3 bg-surface cursor-pointer"
          >
            <option value="">All Topics</option>
            <option value="delivery">Delivery</option>
            <option value="pricing">Pricing</option>
            <option value="quality">Quality</option>
            <option value="service">Service</option>
            <option value="packaging">Packaging</option>
            <option value="usability">Usability</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant hover:bg-border text-text-primary text-xs font-medium border border-border transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-variant text-text-secondary font-bold uppercase tracking-wider text-[10px] font-sans">
              <th className="py-3 px-4">Author & Source</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Customer Review</th>
              <th className="py-3 px-4">Sentiment</th>
              <th className="py-3 px-4">Complaint Themes</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {feedbackList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-text-tertiary font-sans">
                  No feedback found matching the selected filters.
                </td>
              </tr>
            ) : (
              feedbackList.map((item) => (
                <tr key={item.feedback_id} className="hover:bg-surface-variant transition-colors">
                  
                  {/* Author & Source */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-text-primary font-sans">{item.customer_name || 'Anonymous'}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary mt-0.5 font-sans">
                      {getSourceIcon(item.source)}
                      <span className="capitalize">{item.source || 'Manual'}</span>
                      {item.submitted_at && (
                        <span>• {item.submitted_at.slice(0, 10)}</span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.rating ? (
                      <div className="flex items-center text-neu">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < item.rating ? 'fill-current text-neu' : 'text-border'}`} 
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-text-tertiary font-mono">—</span>
                    )}
                  </td>

                  {/* Review Text */}
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-text-secondary line-clamp-2 leading-relaxed font-sans">
                      {item.raw_text}
                    </p>
                  </td>

                  {/* Sentiment Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getSentimentBadge(item.sentiment)}
                  </td>

                  {/* Topics */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.topics && item.topics.length > 0 ? (
                        item.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-surface-variant text-text-secondary border border-border capitalize"
                          >
                            #{t.topic_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-text-tertiary font-mono text-[11px]">—</span>
                      )}
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDeleteFeedback(item.feedback_id)}
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-neg hover:bg-neg-subtle transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
