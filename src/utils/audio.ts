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
    return recorder?.mimeType || 'audio/webm';
}
