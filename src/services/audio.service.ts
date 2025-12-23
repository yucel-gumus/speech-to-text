export class AudioService {
    private stream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];

    async requestMicrophone(): Promise<MediaStream> {
        if (this.stream) {
            this.releaseStream();
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });
        }

        return this.stream;
    }

    createRecorder(onDataAvailable: (blob: Blob) => void, onStop: () => void): MediaRecorder {
        if (!this.stream) {
            throw new Error('No active stream');
        }

        this.audioChunks = [];

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm' });
        } catch {
            this.mediaRecorder = new MediaRecorder(this.stream);
        }

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                this.audioChunks.push(event.data);
                onDataAvailable(event.data);
            }
        };

        this.mediaRecorder.onstop = onStop;

        return this.mediaRecorder;
    }

    start(): void {
        this.mediaRecorder?.start();
    }

    stop(): void {
        try {
            this.mediaRecorder?.stop();
        } catch (e) {
            console.error('Error stopping MediaRecorder:', e);
        }
    }

    getAudioBlob(): Blob | null {
        if (this.audioChunks.length === 0) return null;
        return new Blob(this.audioChunks, {
            type: this.mediaRecorder?.mimeType || 'audio/webm',
        });
    }

    getMimeType(): string {
        return this.mediaRecorder?.mimeType || 'audio/webm';
    }

    getStream(): MediaStream | null {
        return this.stream;
    }

    releaseStream(): void {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }
    }

    reset(): void {
        this.stop();
        this.releaseStream();
        this.audioChunks = [];
        this.mediaRecorder = null;
    }
}
