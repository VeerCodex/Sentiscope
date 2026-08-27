import React, { useState } from 'react';
import { MapPin, Search, Star, Loader2, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { FeedbackService } from '../services/api';

const PRESET_PLACES = [
  { name: "TechGear Flagship Store, NY", query: "TechGear Electronics Store New York" },
  { name: "Spice & Herb Bistro, Downtown", query: "Spice and Herb Bistro Restaurant" },
  { name: "SwiftDrop Courier Hub, Chicago", query: "SwiftDrop Courier Logistics Chicago" }
];

export default function LiveReviews({ businesses = [], selectedBusiness, onReviewsImported }) {
  const [placeQuery, setPlaceQuery] = useState(PRESET_PLACES[0].query);
  const [businessId, setBusinessId] = useState(selectedBusiness || (businesses[0]?.business_id || ''));
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchReviews = async (e) => {
    if (e) e.preventDefault();
    if (!placeQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await FeedbackService.fetchGoogleReviews({
        place_query: placeQuery.trim(),
        business_id: businessId || undefined,
        count: parseInt(count)
      });
      setResult(data);
      if (onReviewsImported) onReviewsImported();
    } catch (err) {
      console.error("Live reviews fetch error:", err);
      setError("Failed to fetch live reviews. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand">
          <MapPin className="w-4 h-4" />
          <span>External API Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1 font-display">
          Google Places Live Reviews
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
          Fetch, parse, and analyze real customer reviews directly from Google Places / Google Maps for your business listings.
        </p>
      </div>

      {/* Preset Queries */}
      <div>
        <span className="text-xs font-mono text-text-tertiary block mb-2 font-medium">Quick Place Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_PLACES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPlaceQuery(p.query);
                setResult(null);
              }}
              className="px-3 py-1.5 rounded-full text-xs bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary border border-border transition-colors font-sans"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Card */}
      <div className="md-card p-6 sm:p-8 space-y-6">
        
        <form onSubmit={handleFetchReviews} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 font-sans">
              Google Maps Place / Business Search Query: *
            </label>
            <div className="relative">
              <input
                type="text"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder="e.g. Starbucks Times Square New York"
                className="md-input w-full pl-9 text-sm"
                required
              />
              <MapPin className="w-4 h-4 text-brand absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 font-sans">
                Target Business Workspace:
              </label>
              <select
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="md-input w-full text-xs bg-surface cursor-pointer"
              >
                <option value="">Default Business</option>
                {businesses.map((b) => (
                  <option key={b.business_id} value={b.business_id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 font-sans">
                Number of Reviews to Ingest:
              </label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="md-input w-full text-xs bg-surface cursor-pointer"
              >
                <option value={3}>3 Recent Reviews</option>
                <option value={5}>5 Recent Reviews</option>
                <option value={10}>10 Recent Reviews</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !placeQuery.trim()}
              className="md-btn-pill md-btn-primary gap-2 text-sm shadow-md-1 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Google Reviews...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch & Classify Live Reviews</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-neg-subtle border border-neg-border text-neg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Output */}
        {result && (
          <div className="space-y-4 animate-in fade-in pt-4 border-t border-border">
            
            <div className="p-4 rounded-2xl bg-pos-subtle border border-pos-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-pos font-bold text-sm font-display">
                <CheckCircle className="w-4 h-4" />
                <span>Ingested {result.reviews?.length || 0} Reviews from {result.place_name || placeQuery}</span>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-surface text-text-primary border border-border">
                Rating: {result.overall_rating || '4.5'}★
              </span>
            </div>

            {/* Ingested Review Cards */}
            <div className="space-y-3">
              {result.reviews?.map((r, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-variant border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-primary font-sans">{r.author_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neu font-mono font-semibold">{r.rating}★</span>
                      <span className="text-text-tertiary font-mono text-[11px]">{r.relative_time_description || 'Recently'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
