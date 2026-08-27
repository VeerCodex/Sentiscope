import React from 'react';

/**
 * Shimmer skeleton placeholder for the 5 Dashboard KPI metric cards
 */
export const MetricCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="md-card p-5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 md-skeleton" />
            <div className="w-8 h-8 rounded-xl md-skeleton" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="h-8 w-20 md-skeleton" />
            <div className="h-3 w-12 md-skeleton" />
          </div>
          <div className="mt-3 w-full h-2 rounded-full md-skeleton" />
        </div>
      ))}
    </div>
  );
};

/**
 * Shimmer skeleton placeholder for Sentiment Trend Line & Donut charts
 */
export const SentimentChartSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trend Timeline Skeleton */}
      <div className="lg:col-span-2 md-card p-6 flex flex-col justify-between h-96">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-5 w-48 md-skeleton" />
            <div className="h-3 w-72 md-skeleton" />
          </div>
          <div className="h-6 w-24 rounded-full md-skeleton" />
        </div>

        {/* Mock Area/Line wave placeholders */}
        <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 px-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full md-skeleton rounded-t-lg"
              style={{ height: `${25 + ((i * 17) % 65)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Donut Chart Skeleton */}
      <div className="md-card p-6 flex flex-col justify-between h-96">
        <div className="space-y-2 mb-4">
          <div className="h-5 w-36 md-skeleton" />
          <div className="h-3 w-48 md-skeleton" />
        </div>

        {/* Circular Donut Skeleton */}
        <div className="relative h-60 w-full flex items-center justify-center">
          <div className="w-44 h-44 rounded-full md-skeleton flex items-center justify-center p-6">
            <div className="w-28 h-28 rounded-full bg-surface" />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <div className="h-3 w-16 md-skeleton rounded-full" />
          <div className="h-3 w-16 md-skeleton rounded-full" />
          <div className="h-3 w-16 md-skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmer skeleton placeholder for Topic & Complaint Themes
 */
export const TopicBreakdownSkeleton: React.FC = () => {
  return (
    <div className="md-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-56 md-skeleton" />
          <div className="h-3 w-80 md-skeleton" />
        </div>
        <div className="h-4 w-20 md-skeleton" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-surface-variant border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 md-skeleton" />
              <div className="h-5 w-14 rounded-full md-skeleton" />
            </div>
            <div className="h-3 w-32 md-skeleton" />
            <div className="w-full h-1.5 rounded-full md-skeleton mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Shimmer skeleton placeholder for Feedback Explorer Table
 */
export const FeedbackTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <div className="md-card p-6 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-48 md-skeleton" />
          <div className="h-3 w-64 md-skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-44 rounded-full md-skeleton" />
          <div className="h-8 w-28 rounded-full md-skeleton" />
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-surface-variant/70 border border-border flex items-center justify-between gap-4"
          >
            {/* Avatar circle + Name / Date */}
            <div className="flex items-center gap-3 w-1/4 min-w-[140px]">
              <div className="w-8 h-8 rounded-full md-skeleton flex-shrink-0" />
              <div className="space-y-1.5 flex-grow">
                <div className="h-3.5 w-24 md-skeleton" />
                <div className="h-2.5 w-16 md-skeleton" />
              </div>
            </div>

            {/* Review text preview */}
            <div className="w-1/2 space-y-1.5 hidden sm:block">
              <div className="h-3 w-full md-skeleton" />
              <div className="h-3 w-3/4 md-skeleton" />
            </div>

            {/* Sentiment Pill */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full md-skeleton" />
              <div className="h-5 w-16 rounded-md md-skeleton hidden md:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Full Dashboard Skeleton placeholder
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top title banner skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-32 md-skeleton" />
          <div className="h-7 w-64 md-skeleton" />
          <div className="h-3 w-96 md-skeleton" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-9 w-28 rounded-full md-skeleton" />
          <div className="h-9 w-32 rounded-full md-skeleton" />
        </div>
      </div>

      <MetricCardsSkeleton />
      <SentimentChartSkeleton />
      <TopicBreakdownSkeleton />
      <FeedbackTableSkeleton rows={5} />
    </div>
  );
};
