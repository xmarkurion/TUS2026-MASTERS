import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type ThemeType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeType | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'shadcn-ui-theme',
}: {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.getItem === 'function'
      ) {
        return window.localStorage.getItem(storageKey) ?? defaultTheme;
      }
    } catch (e) {
      // ignore and fall back to defaultTheme
    }

    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: string) => {
          try {
            if (
              typeof window !== 'undefined' &&
              window.localStorage &&
              typeof window.localStorage.setItem === 'function'
            ) {
              window.localStorage.setItem(storageKey, theme);
            }
          } catch (e) {
            // ignore storage write errors
          }

          setTheme(theme);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeType {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
