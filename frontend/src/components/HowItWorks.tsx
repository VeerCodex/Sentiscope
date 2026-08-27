import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      name: "Ingestion",
      title: "Ingest raw feedback",
      description: "Upload customer reviews via CSV or fetch live Google Places reviews. The system parses text, ratings, authors, and timestamps.",
      colorClass: "bg-[#4285F4] text-white",
      inputTag: "CSV / Places API",
      outputTag: "Raw Text Stream"
    },
    {
      number: "02",
      name: "Preprocessing",
      title: "Clean and tokenize text",
      description: "Expands contractions (won't -> will not), strips HTML/URLs, and preserves critical sentiment negations (not good, never arrived).",
      colorClass: "bg-[#EA4335] text-white",
      inputTag: "Raw Text",
      outputTag: "Normalized Tokens"
    },
    {
      number: "03",
      name: "Dual ML Inference",
      title: "Classify sentiment & topics",
      description: "TF-IDF vectors are scored by a balanced Logistic Regression model for 3-class sentiment, while regex keyword engines extract complaint themes.",
      colorClass: "bg-[#FBBC05] text-[#202124]",
      inputTag: "TF-IDF Vectors",
      outputTag: "Labels + Topics"
    },
    {
      number: "04",
      name: "Executive Action",
      title: "Display live intelligence",
      description: "Persists records to Supabase or SQLite and visualizes Net Sentiment Scores, trend timelines, and complaint frequencies on the dashboard.",
      colorClass: "bg-[#34A853] text-white",
      inputTag: "Classified DB Records",
      outputTag: "Live Dashboard"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-14 space-y-3">
          <span className="text-xs font-semibold text-brand tracking-wider uppercase font-display">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            A 4-step pipeline from review to resolution
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            Every review follows a deterministic sequence through data cleaning, machine learning inference, and database persistence.
          </p>
        </div>

        {/* 4 Step Numbered Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.number}
              className="md-card p-6 flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${s.colorClass}`}>
                    {s.number}
                  </span>
                  <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider">
                    {s.name}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-base font-bold text-text-primary mb-2 font-display">
                  {s.title}
                </h3>

                {/* Plain Description */}
                <p className="text-xs text-text-secondary leading-relaxed font-sans mb-4">
                  {s.description}
                </p>
              </div>

              {/* Data Flow Tags in Roboto Mono */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span>In: <strong className="text-text-secondary font-medium">{s.inputTag}</strong></span>
                <span>Out: <strong className="text-brand font-medium">{s.outputTag}</strong></span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
