import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BarChart3, 
  Sparkles, 
  UploadCloud, 
  MapPin, 
  TableProperties, 
  Home, 
  FileDown, 
  Sun, 
  Moon, 
  RefreshCw, 
  Plus, 
  Layers,
  CornerDownLeft,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  onGoHome: () => void;
  onDownloadPdf: () => void;
  onRefreshData: () => void;
  onSeedDemo: () => void;
  onOpenNewBusinessModal: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigate' | 'Actions' | 'Theme';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onGoHome,
  onDownloadPdf,
  onRefreshData,
  onSeedDemo,
  onOpenNewBusinessModal
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define commands
  const commands: CommandItem[] = [
    // 1. Navigation
    {
      id: 'nav-dashboard',
      category: 'Navigate',
      title: 'Go to Executive Dashboard',
      subtitle: 'KPIs, trend timelines, and complaint distribution',
      icon: BarChart3,
      keywords: ['dashboard', 'kpi', 'metrics', 'trends', 'overview'],
      action: () => { onNavigateTab('dashboard'); onClose(); }
    },
    {
      id: 'nav-analyzer',
      category: 'Navigate',
      title: 'Open Real-Time NLP Sandbox',
      subtitle: 'Test arbitrary feedback with instant sentiment classification',
      icon: Sparkles,
      keywords: ['sandbox', 'analyzer', 'ml', 'realtime', 'test', 'sentiment'],
      action: () => { onNavigateTab('analyzer'); onClose(); }
    },
    {
      id: 'nav-upload',
      category: 'Navigate',
      title: 'Upload CSV Customer Feedback',
      subtitle: 'Batch ingest customer reviews from CSV files',
      icon: UploadCloud,
      keywords: ['upload', 'csv', 'batch', 'dataset', 'import'],
      action: () => { onNavigateTab('upload'); onClose(); }
    },
    {
      id: 'nav-google',
      category: 'Navigate',
      title: 'Fetch Google Places Live Reviews',
      subtitle: 'Ingest live customer ratings and reviews from Google Maps',
      icon: MapPin,
      keywords: ['google', 'places', 'maps', 'live', 'reviews'],
      action: () => { onNavigateTab('google'); onClose(); }
    },
    {
      id: 'nav-feedback',
      category: 'Navigate',
      title: 'Open Feedback Explorer Log',
      subtitle: 'Search, filter, and export feedback records',
      icon: TableProperties,
      keywords: ['feedback', 'explorer', 'table', 'log', 'export', 'filter'],
      action: () => { onNavigateTab('feedback'); onClose(); }
    },
    {
      id: 'nav-home',
      category: 'Navigate',
      title: 'Return to Landing Page',
      subtitle: 'Explore the hero animation, pipeline, and features overview',
      icon: Home,
      keywords: ['home', 'landing', 'hero', 'overview', 'main'],
      action: () => { onGoHome(); onClose(); }
    },

    // 2. Actions
    {
      id: 'action-pdf',
      category: 'Actions',
      title: 'Download Executive Summary (PDF)',
      subtitle: 'Generate and download a branded executive PDF report',
      icon: FileDown,
      keywords: ['download', 'pdf', 'executive', 'summary', 'report', 'export'],
      action: () => { onDownloadPdf(); onClose(); }
    },
    {
      id: 'action-seed',
      category: 'Actions',
      title: 'Load Realistic Demo Datasets',
      subtitle: 'Populate businesses and sample reviews automatically',
      icon: Layers,
      keywords: ['demo', 'sample', 'seed', 'data', 'mock'],
      action: () => { onSeedDemo(); onClose(); }
    },
    {
      id: 'action-refresh',
      category: 'Actions',
      title: 'Refresh Analytics & Feedback Data',
      subtitle: 'Reload the latest records from the database',
      icon: RefreshCw,
      keywords: ['refresh', 'reload', 'fetch', 'sync', 'update'],
      action: () => { onRefreshData(); onClose(); }
    },
    {
      id: 'action-add-biz',
      category: 'Actions',
      title: 'Add New Business Workspace',
      subtitle: 'Create a new isolated business feedback workspace',
      icon: Plus,
      keywords: ['business', 'add', 'create', 'new', 'workspace', 'company'],
      action: () => { onOpenNewBusinessModal(); onClose(); }
    },

    // 3. Theme
    {
      id: 'theme-toggle',
      category: 'Theme',
      title: `Toggle Theme (${theme === 'light' ? 'Switch to Dark' : 'Switch to Light'})`,
      subtitle: 'Smoothly crossfade between Material light and dark color palettes',
      icon: theme === 'light' ? Moon : Sun,
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle', 'color'],
      action: () => { toggleTheme(); onClose(); }
    },
    {
      id: 'theme-light',
      category: 'Theme',
      title: 'Set Theme: Light Mode',
      subtitle: 'Clean white surfaces with soft elevation shadows',
      icon: Sun,
      keywords: ['light', 'white', 'day', 'theme'],
      action: () => { setTheme('light'); onClose(); }
    },
    {
      id: 'theme-dark',
      category: 'Theme',
      title: 'Set Theme: Dark Mode',
      subtitle: 'M3 dark surfaces with tonal borders and adjusted contrast',
      icon: Moon,
      keywords: ['dark', 'night', 'black', 'theme'],
      action: () => { setTheme('dark'); onClose(); }
    }
  ];

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = cmd.title.toLowerCase().includes(q);
    const subMatch = cmd.subtitle?.toLowerCase().includes(q);
    const catMatch = cmd.category.toLowerCase().includes(q);
    const keyMatch = cmd.keywords.some((k) => k.toLowerCase().includes(q));
    return titleMatch || subMatch || catMatch || keyMatch;
  });

  // Group filtered commands
  const groupedCategories: Array<'Navigate' | 'Actions' | 'Theme'> = ['Navigate', 'Actions', 'Theme'];

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl md-card bg-surface overflow-hidden shadow-md-3 border border-border animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-elevated">
          <Search className="w-4 h-4 text-brand flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-text-tertiary hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-variant text-text-tertiary border border-border flex-shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/50">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-text-tertiary font-sans text-xs">
              No matching commands found for "{query}".
            </div>
          ) : (
            groupedCategories.map((category) => {
              const items = filteredCommands.filter((c) => c.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="py-1.5 first:pt-0 last:pb-0">
                  <div className="px-3 py-1 text-[10px] font-mono font-semibold text-text-tertiary uppercase tracking-wider">
                    {category}
                  </div>

                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const itemGlobalIndex = filteredCommands.findIndex((c) => c.id === item.id);
                      const isSelected = itemGlobalIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(itemGlobalIndex)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors font-sans ${
                            isSelected
                              ? 'bg-brand text-white'
                              : 'text-text-primary hover:bg-surface-variant'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-surface-variant text-brand'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                                {item.title}
                              </div>
                              {item.subtitle && (
                                <div className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-text-secondary'}`}>
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-white/90 pl-2 flex-shrink-0">
                              <span>Select</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 border-t border-border bg-surface-variant/50 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>SentiScope Quick Actions</span>
        </div>

      </div>
    </div>
  );
};
