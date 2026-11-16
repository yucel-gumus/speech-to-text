import type { ThemeMode } from '../types';

const THEME_KEY = 'theme';

export function getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return 'light';
}

export function setStoredTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme);
}
