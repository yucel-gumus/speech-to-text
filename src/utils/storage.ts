import type { ThemeMode } from '../types';

const THEME_KEY = 'theme';

export function getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

export function setStoredTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme);
}
