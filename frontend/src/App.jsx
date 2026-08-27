import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BusinessSelector from './components/BusinessSelector';
import Dashboard from './pages/Dashboard';
import RealTimeAnalyzer from './pages/RealTimeAnalyzer';
import UploadFeedback from './pages/UploadFeedback';
import LiveReviews from './pages/LiveReviews';
import FeedbackList from './pages/FeedbackList';
import { LandingPage } from './pages/LandingPage';
import { CommandPalette } from './components/CommandPalette';
import { DashboardSkeleton } from './components/SkeletonLoaders';
import { exportExecutiveSummaryPdf } from './services/pdfExport';
import { ThemeProvider } from './context/ThemeContext';
import { BusinessService, FeedbackService, AnalyticsService } from './services/api';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'workspace'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [summary, setSummary] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isNewBusinessModalOpen, setIsNewBusinessModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch analytics and feedback whenever selectedBusiness or filters change
  useEffect(() => {
    fetchData();
  }, [selectedBusiness, filters]);

  const fetchBusinesses = async () => {
    try {
      const data = await BusinessService.getBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error("Failed to load businesses:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, fbData] = await Promise.all([
        AnalyticsService.getSummary(selectedBusiness),
        FeedbackService.getFeedback({
          ...filters,
          business_id: selectedBusiness || undefined,
          limit: 100
        })
      ]);
      setSummary(sumData);
      setFeedbackList(fbData);
    } catch (err) {
      console.error("Error fetching analytics/feedback:", err);
      setError("Could not connect to FastAPI backend. Ensure the backend server is running on http://127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (bizData) => {
    try {
      const newBiz = await BusinessService.createBusiness(bizData);
      setBusinesses([...businesses, newBiz]);
      setSelectedBusiness(newBiz.business_id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await BusinessService.seedDemoData();
      await fetchBusinesses();
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await FeedbackService.deleteFeedback(feedbackId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const currentBusinessObj = businesses.find(b => b.business_id === selectedBusiness);
  const currentBusinessName = currentBusinessObj ? currentBusinessObj.name : 'All Businesses (Combined)';

  const handleDownloadPdf = () => {
    if (summary) {
      exportExecutiveSummaryPdf(summary, currentBusinessName);
    }
  };

  // If in Landing Page mode, render the Material Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchDashboard={() => {
            setViewMode('workspace');
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSandbox={() => {
            setViewMode('workspace');
            setActiveTab('analyzer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigateTab={(tab) => {
            setViewMode('workspace');
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoHome={() => {
            setViewMode('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDownloadPdf={handleDownloadPdf}
          onRefreshData={fetchData}
          onSeedDemo={handleSeedDemo}
          onOpenNewBusinessModal={() => setIsNewBusinessModalOpen(true)}
        />
      </>
    );
  }

  // Workspace Mode (Dashboard & Studio)
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-text-primary transition-colors duration-200">
      
      {/* Navigation Header */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
          onRefresh={fetchData}
          onOpenNewBusinessModal={() => setIsNewBusinessModalOpen(true)}
          onSeedDemo={handleSeedDemo}
          isSeeding={isSeeding}
          onGoHome={() => {
            setViewMode('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Backend Connection Error Alert */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 rounded-2xl bg-neg-subtle border border-neg-border text-neg text-xs flex items-center justify-between font-sans">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button 
                onClick={fetchData}
                className="px-3 py-1 rounded-full bg-neg/15 hover:bg-neg/25 font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && !summary ? (
            <DashboardSkeleton />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  summary={summary}
                  feedbackList={feedbackList}
                  onDeleteFeedback={handleDeleteFeedback}
                  onNavigateTab={setActiveTab}
                  onFilterChange={setFilters}
                  filters={filters}
                  businessName={currentBusinessName}
                  loading={loading}
                />
              )}

              {activeTab === 'analyzer' && (
                <RealTimeAnalyzer
                  businesses={businesses}
                  selectedBusiness={selectedBusiness}
                  onFeedbackAdded={fetchData}
                />
              )}

              {activeTab === 'upload' && (
                <UploadFeedback
                  businesses={businesses}
                  selectedBusiness={selectedBusiness}
                  onUploadSuccess={fetchData}
                />
              )}

              {activeTab === 'google' && (
                <LiveReviews
                  businesses={businesses}
                  selectedBusiness={selectedBusiness}
                  onReviewsImported={fetchData}
                />
              )}

              {activeTab === 'feedback' && (
                <FeedbackList
                  feedbackList={feedbackList}
                  onDeleteFeedback={handleDeleteFeedback}
                  onFilterChange={setFilters}
                  filters={filters}
                  onRefresh={fetchData}
                  businessName={currentBusinessName}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* New Business Modal */}
      <BusinessSelector
        isOpen={isNewBusinessModalOpen}
        onClose={() => setIsNewBusinessModalOpen(false)}
        onCreateBusiness={handleCreateBusiness}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setViewMode('workspace');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoHome={() => {
          setViewMode('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDownloadPdf={handleDownloadPdf}
        onRefreshData={fetchData}
        onSeedDemo={handleSeedDemo}
        onOpenNewBusinessModal={() => setIsNewBusinessModalOpen(true)}
      />

      {/* Clean Material Workspace Footer */}
      <footer className="border-t border-border bg-surface py-5 text-center text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5">
              <span className="rounded-full bg-[#4285F4]" />
              <span className="rounded-full bg-[#EA4335]" />
              <span className="rounded-full bg-[#34A853]" />
              <span className="rounded-full bg-[#FBBC05]" />
            </div>
            <span className="font-semibold text-text-primary font-display">SentiScope</span>
            <span>• Material M3 Interface</span>
          </div>
          <div>
            <button 
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-brand hover:underline mr-4 font-medium"
            >
              Return to Landing Page
            </button>
            <span className="font-mono text-[11px] text-text-tertiary">Press Ctrl+K / ⌘K for Command Palette</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
