export const AUDIO_CONFIG = {
    fftSize: 256,
    smoothingTimeConstant: 0.75,
    defaultMimeType: 'audio/webm',
} as const;

export const TIMER_CONFIG = {
    updateInterval: 50,
} as const;

export const LANGUAGES = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
] as const;

export const DEFAULT_LANGUAGE = 'tr';
