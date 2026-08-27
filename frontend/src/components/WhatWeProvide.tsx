import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface WhatWeProvideProps {
  onLaunchDashboard: () => void;
}

export const WhatWeProvide: React.FC<WhatWeProvideProps> = ({ onLaunchDashboard }) => {
  const features = [
    {
      id: 'sentiment',
      tag: 'Classification',
      title: 'Tri-class sentiment detection',
      copy: 'Sorts every customer comment into positive, neutral, or negative with calibrated probability scores.',
      sentimentPill: { text: '98.1% pos', type: 'pos' }
    },
    {
      id: 'topics',
      tag: 'Root Causes',
      title: 'Automated complaint extraction',
      copy: 'Extracts recurring operational themes — delivery, pricing, quality, service, packaging, and usability.',
      sentimentPill: { text: '94.2% neg', type: 'neg' }
    },
    {
      id: 'ingestion',
      tag: 'Ingestion',
      title: 'Multi-channel feedback ingestion',
      copy: 'Upload CSV survey files or connect Google Places and review APIs with automatic column detection.',
      sentimentPill: { text: 'auto-map', type: 'brand' }
    },
    {
      id: 'analytics',
      tag: 'Metrics',
      title: 'Live Net Sentiment Score (NSS)',
      copy: 'Track aggregate customer satisfaction from -100 to +100 and observe historical trend lines over time.',
      sentimentPill: { text: '+42.0 NSS', type: 'neu' }
    },
    {
      id: 'workspaces',
      tag: 'Multi-Tenant',
      title: 'Per-business workspaces',
      copy: 'Separate analytics by branch, store location, or product catalog with isolated review repositories.',
      sentimentPill: { text: 'isolated', type: 'brand' }
    },
    {
      id: 'database',
      tag: 'Persistence',
      title: 'Supabase & SQLite dual database',
      copy: 'Runs immediately with built-in SQLite or syncs to managed PostgreSQL on Supabase via simple environment keys.',
      sentimentPill: { text: 'SQL sync', type: 'pos' }
    }
  ];

  const getPillStyle = (type: string) => {
    switch (type) {
      case 'pos':
        return 'bg-pos-subtle text-pos border-pos-border';
      case 'neg':
        return 'bg-neg-subtle text-neg border-neg-border';
      case 'neu':
        return 'bg-neu-subtle text-neu border-neu-border';
      default:
        return 'bg-brand-subtle text-brand border-brand-border';
    }
  };

  return (
    <section id="what-we-provide" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-14 space-y-3">
          <span className="text-xs font-semibold text-brand tracking-wider uppercase font-display">
            What we provide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            Turn messy reviews into structured decisions
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            A focused toolset built to ingest, classify, and isolate customer issues in seconds.
          </p>
        </div>

        {/* Clean Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="md-card p-6 flex flex-col justify-between group hover:border-brand-border"
            >
              <div>
                {/* Header with Miniature Sentiment Transform Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-tertiary">
                    {item.tag}
                  </span>
                  
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${getPillStyle(item.sentimentPill.type)}`}>
                    {item.sentimentPill.text}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-text-primary mb-2 font-display">
                  {item.title}
                </h3>

                {/* One Clear Line of Copy */}
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  {item.copy}
                </p>
              </div>

              {/* Miniature Colored Tick Mark */}
              <div className="mt-5 pt-4 border-t border-border flex items-center gap-1.5 text-xs text-text-tertiary">
                <Check className="w-3.5 h-3.5 text-pos" />
                <span className="font-sans">Production ready</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Link to Workspace */}
        <div className="mt-10 text-left">
          <button
            onClick={onLaunchDashboard}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline font-sans"
          >
            <span>Open live dashboard to inspect real datasets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
