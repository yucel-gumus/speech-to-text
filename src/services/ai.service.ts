const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

interface APIResponse {
    success: boolean;
    transcription?: string;
    polished_text?: string;
    error?: string;
}

export class AIService {
    async transcribe(base64Audio: string, mimeType: string, langCode: string): Promise<string> {
        const response = await fetch(`${BFF_URL}/api/speech/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                audio_base64: base64Audio,
                mime_type: mimeType,
                language: langCode
            })
        });

        const data: APIResponse = await response.json();
        if (!response.ok) {
            const detail = (data as { detail?: string; errors?: unknown }).detail;
            throw new Error(detail || data.error || `Transkripsiyon hatası (${response.status})`);
        }
        if (!data.success) throw new Error(data.error || 'Transkripsiyon başarısız');
        return data.transcription || '';
    }

    async polish(rawTranscription: string, langCode: string): Promise<string> {
        const response = await fetch(`${BFF_URL}/api/speech/polish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                raw_transcription: rawTranscription,
                language: langCode
            })
        });

        const data: APIResponse = await response.json();
        if (!data.success) throw new Error(data.error || 'Düzenleme başarısız');
        return data.polished_text || '';
    }
}