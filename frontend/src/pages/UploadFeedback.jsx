import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Download,
  Database
} from 'lucide-react';
import { FeedbackService } from '../services/api';

export default function UploadFeedback({ businesses = [], selectedBusiness, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState('CSV');
  const [businessId, setBusinessId] = useState(selectedBusiness || (businesses[0]?.business_id || ''));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await FeedbackService.uploadCSV(file, businessId || undefined, source);
      setResult(data);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to process CSV file. Ensure it contains a 'review' or 'text' column header.");
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,customer_name,rating,source,review\n" +
      "Elena Rostova,1,Amazon,Package was 5 days late and customer support refused my refund request.\n" +
      "Marcus Vance,5,Google,Fantastic noise cancellation and battery lasts 35 hours. Super satisfied!\n" +
      "Sarah Jenkins,3,Survey,Product build is average. Delivery was on time.\n" +
      "David Miller,2,Flipkart,The plastic shell cracked on the second day of use. Poor build quality.\n" +
      "Sophia Chen,5,Amazon,Fast delivery and premium packaging. Exceeded my expectations!";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_customer_reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand">
          <UploadCloud className="w-4 h-4" />
          <span>Batch Data Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1 font-display">
          Batch CSV Review Ingestion
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-sans">
          Upload customer review datasets from Amazon, Flipkart, Google, or custom surveys for high-throughput sentiment classification and topic extraction.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="md-card p-6 sm:p-8 space-y-6">
        
        <form onSubmit={handleUpload} className="space-y-6">
          
          {/* Workspace & Channel options */}
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
                Source Channel Label:
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="md-input w-full text-xs bg-surface cursor-pointer"
              >
                <option value="CSV">Custom CSV Export</option>
                <option value="Amazon">Amazon Reviews</option>
                <option value="Google">Google Places</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Survey">Survey Data</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              isDragOver 
                ? 'border-brand bg-brand-subtle' 
                : 'border-border bg-surface-variant hover:border-brand-border'
            }`}
          >
            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="csv-file-input" className="cursor-pointer block space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-brand shadow-sm">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <span className="font-bold text-sm text-text-primary block font-display">
                  {file ? file.name : "Click to select a CSV file or drag and drop"}
                </span>
                <span className="text-xs text-text-secondary font-sans mt-1 block">
                  Supports comma-separated files (.csv) up to 25MB
                </span>
              </div>
            </label>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand transition-colors font-sans"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sample template CSV</span>
            </button>

            <button
              type="submit"
              disabled={loading || !file}
              className="md-btn-pill md-btn-primary gap-2 text-sm w-full sm:w-auto shadow-md-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing CSV Records...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Ingest & Classify Reviews</span>
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

        {/* Success Results Banner */}
        {result && (
          <div className="p-5 rounded-2xl bg-pos-subtle border border-pos-border text-text-primary space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-pos font-bold text-sm font-display">
              <CheckCircle className="w-4 h-4" />
              <span>Batch Ingestion Completed Successfully!</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-text-tertiary block text-[10px]">Total Processed</span>
                <span className="text-lg font-bold text-text-primary">{result.processed_count}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-pos block text-[10px]">Positive</span>
                <span className="text-lg font-bold text-pos">{result.sentiment_breakdown?.positive || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-neu block text-[10px]">Neutral</span>
                <span className="text-lg font-bold text-neu">{result.sentiment_breakdown?.neutral || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-neg block text-[10px]">Negative</span>
                <span className="text-lg font-bold text-neg">{result.sentiment_breakdown?.negative || 0}</span>
              </div>
            </div>

            <div className="text-xs text-text-secondary font-sans pt-1">
              All records have been classified and saved to your business database.
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
