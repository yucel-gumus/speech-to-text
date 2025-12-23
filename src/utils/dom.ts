export function getElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector(selector) as T;
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
}

export function getElementById<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T;
    if (!element) {
        throw new Error(`Element not found: #${id}`);
    }
    return element;
}

export function formatTime(elapsedMs: number): string {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((elapsedMs % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

export function downloadTextFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, 100);
}

export function getRecordingColor(): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-recording')
        .trim() || '#ff3b30';
}
