import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { themeStore, themes } from './themeStore';

// Mock browser environment
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

const mockMatchMedia = vi.fn(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const mockDocumentElement = {
  setAttribute: vi.fn(),
};

// Mock browser globals
vi.stubGlobal('localStorage', mockLocalStorage);
vi.stubGlobal('matchMedia', mockMatchMedia);
Object.defineProperty(global, 'document', {
  value: {
    documentElement: mockDocumentElement,
  },
});

// Mock browser environment check
vi.mock('$app/environment', () => ({
  browser: true,
}));

describe('themeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have light as default theme', () => {
    expect(get(themeStore)).toBe('light');
  });

  it('should update theme and persist to localStorage', () => {
    themeStore.setTheme('dark');

    expect(get(themeStore)).toBe('dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('otw-sport-theme', 'dark');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('should toggle between themes', () => {
    // Reset to light first
    themeStore.setTheme('light');
    expect(get(themeStore)).toBe('light');

    // Toggle to dark
    themeStore.toggleTheme();
    expect(get(themeStore)).toBe('dark');

    // Toggle back to light
    themeStore.toggleTheme();
    expect(get(themeStore)).toBe('light');
  });

  it('should reset theme to default', () => {
    themeStore.setTheme('dark');
    expect(get(themeStore)).toBe('dark');

    themeStore.resetTheme();
    expect(get(themeStore)).toBe('light');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('otw-sport-theme');
  });

  it('should provide theme configurations', () => {
    expect(themes.light).toBeDefined();
    expect(themes.dark).toBeDefined();

    expect(themes.light.isDark).toBe(false);
    expect(themes.dark.isDark).toBe(true);

    expect(themes.light.displayName).toBe('Light');
    expect(themes.dark.displayName).toBe('Dark');
  });

  it('should handle system theme preference', () => {
    // Mock system dark theme preference
    const mockSystemMatchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', mockSystemMatchMedia);

    themeStore.initializeTheme();

    // Should detect system preference for dark theme
    expect(mockSystemMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });
});
