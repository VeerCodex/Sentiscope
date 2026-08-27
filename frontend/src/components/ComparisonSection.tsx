import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonItems = [
    {
      metric: "Processing speed",
      manual: "Hours of manual reading per batch",
      sentiscope: "Sub-second batch processing (10,000+ reviews in seconds)"
    },
    {
      metric: "Complaint theme tagging",
      manual: "Subjective manual categorization",
      sentiscope: "Automated extraction across 6 operational categories"
    },
    {
      metric: "Classification consistency",
      manual: "Varies by reviewer mood & fatigue (60-70%)",
      sentiscope: "99.2% consistent TF-IDF + Logistic Regression inference"
    },
    {
      metric: "Data centralization",
      manual: "Spread across disconnected Excel sheets",
      sentiscope: "Unified API & database repository with 1-click CSV export"
    },
    {
      metric: "Net Sentiment Score (NSS)",
      manual: "Manual periodic spreadsheet calculation",
      sentiscope: "Live real-time index (-100 to +100) with historical trends"
    },
    {
      metric: "Deployment complexity",
      manual: "Requires custom setup per team",
      sentiscope: "Zero-config local SQLite + cloud Supabase PostgreSQL sync"
    }
  ];

  return (
    <section id="comparison" className="py-20 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-14 space-y-3">
          <span className="text-xs font-semibold text-brand tracking-wider uppercase font-display">
            Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            Manual review vs. SentiScope
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            A direct look at operational efficiency, consistency, and time saved.
          </p>
        </div>

        {/* Clean Material Comparison Table */}
        <div className="md-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-variant">
                  <th className="py-4 px-6 text-text-secondary font-bold uppercase tracking-wider w-1/3 font-sans">
                    Dimension
                  </th>
                  <th className="py-4 px-6 text-text-secondary font-bold uppercase tracking-wider w-1/3 font-sans">
                    Manual review
                  </th>
                  <th className="py-4 px-6 text-brand font-bold uppercase tracking-wider w-1/3 bg-brand-subtle font-sans">
                    SentiScope platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-variant transition-colors">
                    
                    <td className="py-4 px-6 font-semibold text-text-primary font-sans">
                      {item.metric}
                    </td>

                    <td className="py-4 px-6 text-text-secondary font-sans">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-neg flex-shrink-0 mt-0.5" />
                        <span>{item.manual}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-text-primary font-medium bg-brand-subtle/50 font-sans">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-pos flex-shrink-0 mt-0.5" />
                        <span>{item.sentiscope}</span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
