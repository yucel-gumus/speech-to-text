import type { ThemeMode } from '../types';

const THEME_KEY = 'theme';

export function getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' ? 'light' : 'dark';
}

export function setStoredTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme);
}
