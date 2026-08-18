const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

const DEFAULT_TIMEOUT_MS = 45000; // 45 seconds timeout

interface APIResponse {
    success: boolean;
    transcription?: string;
    polished_text?: string;
    error?: string;
}

export class AIService {
    async transcribe(
        base64Audio: string,
        mimeType: string,
        langCode: string,
        signal?: AbortSignal
    ): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

        const onExternalAbort = () => controller.abort();
        if (signal) {
            signal.addEventListener('abort', onExternalAbort, { once: true });
        }

        try {
            const response = await fetch(`${BFF_URL}/api/speech/transcribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio_base64: base64Audio,
                    mime_type: mimeType,
                    language: langCode
                }),
                signal: controller.signal
            });

            const text = await response.text();
            let data: APIResponse;
            try {
                data = text ? JSON.parse(text) : { success: false, error: 'Boş yanıt alındı' };
            } catch {
                throw new Error(`Sunucu hatası (${response.status}): Geçersiz yanıt formatı`);
            }

            if (!response.ok) {
                const detail = (data as { detail?: string; error?: string }).detail;
                throw new Error(detail || data.error || `Transkripsiyon hatası (${response.status})`);
            }
            if (!data.success) throw new Error(data.error || 'Transkripsiyon başarısız');
            return data.transcription || '';
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') {
                throw new Error('İstek zaman aşımına uğradı veya iptal edildi.');
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
            if (signal) {
                signal.removeEventListener('abort', onExternalAbort);
            }
        }
    }

    async polish(
        rawTranscription: string,
        langCode: string,
        signal?: AbortSignal
    ): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

        const onExternalAbort = () => controller.abort();
        if (signal) {
            signal.addEventListener('abort', onExternalAbort, { once: true });
        }

        try {
            const response = await fetch(`${BFF_URL}/api/speech/polish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    raw_transcription: rawTranscription,
                    language: langCode
                }),
                signal: controller.signal
            });

            const text = await response.text();
            let data: APIResponse;
            try {
                data = text ? JSON.parse(text) : { success: false, error: 'Boş yanıt alındı' };
            } catch {
                throw new Error(`Sunucu hatası (${response.status}): Geçersiz yanıt formatı`);
            }

            if (!response.ok) {
                const detail = (data as { detail?: string; error?: string }).detail;
                throw new Error(detail || data.error || `Düzenleme hatası (${response.status})`);
            }
            if (!data.success) throw new Error(data.error || 'Düzenleme başarısız');
            return data.polished_text || '';
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') {
                throw new Error('İstek zaman aşımına uğradı veya iptal edildi.');
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
            if (signal) {
                signal.removeEventListener('abort', onExternalAbort);
            }
        }
    }
}