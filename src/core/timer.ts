import { TIMER_CONFIG } from '../config';
import { formatTime } from '../utils/dom';

export class RecordingTimer {
    private display: HTMLDivElement;
    private startTime = 0;
    private intervalId: number | null = null;

    constructor(display: HTMLDivElement) {
        this.display = display;
    }

    start(): void {
        this.startTime = Date.now();
        this.update();
        this.intervalId = window.setInterval(() => this.update(), TIMER_CONFIG.updateInterval);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(): void {
        this.stop();
        this.display.textContent = '00:00.00';
    }

    private update(): void {
        const elapsed = Date.now() - this.startTime;
        this.display.textContent = formatTime(elapsed);
    }
}
