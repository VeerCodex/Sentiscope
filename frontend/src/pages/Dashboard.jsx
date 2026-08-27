import React, { useState } from 'react';
import MetricCards from '../components/MetricCards';
import SentimentChart from '../components/SentimentChart';
import TopicBreakdown from '../components/TopicBreakdown';
import FeedbackTable from '../components/FeedbackTable';
import { DashboardSkeleton } from '../components/SkeletonLoaders';
import { exportExecutiveSummaryPdf } from '../services/pdfExport';
import { Sparkles, ArrowRight, UploadCloud, FileDown, CheckCircle2 } from 'lucide-react';

export default function Dashboard({
  summary,
  feedbackList,
  onDeleteFeedback,
  onNavigateTab,
  onFilterChange,
  filters,
  businessName,
  loading
}) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    if (!summary) return;
    setDownloadingPdf(true);
    try {
      exportExecutiveSummaryPdf(summary, businessName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF Export error:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading && !summary) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand">
            <span className="w-2 h-2 rounded-full bg-pos animate-pulse"></span>
            <span>Live Analytics Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1 font-display">
            Executive Sentiment Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
            Monitoring customer satisfaction, sentiment trajectories, and recurring complaints for <span className="text-text-primary font-semibold">{businessName}</span>
          </p>
        </div>

        {/* Action Buttons & PDF Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Executive PDF Export Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || !summary}
            className="md-btn-pill md-btn-secondary gap-2 text-xs border-brand/30 hover:border-brand text-brand hover:bg-brand-subtle transition-all"
            title="Generate and download branded executive PDF summary report"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-pos" />
                <span className="text-pos font-semibold">PDF Downloaded</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-brand" />
                <span>{downloadingPdf ? 'Generating PDF...' : 'Download Executive Summary (PDF)'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigateTab('analyzer')}
            className="md-btn-pill md-btn-secondary gap-2 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>NLP Sandbox</span>
          </button>

          <button
            onClick={() => onNavigateTab('upload')}
            className="md-btn-pill md-btn-primary gap-2 text-xs shadow-md-1"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Reviews</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Metric Cards */}
      <MetricCards summary={summary} />

      {/* 2. Charts: Sentiment Timeline & Share */}
      <SentimentChart summary={summary} />

      {/* 3. Complaint Themes & Root Causes */}
      <TopicBreakdown 
        summary={summary} 
        onTopicClick={(topic) => {
          onFilterChange({ ...filters, topic_name: topic });
          onNavigateTab('feedback');
        }}
      />

      {/* 4. Recent Feedback Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-text-primary text-lg font-display">Recent Customer Reviews</h3>
          <button
            onClick={() => onNavigateTab('feedback')}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline font-sans"
          >
            <span>View All Feedback</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <FeedbackTable
          feedbackList={feedbackList.slice(0, 10)}
          onDeleteFeedback={onDeleteFeedback}
          onFilterChange={onFilterChange}
          filters={filters}
        />
      </div>

    </div>
  );
}
