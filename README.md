# 🎤 Sesli Not Uygulaması (`speech-to-text`)

Tarayıcıda **ses kaydı** alıp metne çeviren ve isteğe bağlı **AI ile düzenleme (polish)** yapan hafif Vite + TypeScript SPA. Tüm AI işlemleri **Gemini Gateway** üzerinden yapılır; GitHub Pages’ta anahtarlar **pages-bff** veya doğrudan gateway + CORS ile korunur.

**Canlı:** [yucel-gumus.github.io/speech-to-text](https://yucel-gumus.github.io/speech-to-text/)  
**GitHub:** [yucel-gumus/speech-to-text](https://github.com/yucel-gumus/speech-to-text)

---

## Özellikler

- 🎙️ Tarayıcı `MediaRecorder` ile gerçek zamanlı kayıt
- 🌍 Çoklu dil desteği (transkripsiyon dili seçimi)
- 📝 **Transcribe:** `POST /api/transcribe` — ham ses → metin
- ✨ **Polish:** `POST /api/polish` — noktalama, paragraf, okunabilirlik
- 🌙 Karanlık / aydınlık tema
- 📤 GitHub Pages deploy (`gh-pages`)

---

## Mimari

```
speech-to-text (static)
    │
    ├─► VITE_BFF_URL → pages-bff.vercel.app/api/speech/*
    │                      └─► gateway /api/transcribe | /api/polish
    │
    └─► (alternatif dev) VITE_API_URL + VITE_CLIENT_API_KEY → gateway doğrudan
```

Production Pages build’inde **tercihen BFF** kullanın; API key bundle’a girmez.

---

## Gateway endpoint’leri

| Endpoint | Gövde (özet) | Yanıt |
|----------|--------------|--------|
| `/api/transcribe` | Ses (base64 / blob ref), dil | Metin |
| `/api/polish` | Ham transkript | Düzenlenmiş metin |

Header: `X-API-Key: <CLIENT_API_KEY>` (BFF veya doğrudan çağrıda).

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/speech-to-text.git
cd speech-to-text
npm install
cp .env.example .env
```

### `.env` (geliştirme)

```env
VITE_API_URL=https://api.yucelgumus.dev
VITE_CLIENT_API_KEY=your_client_key
# veya
VITE_BFF_URL=https://pages-bff.vercel.app
```

```bash
npm run dev
```

---

## GitHub Pages CI

Repository **Variables** (Settings → Secrets and variables → Actions):

| Variable | Açıklama |
|----------|----------|
| `VITE_API_URL` | Gateway base URL |
| `VITE_CLIENT_API_KEY` veya `VITE_API_KEY` | Client key (BFF kullanılmıyorsa) |
| `VITE_BFF_URL` | Önerilen: pages-bff origin |

`main` push → workflow → `dist/` → `gh-pages` branch.

---

## CORS

Gateway `.env` içinde `ALLOWED_ORIGINS` listesine şunları ekleyin:

- `https://yucel-gumus.github.io`
- Yerel: `http://localhost:5173`

---

## Teknoloji

| Katman | Stack |
|--------|--------|
| UI | Vite 6, TypeScript, vanilla CSS |
| Markdown | `marked` (polish önizleme) |
| Backend | `python_backend` (FastAPI) |

---

## İlgili projeler

- [pages-bff](https://github.com/yucel-gumus/pages-bff) — Pages için güvenli proxy
- [llm_api](https://github.com/yucel-gumus/llm_api) — Gateway kaynağı

---

## Lisans

Apache-2.0