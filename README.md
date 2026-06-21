# 🎤 Sesli Not Uygulaması

Sesli kayıtları `python_backend` (Gemini Gateway) ile transkribe eder ve düzenler.

**Canlı:** https://yucel-gumus.github.io/speech-to-text/

## ✨ Özellikler

- 🎙️ Gerçek zamanlı ses kaydı
- 🌍 11 dil
- 📝 `POST /api/transcribe`
- ✨ `POST /api/polish`
- 🌙 Karanlık/Aydınlık tema

## 🚀 Kurulum

```bash
npm install
cp .env.example .env   # VITE_API_URL + VITE_CLIENT_API_KEY
npm run dev
```

Gateway: `https://api.yucelgumus.dev` (yerel: `http://127.0.0.1:8000`). CORS: `https://yucel-gumus.github.io`.

## GitHub Pages CI

Repo **Variables:** `VITE_API_URL`, `VITE_CLIENT_API_KEY` (veya `VITE_API_KEY`).

## 🛠️ Teknolojiler

- Vite, TypeScript
- Backend: `python_backend` — `/api/transcribe`, `/api/polish`, `X-API-Key`

## 📄 Lisans

Apache-2.0