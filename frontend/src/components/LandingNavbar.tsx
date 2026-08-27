import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingNavbarProps {
  onLaunchDashboard: () => void;
  onOpenSandbox: () => void;
  onOpenCommandPalette?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLaunchDashboard,
  onOpenSandbox,
  onOpenCommandPalette
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'What we provide', href: '#what-we-provide' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Live demo', href: '#playground' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Tech stack', href: '#tech-stack' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo with Google 4-color Sentiment Throughline */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-2xl bg-surface-variant border border-border flex items-center justify-center p-2 transition-transform hover:scale-105">
              <div className="grid grid-cols-2 gap-1.5 w-5 h-5">
                <span className="rounded-full bg-[#4285F4]" />
                <span className="rounded-full bg-[#EA4335]" />
                <span className="rounded-full bg-[#34A853]" />
                <span className="rounded-full bg-[#FBBC05]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-text-primary font-display">
                  SentiScope
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-subtle text-brand border border-brand-border font-medium">
                  Material M3
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-text-secondary font-display">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-brand focus:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1 py-0.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs, Command Palette Trigger & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            
            {/* Command Palette Trigger Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant hover:bg-border text-xs font-mono text-text-secondary hover:text-text-primary border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                title="Open Command Palette (Ctrl+K or Cmd+K)"
              >
                <Command className="w-3.5 h-3.5 text-brand" />
                <span>⌘K</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="p-2.5 rounded-full bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand border border-border"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* Pill CTA - Active Voice */}
            <button
              onClick={onLaunchDashboard}
              className="md-btn-pill md-btn-primary hidden sm:inline-flex gap-2 shadow-md-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span>Analyze feedback</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-surface-variant text-text-secondary hover:text-text-primary border border-border"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-sm font-medium text-text-secondary">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            {onOpenCommandPalette && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCommandPalette(); }}
                className="w-full md-btn-pill md-btn-secondary text-xs flex items-center justify-center gap-1.5"
              >
                <Command className="w-3.5 h-3.5 text-brand" />
                <span>Command Palette (⌘K)</span>
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenSandbox(); }}
              className="w-full md-btn-pill md-btn-secondary text-xs"
            >
              <span>Try NLP sandbox</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onLaunchDashboard(); }}
              className="w-full md-btn-pill md-btn-primary text-xs"
            >
              <span>Analyze feedback</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
