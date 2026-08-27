/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--md-bg)',
        surface: {
          DEFAULT: 'var(--md-surface)',
          variant: 'var(--md-surface-variant)',
          elevated: 'var(--md-surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--md-border)',
          subtle: 'var(--md-border-subtle)',
        },
        'text-primary': 'var(--md-text-primary)',
        'text-secondary': 'var(--md-text-secondary)',
        'text-tertiary': 'var(--md-text-tertiary)',
        brand: {
          DEFAULT: 'var(--md-brand)',
          hover: 'var(--md-brand-hover)',
          subtle: 'var(--md-brand-subtle)',
          border: 'var(--md-brand-border)',
        },
        pos: {
          DEFAULT: 'var(--md-pos)',
          subtle: 'var(--md-pos-subtle)',
          border: 'var(--md-pos-border)',
        },
        neu: {
          DEFAULT: 'var(--md-neu)',
          subtle: 'var(--md-neu-subtle)',
          border: 'var(--md-neu-border)',
        },
        neg: {
          DEFAULT: 'var(--md-neg)',
          subtle: 'var(--md-neg-subtle)',
          border: 'var(--md-neg-border)',
        }
      },
      fontFamily: {
        sans: ['"Roboto Flex"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Roboto Flex"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'md-1': 'var(--md-shadow-sm)',
        'md-2': 'var(--md-shadow-md)',
        'md-3': 'var(--md-shadow-lg)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
