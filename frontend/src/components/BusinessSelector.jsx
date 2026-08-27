import React, { useState } from 'react';
import { X, Building2, Plus, Loader2 } from 'lucide-react';

export default function BusinessSelector({ isOpen, onClose, onCreateBusiness }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('E-commerce');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreateBusiness({
        name: name.trim(),
        category,
        description: description.trim() || undefined
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      
      <div className="md-card w-full max-w-md p-6 bg-surface space-y-5 shadow-md-3 relative border border-border">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-base font-display">Add Business Workspace</h3>
              <p className="text-[11px] text-text-secondary font-sans">Create a dedicated feedback partition</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
              Business / Product Name: *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Apparel Store"
              className="md-input w-full text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
              Industry Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="md-input w-full text-xs bg-surface cursor-pointer"
            >
              <option value="E-commerce">E-commerce / Retail</option>
              <option value="Hospitality">Restaurant / Hospitality</option>
              <option value="Logistics">Logistics / Courier</option>
              <option value="Software">SaaS / Software</option>
              <option value="Electronics">Electronics & Hardware</option>
              <option value="Healthcare">Healthcare & Wellness</option>
              <option value="Other">Other Category</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 font-sans">
              Brief Description (Optional):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Online clothing brand catering to North America..."
              className="md-input w-full text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="md-btn-pill md-btn-secondary text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="md-btn-pill md-btn-primary gap-1.5 text-xs shadow-md-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
