module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      // Material Design inspired spacing (8px grid)
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
      },
      // Material Design border radius
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '28px',
      },
      // Material Design elevation shadows
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'elevation-2': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'elevation-3': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'elevation-4': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'elevation-5': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        'elevation-6': '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
      // Animation timing functions
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'decelerate': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'accelerate': 'cubic-bezier(0.4, 0.0, 1, 1)',
      },
      // Animation durations
      transitionDuration: {
        'short': '150ms',
        'medium': '250ms',
        'long': '400ms',
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        // Light theme - Material Design inspired
        light: {
          "primary": "#1976D2",          // Material Blue 700
          "primary-content": "#FFFFFF",
          "secondary": "#9C27B0",         // Material Purple 500
          "secondary-content": "#FFFFFF",
          "accent": "#00BCD4",            // Material Cyan 500
          "accent-content": "#FFFFFF",
          "neutral": "#37474F",           // Material Blue Grey 800
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",          // Surface
          "base-200": "#F5F5F5",          // Surface variant
          "base-300": "#EEEEEE",          // Surface container
          "base-content": "#212121",      // On surface
          "info": "#2196F3",
          "success": "#4CAF50",
          "warning": "#FF9800",
          "error": "#F44336",
          "--rounded-box": "12px",
          "--rounded-btn": "8px",
          "--rounded-badge": "16px",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "0px",
          "--tab-border": "0px",
          "--tab-radius": "8px",
        },
        // Dark theme - Material Design inspired
        dark: {
          "primary": "#90CAF9",           // Material Blue 200
          "primary-content": "#0D47A1",
          "secondary": "#CE93D8",         // Material Purple 200
          "secondary-content": "#4A148C",
          "accent": "#80DEEA",            // Material Cyan 200
          "accent-content": "#006064",
          "neutral": "#455A64",           // Material Blue Grey 700
          "neutral-content": "#ECEFF1",
          "base-100": "#121212",          // Surface (Material dark)
          "base-200": "#1E1E1E",          // Surface variant
          "base-300": "#2D2D2D",          // Surface container
          "base-content": "#E0E0E0",      // On surface
          "info": "#64B5F6",
          "success": "#81C784",
          "warning": "#FFB74D",
          "error": "#E57373",
          "--rounded-box": "12px",
          "--rounded-btn": "8px",
          "--rounded-badge": "16px",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "0px",
          "--tab-border": "0px",
          "--tab-radius": "8px",
        }
      }
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}
