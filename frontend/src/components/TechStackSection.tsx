import React from 'react';

export const TechStackSection: React.FC = () => {
  const stack = [
    { name: "FastAPI", role: "Backend REST API", badge: "Python 3.10+" },
    { name: "Scikit-Learn", role: "TF-IDF & Logistic Regression", badge: "NLP Engine" },
    { name: "React 18 & Vite", role: "UI & State Management", badge: "TypeScript" },
    { name: "Material Design", role: "Color tokens & Typography", badge: "Roboto Flex" },
    { name: "Supabase & SQLite", role: "Dual relational storage", badge: "PostgreSQL" },
    { name: "Chart.js", role: "Time-series visualizations", badge: "Analytics" }
  ];

  return (
    <section id="tech-stack" className="py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
          <div>
            <span className="text-xs font-semibold text-brand uppercase tracking-wider font-display">
              Technical stack
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-1 font-display">
              Built on dependable open-source technologies
            </h3>
          </div>

          <span className="text-xs font-mono text-text-tertiary">
            Tested & benchmarked on Windows / Linux / macOS
          </span>
        </div>

        {/* Quiet Credibility Strip Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {stack.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-xl bg-surface border border-border flex flex-col justify-between hover:border-brand-border transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono font-semibold text-brand px-1.5 py-0.5 rounded bg-brand-subtle inline-block mb-2">
                  {item.badge}
                </span>
                <div className="font-bold text-sm text-text-primary font-display">
                  {item.name}
                </div>
              </div>
              <div className="text-[11px] text-text-secondary mt-1 font-sans">
                {item.role}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
