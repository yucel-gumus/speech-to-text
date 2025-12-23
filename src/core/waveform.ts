import { AUDIO_CONFIG } from '../config';
import { getRecordingColor } from '../utils/dom';

export class WaveformVisualizer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private audioContext: AudioContext | null = null;
    private analyserNode: AnalyserNode | null = null;
    private dataArray: Uint8Array | null = null;
    private animationId: number | null = null;
    private isRunning = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    setupDimensions(): void {
        if (!this.ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round(rect.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    init(stream: MediaStream): void {
        if (this.audioContext) return;

        const AudioContextClass = window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        this.audioContext = new AudioContextClass!();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = AUDIO_CONFIG.fftSize;
        this.analyserNode.smoothingTimeConstant = AUDIO_CONFIG.smoothingTimeConstant;

        this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        source.connect(this.analyserNode);
    }

    start(): void {
        this.isRunning = true;
        this.draw();
    }

    stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy(): void {
        this.stop();
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(console.warn);
        }
        this.audioContext = null;
        this.analyserNode = null;
        this.dataArray = null;
    }

    private draw(): void {
        if (!this.isRunning || !this.analyserNode || !this.dataArray || !this.ctx) {
            return;
        }

        this.animationId = requestAnimationFrame(() => this.draw());
        this.analyserNode.getByteFrequencyData(this.dataArray);

        const logicalWidth = this.canvas.clientWidth;
        const logicalHeight = this.canvas.clientHeight;

        this.ctx.clearRect(0, 0, logicalWidth, logicalHeight);

        const bufferLength = this.analyserNode.frequencyBinCount;
        const numBars = Math.floor(bufferLength * 0.5);

        if (numBars === 0) return;

        const totalBarPlusSpacingWidth = logicalWidth / numBars;
        const barWidth = Math.max(1, Math.floor(totalBarPlusSpacingWidth * 0.7));
        const barSpacing = Math.max(0, Math.floor(totalBarPlusSpacingWidth * 0.3));

        let x = 0;
        this.ctx.fillStyle = getRecordingColor();

        for (let i = 0; i < numBars; i++) {
            if (x >= logicalWidth) break;

            const dataIndex = Math.floor(i * (bufferLength / numBars));
            const barHeightNormalized = this.dataArray[dataIndex] / 255.0;
            let barHeight = barHeightNormalized * logicalHeight;

            if (barHeight < 1 && barHeight > 0) barHeight = 1;
            barHeight = Math.round(barHeight);

            const y = Math.round((logicalHeight - barHeight) / 2);
            this.ctx.fillRect(Math.floor(x), y, barWidth, barHeight);
            x += barWidth + barSpacing;
        }
    }
}
