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
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        setStoredTheme(this.currentTheme);
    }

    private applyTheme(theme: ThemeMode): void {
        if (!this.toggleIcon) return;

        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.toggleIcon.classList.remove('fa-moon');
            this.toggleIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            this.toggleIcon.classList.remove('fa-sun');
            this.toggleIcon.classList.add('fa-moon');
        }
    }
}
