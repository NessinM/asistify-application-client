import { ThemeType } from '@/types/user.type';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const KEY_THEME_STORAGE = '_asistify_theme';
const isBrowser = typeof window !== 'undefined';

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function storeValue<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function applyThemeToDocument(theme: ThemeType) {
  if (!isBrowser) return;

  const html = document.documentElement;
  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  html.classList.remove('light', 'dark');
  html.classList.add(effectiveTheme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => getStoredValue(KEY_THEME_STORAGE, 'light'));

  useEffect(() => {
    if (!isBrowser) return;

    applyThemeToDocument(theme);
    storeValue(KEY_THEME_STORAGE, theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyThemeToDocument('system');

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
