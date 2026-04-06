import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'avalanche' | 'cyber' | 'matrix' | 'amber' | 'amethyst';
export type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'avalanche',
  defaultMode = 'light',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mode, setMode] = useState<Mode>(defaultMode);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme and mode classes
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');
    
    // Apply new theme and mode
    root.setAttribute('data-theme', theme);
    root.classList.add(mode);
    
    // Store in localStorage
    localStorage.setItem(storageKey, JSON.stringify({ theme, mode }));
  }, [theme, mode, storageKey]);

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { theme: storedTheme, mode: storedMode } = JSON.parse(stored);
        if (storedTheme) setTheme(storedTheme);
        if (storedMode) setMode(storedMode);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, [storageKey]);

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    mode,
    setTheme,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
