import React, { useState, useEffect } from 'react';
import { LandingNavbar } from '../components/LandingNavbar';
import { AnimatedHero } from '../components/AnimatedHero';
import { WhatWeProvide } from '../components/WhatWeProvide';
import { HowItWorks } from '../components/HowItWorks';
import { LandingPlayground } from '../components/LandingPlayground';
import { ComparisonSection } from '../components/ComparisonSection';
import { TechStackSection } from '../components/TechStackSection';
import { FaqSection } from '../components/FaqSection';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenSandbox: () => void;
  onOpenCommandPalette?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenSandbox,
  onOpenCommandPalette
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-200">
      
      {/* Material Sticky Navigation with Command Palette trigger */}
      <LandingNavbar
        onLaunchDashboard={onLaunchDashboard}
        onOpenSandbox={onOpenSandbox}
        onOpenCommandPalette={onOpenCommandPalette}
      />

      {/* Main Content Flow */}
      <main className="flex-grow">
        
        {/* Hero Section with Asymmetric Sentiment Transform */}
        <AnimatedHero
          onLaunchDashboard={onLaunchDashboard}
          onOpenSandbox={onOpenSandbox}
        />

        {/* Feature Cards with Mini Sentiment Pills */}
        <WhatWeProvide
          onLaunchDashboard={onLaunchDashboard}
        />

        {/* 4-Step Pipeline */}
        <HowItWorks />

        {/* Live Interactive Demo Playground */}
        <LandingPlayground />

        {/* Comparison Matrix */}
        <ComparisonSection />

        {/* Technical Stack Credibility Strip */}
        <TechStackSection />

        {/* Plain-Spoken FAQ Accordion */}
        <FaqSection />

        {/* Clean Material Bottom CTA */}
        <section className="py-20 bg-surface border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle text-brand text-xs font-mono font-medium border border-brand-border">
              <span>Ready to test your feedback</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight font-display">
              See your customer sentiment in seconds
            </h2>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
              Open the live analytics dashboard or upload a sample CSV to explore real-time classification and complaint extraction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="md-btn-pill md-btn-primary gap-2 shadow-md-1 hover:shadow-md-2"
              >
                <span>Analyze feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSandbox}
                className="md-btn-pill md-btn-secondary"
              >
                <span>Open NLP sandbox</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Clean Google-Style Footer */}
      <footer className="border-t border-border bg-background py-10 text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1 w-4 h-4">
              <span className="rounded-full bg-[#4285F4]" />
              <span className="rounded-full bg-[#EA4335]" />
              <span className="rounded-full bg-[#34A853]" />
              <span className="rounded-full bg-[#FBBC05]" />
            </div>
            <div>
              <span className="font-bold text-text-primary font-display text-sm">SentiScope</span>
              <p className="text-[11px] text-text-tertiary">Customer Sentiment & Complaint Intelligence</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary font-sans">
            <a href="#what-we-provide" className="hover:text-brand transition-colors">What we provide</a>
            <a href="#how-it-works" className="hover:text-brand transition-colors">How it works</a>
            <a href="#playground" className="hover:text-brand transition-colors">Live demo</a>
            <a href="#comparison" className="hover:text-brand transition-colors">Comparison</a>
            <a href="#tech-stack" className="hover:text-brand transition-colors">Tech stack</a>
            <a href="#faq" className="hover:text-brand transition-colors">FAQ</a>
          </div>

          <div className="text-center md:text-right text-[11px] text-text-tertiary font-mono">
            <span>B.Tech Mini Project</span> • <span>Material Design System</span>
          </div>

        </div>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-surface-variant hover:bg-border border border-border text-text-primary shadow-md-2 transition-all duration-200 z-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
