'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = 'Pulse-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Determine if it's daytime or nighttime based on user's local time
  const getTimeBasedTheme = (): ResolvedTheme => {
    const hour = new Date().getHours();
    // Daytime: 6 AM to 6 PM (light theme)
    // Nighttime: 6 PM to 6 AM (dark theme)
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  };

  // Get theme preference from system
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  // Resolve the actual theme to apply
  const resolveTheme = (themePreference: Theme): ResolvedTheme => {
    if (themePreference === 'auto') {
      // First check time-based theme
      return getTimeBasedTheme();
    }
    return themePreference;
  };

  // Apply theme to document
  const applyTheme = (resolved: ResolvedTheme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    setResolvedTheme(resolved);
  };

  // Set theme and save to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
    const resolved = resolveTheme(newTheme);
    applyTheme(resolved);
  };

  // Initialize theme on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      const initialTheme = stored || defaultTheme;
      setThemeState(initialTheme);
      const resolved = resolveTheme(initialTheme);
      applyTheme(resolved);
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
      const resolved = resolveTheme(defaultTheme);
      applyTheme(resolved);
    }
  }, []);

  // Watch for time changes (check every minute for auto theme)
  useEffect(() => {
    if (theme !== 'auto') return;

    const checkTimeBasedTheme = () => {
      const newResolved = getTimeBasedTheme();
      if (newResolved !== resolvedTheme) {
        applyTheme(newResolved);
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeBasedTheme, 60000);

    return () => clearInterval(interval);
  }, [theme, resolvedTheme]);

  // Watch for system theme changes (as fallback)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

