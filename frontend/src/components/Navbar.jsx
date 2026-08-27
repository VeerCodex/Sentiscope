import React, { useState } from 'react';
import { 
  BarChart3, 
  UploadCloud, 
  Sparkles, 
  MapPin, 
  TableProperties, 
  Building2, 
  Plus, 
  RefreshCw,
  Home,
  Sun,
  Moon,
  Command
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  businesses, 
  selectedBusiness, 
  setSelectedBusiness, 
  onRefresh,
  onOpenNewBusinessModal,
  onSeedDemo,
  isSeeding,
  onGoHome,
  onOpenCommandPalette
}) {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analyzer', label: 'NLP Sandbox', icon: Sparkles },
    { id: 'upload', label: 'Upload CSV', icon: UploadCloud },
    { id: 'google', label: 'Google Reviews', icon: MapPin },
    { id: 'feedback', label: 'Feedback Log', icon: TableProperties },
  ];

  const currentBusinessName = selectedBusiness 
    ? businesses.find(b => b.business_id === selectedBusiness)?.name || 'All Businesses'
    : 'All Businesses (Combined)';

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg p-1"
              title="Return to Landing Page"
            >
              <div className="grid grid-cols-2 gap-1 w-5 h-5">
                <span className="rounded-full bg-[#4285F4]" />
                <span className="rounded-full bg-[#EA4335]" />
                <span className="rounded-full bg-[#34A853]" />
                <span className="rounded-full bg-[#FBBC05]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-text-primary font-display">
                    SentiScope
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-subtle text-brand border border-brand-border">
                    Workspace
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Right Action Tools: Command Palette, Home, Theme Toggle, Business Switcher */}
          <div className="flex items-center gap-2">
            
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

            {/* Back to Landing Link */}
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant hover:bg-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors border border-border"
            >
              <Home className="w-3.5 h-3.5 text-brand" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary border border-border transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-text-primary" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>

            {/* Business Selector Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant hover:bg-border text-xs font-medium text-text-primary border border-border transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand" />
                  <span className="max-w-[130px] truncate">{currentBusinessName}</span>
                  <span className="text-[9px] text-text-tertiary">▼</span>
                </button>

                <button
                  onClick={onRefresh}
                  title="Refresh Analytics"
                  className="p-2 rounded-full bg-surface-variant hover:bg-border text-text-secondary hover:text-text-primary border border-border transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onSeedDemo}
                  disabled={isSeeding}
                  title="Seed Sample Demo Data"
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-subtle text-brand border border-brand-border hover:bg-brand/20 text-xs font-medium transition-colors"
                >
                  <span>{isSeeding ? 'Seeding...' : 'Demo Data'}</span>
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border shadow-md-2 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1 text-[10px] font-mono font-semibold text-text-tertiary uppercase tracking-wider">
                    Select Workspace
                  </div>
                  
                  <button
                    onClick={() => { setSelectedBusiness(null); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-surface-variant ${selectedBusiness === null ? 'text-brand font-bold bg-brand-subtle' : 'text-text-primary'}`}
                  >
                    <span>All Businesses (Combined)</span>
                    {selectedBusiness === null && <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>}
                  </button>

                  <div className="h-px bg-border my-1" />

                  {businesses.map((b) => (
                    <button
                      key={b.business_id}
                      onClick={() => { setSelectedBusiness(b.business_id); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-surface-variant ${selectedBusiness === b.business_id ? 'text-brand font-bold bg-brand-subtle' : 'text-text-primary'}`}
                    >
                      <div>
                        <div className="font-medium">{b.name}</div>
                        <div className="text-[10px] text-text-tertiary">{b.category || 'General'}</div>
                      </div>
                      {selectedBusiness === b.business_id && <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>}
                    </button>
                  ))}

                  <div className="h-px bg-border my-1" />

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenNewBusinessModal(); }}
                    className="w-full text-left px-4 py-2 text-xs text-brand font-semibold hover:bg-surface-variant flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Business</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Workspace Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
