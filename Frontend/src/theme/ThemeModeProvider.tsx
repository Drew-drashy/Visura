import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleMode: () => {},
});

const paletteTokens: Record<PaletteMode, Parameters<typeof createTheme>[0]> = {
  light: {
    palette: {
      mode: 'light',
      primary: {
        main: '#6750A4',
      },
      secondary: {
        main: '#006874',
      },
      background: {
        default: '#f3f4f7',
        paper: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
      },
    },
    typography: {
      fontFamily: `'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    },
    shape: {
      borderRadius: 16,
    },
  },
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#9d8cff',
      },
      secondary: {
        main: '#4dd0e1',
      },
      background: {
        default: '#0f172a',
        paper: '#111827',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5f5',
      },
    },
    typography: {
      fontFamily: `'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    },
    shape: {
      borderRadius: 16,
    },
  },
};

const themeCssVariables: Record<PaletteMode, Record<string, string>> = {
  light: {
    '--bg-color': '#f3f4f7',
    '--surface-color': '#ffffff',
    '--primary-text-color': '#0f172a',
    '--secondary-text-color': '#475569',
    '--accent-color': '#6750A4',
    '--muted-color': '#e2e8f0',
    '--sidebar-bg': '#ffffff',
    '--sidebar-border': 'rgba(15, 23, 42, 0.08)',
    '--sidebar-text': '#0f172a',
    '--navbar-bg': '#ffffffcc',
    '--shadow-color': 'rgba(15, 23, 42, 0.08)',
    '--card-bg': '#ffffff',
  },
  dark: {
    '--bg-color': '#0f172a',
    '--surface-color': '#111827',
    '--primary-text-color': '#f8fafc',
    '--secondary-text-color': '#cbd5f5',
    '--accent-color': '#9d8cff',
    '--muted-color': 'rgba(148, 163, 184, 0.2)',
    '--sidebar-bg': '#111827',
    '--sidebar-border': 'rgba(148, 163, 184, 0.18)',
    '--sidebar-text': '#f8fafc',
    '--navbar-bg': 'rgba(15, 23, 42, 0.85)',
    '--shadow-color': 'rgba(15, 23, 42, 0.6)',
    '--card-bg': '#1f2937',
  },
};

const storageKey = 'visura-theme-mode';

const getInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const useThemeMode = () => useContext(ThemeModeContext);

const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, mode);
    document.documentElement.setAttribute('data-theme', mode);

    const vars = themeCssVariables[mode];
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const theme = useMemo(() => createTheme(paletteTokens[mode]), [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;


