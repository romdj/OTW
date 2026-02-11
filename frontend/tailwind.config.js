module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '600' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', fontWeight: '600' }],
        'headline': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'section': ['0.8125rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      colors: {
        tier: {
          must: '#F59E0B',
          worth: '#3B82F6',
          highlights: '#8B5CF6',
          skip: '#94A3B8',
        },
      },
      // Subtle shadows for a lighter feel
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        'lifted': '0 8px 24px -8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3B82F6",           // Softer blue
          "primary-content": "#FFFFFF",
          "secondary": "#8B5CF6",          // Soft purple
          "secondary-content": "#FFFFFF",
          "accent": "#06B6D4",             // Cyan
          "accent-content": "#FFFFFF",
          "neutral": "#64748B",            // Slate
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",           // Very light slate
          "base-300": "#F1F5F9",           // Light slate
          "base-content": "#334155",       // Slate 700 - softer than black
          "info": "#3B82F6",
          "success": "#22C55E",
          "warning": "#F59E0B",
          "error": "#EF4444",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.15s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.99",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        dark: {
          "primary": "#60A5FA",            // Lighter blue for dark mode
          "primary-content": "#1E293B",
          "secondary": "#A78BFA",           // Lighter purple
          "secondary-content": "#1E293B",
          "accent": "#22D3EE",
          "accent-content": "#1E293B",
          "neutral": "#94A3B8",
          "neutral-content": "#1E293B",
          "base-100": "#0F172A",            // Slate 900
          "base-200": "#1E293B",            // Slate 800
          "base-300": "#334155",            // Slate 700
          "base-content": "#E2E8F0",        // Slate 200
          "info": "#60A5FA",
          "success": "#4ADE80",
          "warning": "#FBBF24",
          "error": "#F87171",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.15s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.99",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        }
      }
    ],
    base: true,
    styled: true,
    utils: true,
  },
}
