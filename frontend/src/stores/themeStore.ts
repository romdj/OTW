/**
 * Theme store for managing DaisyUI theme switching
 * Using Material Design inspired light/dark themes
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  isDark: boolean;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    isDark: false,
    description: 'Clean, bright Material Design theme',
    primaryColor: '#1976D2',
    secondaryColor: '#9C27B0',
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    isDark: true,
    description: 'Material Design dark theme',
    primaryColor: '#90CAF9',
    secondaryColor: '#CE93D8',
  },
};

// Default theme
const DEFAULT_THEME: Theme = 'light';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'otw-sport-theme';

// Create the store
function createThemeStore() {
  // Initialize with default theme
  const { subscribe, set, update } = writable<Theme>(DEFAULT_THEME);

  return {
    subscribe,

    // Set theme and persist to localStorage
    setTheme: (theme: Theme) => {
      set(theme);
      if (browser) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    },

    // Toggle between light and dark themes
    toggleTheme: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem(THEME_STORAGE_KEY, newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    },

    // Initialize theme from localStorage or system preference
    initializeTheme: () => {
      if (!browser) return;

      let savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;

      // If no saved theme, check system preference
      if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = prefersDark ? 'dark' : 'light';
      }

      // Validate saved theme
      if (!themes[savedTheme]) {
        savedTheme = DEFAULT_THEME;
      }

      set(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't manually selected a theme
        const hasManualSelection = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasManualSelection) {
          const systemTheme = e.matches ? 'dark' : 'light';
          set(systemTheme);
          document.documentElement.setAttribute('data-theme', systemTheme);
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    },

    // Get current theme config
    getCurrentThemeConfig: (currentTheme: Theme): ThemeConfig => {
      return themes[currentTheme];
    },

    // Reset to default theme
    resetTheme: () => {
      set(DEFAULT_THEME);
      if (browser) {
        localStorage.removeItem(THEME_STORAGE_KEY);
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
      }
    }
  };
}

export const themeStore = createThemeStore();

// Derived store for current theme config
export const currentThemeConfig = writable<ThemeConfig>(themes[DEFAULT_THEME]);

// Update theme config when theme changes
themeStore.subscribe(theme => {
  currentThemeConfig.set(themes[theme]);
});
