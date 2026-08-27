import React from 'react';
import FeedbackTable from '../components/FeedbackTable';
import { TableProperties, RefreshCw } from 'lucide-react';

export default function FeedbackList({
  feedbackList,
  onDeleteFeedback,
  onFilterChange,
  filters,
  onRefresh,
  businessName
}) {
  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand">
            <TableProperties className="w-4 h-4" />
            <span>Database Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1 font-display">
            Feedback Explorer & Query Log
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Search, filter, and export feedback records with classified sentiment labels and topic tags for <span className="text-text-primary font-semibold">{businessName}</span>.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="md-btn-pill md-btn-secondary gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Table */}
      <FeedbackTable
        feedbackList={feedbackList}
        onDeleteFeedback={onDeleteFeedback}
        onFilterChange={onFilterChange}
        filters={filters}
        totalCount={feedbackList.length}
      />

    </div>
  );
}
