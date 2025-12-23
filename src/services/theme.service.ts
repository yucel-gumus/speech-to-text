import type { ThemeMode } from '../types';
import { getStoredTheme, setStoredTheme } from '../utils/storage';

export class ThemeService {
    private currentTheme: ThemeMode;
    private toggleIcon: HTMLElement;

    constructor(toggleIcon: HTMLElement) {
        this.toggleIcon = toggleIcon;
        this.currentTheme = getStoredTheme();
    }

    init(): void {
        this.applyTheme(this.currentTheme);
    }

    toggle(): void {
        console.log('Theme toggle called, current:', this.currentTheme);
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('New theme:', this.currentTheme);
        this.applyTheme(this.currentTheme);
        setStoredTheme(this.currentTheme);
    }

    private applyTheme(theme: ThemeMode): void {
        if (!this.toggleIcon) return;

        if (theme === 'light') {
            document.body.classList.add('light-mode');
            this.toggleIcon.classList.remove('fa-sun');
            this.toggleIcon.classList.add('fa-moon');
        } else {
            document.body.classList.remove('light-mode');
            this.toggleIcon.classList.remove('fa-moon');
            this.toggleIcon.classList.add('fa-sun');
        }
    }
}
