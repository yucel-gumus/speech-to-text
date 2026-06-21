const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://api.yucelgumus.dev' : 'http://127.0.0.1:8000');

const API_KEY =
  import.meta.env.VITE_CLIENT_API_KEY || import.meta.env.VITE_API_KEY || '';

interface APIResponse {
    success: boolean;
    transcription?: string;
    polished_text?: string;
    error?: string;
}

export class AIService {
    async transcribe(base64Audio: string, mimeType: string, langCode: string): Promise<string> {
        const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify({
                audio_base64: base64Audio,
                mime_type: mimeType,
                language: langCode
            })
        });

        const data: APIResponse = await response.json();
        if (!data.success) throw new Error(data.error || 'Transkripsiyon başarısız');
        return data.transcription || '';
    }

    async polish(rawTranscription: string, langCode: string): Promise<string> {
        const response = await fetch(`${API_BASE_URL}/api/polish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
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