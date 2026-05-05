'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'husty-theme';

export function useTheme() {
  // Começa sempre em 'dark' para evitar mismatch de hidratação SSR
  const [theme, setThemeState] = useState<Theme>('dark');

  // Lê o tema salvo depois da montagem
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved && saved !== 'dark') setThemeState(saved);
  }, []);

  // Aplica data-theme no <html> e persiste
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  return { theme, setTheme };
}
