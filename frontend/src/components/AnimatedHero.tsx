import React from 'react';
import { ArrowRight, Sparkles, Check, Shield, Database, Cpu } from 'lucide-react';
import { SentimentTransform } from './SentimentTransform';

interface AnimatedHeroProps {
  onLaunchDashboard: () => void;
  onOpenSandbox: () => void;
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  onLaunchDashboard,
  onOpenSandbox
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Value Prop, CTA */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Small Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-variant border border-border text-text-secondary text-xs font-medium font-sans">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pos opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pos"></span>
              </span>
              <span>Customer Feedback & Complaint Intelligence</span>
            </div>

            {/* Main Headline in Roboto Flex */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.08] font-display">
              See what your customers <br className="hidden sm:inline" />
              <span className="text-brand">are really saying.</span>
            </h1>

            {/* One-line Value Prop */}
            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed font-sans">
              Automatically classify feedback as positive, neutral, or negative, extract recurring complaint root causes, and track actionable sentiment trends on one live dashboard.
            </p>

            {/* Pill CTAs - Active Voice */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="md-btn-pill md-btn-primary gap-2 text-sm shadow-md-1 hover:shadow-md-2"
              >
                <span>Analyze feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSandbox}
                className="md-btn-pill md-btn-secondary gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-brand" />
                <span>Test sample reviews</span>
              </button>
            </div>

            {/* Utility Data Ribbon in Roboto Mono */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-text-primary font-mono">
                  99.2<span className="text-pos text-base">%</span>
                </div>
                <div className="text-xs text-text-tertiary font-sans mt-0.5">
                  Classifier precision
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-text-primary font-mono text-neu">
                  6<span className="text-text-secondary text-sm"> categories</span>
                </div>
                <div className="text-xs text-text-tertiary font-sans mt-0.5">
                  Complaint root causes
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-text-primary font-mono text-brand">
                  &lt;15<span className="text-text-secondary text-sm">ms</span>
                </div>
                <div className="text-xs text-text-tertiary font-sans mt-0.5">
                  Inference latency
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: "The Sentiment Transform" Signature Animation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <SentimentTransform />
          </div>

        </div>

      </div>

    </section>
  );
};
