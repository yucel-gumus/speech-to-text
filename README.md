# 🎤 Sesli Not (AI-Powered Dictation & Audio Transcription App)

Sesli Not; tarayıcı üzerinden doğrudan ses kaydı almanızı, bu kaydı yapay zeka ile metne dönüştürmenizi (Transcription) ve ardından Gemini AI'ın gücüyle metni noktalama, paragraf yapısı ve okunabilirlik açısından profesyonelce düzenlemenizi (Polish) sağlayan modern bir **Vite + TypeScript** tek sayfa web uygulamasıdır (SPA).

---

## 🌟 Öne Çıkan Özellikler

* 🎙️ **Tarayıcı Tabanlı Ses Kaydı:** Tarayıcının yerleşik **MediaRecorder API**'sini kullanarak ek bir yazılım kurmadan doğrudan mikrofondan ses kaydı alır.
* 🌍 **Çoklu Dil Desteği:** Transkripsiyon (metne dökme) işleminde Türkçe dahil olmak üzere farklı kaynak dilleri seçme desteği.
* 📝 **Akıllı Transkripsiyon (`/api/transcribe`):** Ham ses dosyasını Gemini'ın multimodal (ses algılama) yeteneklerini kullanarak yüksek doğrulukta metne döker.
* ✨ **AI Metin Düzenleme (`/api/polish`):** Transkript edilen ham metni; noktalama işaretleri ekleyerek, paragraflara bölerek ve okunabilirliği artırarak akıcı bir not haline getirir.
* 🔬 **Markdown Önizleme:** Düzenlenmiş notlar, `marked` kütüphanesi ile zengin metin (Markdown) olarak anında önizlenebilir ve panoya kopyalanabilir veya indirilebilir.
* 🛡️ **BFF Güvenlik Katmanı:** Tarayıcı tarafında API anahtarı ifşa edilmesini önlemek amacıyla tüm AI ağ istekleri **pages-bff** proxy katmanı üzerinden yönlendirilir.

---

## 🏗️ Mimarî İş Akışı

```
[ Mikrofon Girişi ] ──► [ MediaRecorder API (Tarayıcı) ] ──► [ Ses Dosyası (Blob) ]
                                                                      │
                                                            (POST /api/transcribe)
                                                                      ▼
[ Ham Transkript ] ◄──(Ses Dosyasını İşler)─────────────── [ Pages BFF (Vercel) ]
      │
      ├─► (Düzenleme İsteği - POST /api/polish)
      ▼
[ Gemini 3.5 Flash ] ──(Noktalama & Paragraf Ekleme)──► [ Marked Markdown Önizleme ]
```

---

## 🛠️ Teknoloji Stack

* **Frontend:** Vite 6, TypeScript, Vanilla CSS (yüksek performanslı, hafif tasarım).
* **Markdown Renderer:** `marked` kütüphanesi (Markdown önizleme ekranı için).
* **Yapay Zeka API:** Google Gemini API (via [llm_api Gateway](https://github.com/yucel-gumus/llm_api)).
* **BFF Proxy:** [pages-bff](https://github.com/yucel-gumus/pages-bff) (Vercel Serverless proxy).

---

## 📂 Proje Klasör Yapısı

```
speech-to-text/
├── src/
│   ├── config/           # Ortam ve API yapılandırmaları
│   ├── core/             # Ses kaydetme ve MediaRecorder yöneticisi
│   ├── services/         # Transcribe ve Polish API servisleri
│   ├── app.ts            # Arayüz güncellemeleri ve olay dinleyiciler
│   └── main.ts           # Uygulama başlangıç noktası
├── index.html
├── index.css             # Özelleştirilmiş aydınlık/karanlık tema CSS'i
├── tsconfig.json
└── package.json
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/speech-to-text.git
cd speech-to-text
npm install
```

### 2. Ortam Değişkenleri (`.env`)
Proje kök dizininde `.env` oluşturun:

```env
# Geliştirme Ortamı (Lokal Gateway bağlantısı)
VITE_API_URL=https://api.yucelgumus.dev
VITE_CLIENT_API_KEY=your_development_client_key

# Üretim (Production) BFF bağlantısı (Önerilen)
VITE_BFF_URL=https://pages-bff.vercel.app
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde başlayacaktır.

### 4. GitHub Pages Üzerinden Yayına Alma (Deploy)
Projenizi otomatik olarak derleyip GitHub Pages üzerine yüklemek için:
```bash
npm run build
npm run deploy
```

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://yucel-gumus.github.io/speech-to-text/](https://yucel-gumus.github.io/speech-to-text/)
* **API Gateway Kaynak Kodu:** [yucel-gumus/llm_api](https://github.com/yucel-gumus/llm_api)