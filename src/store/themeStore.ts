import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem(STORAGE_KEY, theme);
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },

  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
