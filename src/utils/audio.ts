/** Browsers often report e.g. `audio/webm;codecs=opus` — gateway allows base MIME only. */
export function normalizeAudioMimeType(mime: string): string {
    const base = mime.split(';')[0].trim().toLowerCase();
    return base || 'audio/webm';
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            const base64Audio = base64data.split(',')[1];
            resolve(base64Audio);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

export function getMimeType(recorder: MediaRecorder | null): string {
    return normalizeAudioMimeType(recorder?.mimeType || 'audio/webm');
}