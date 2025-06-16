# Türkçe Dikte ve Not Uygulaması

Bu uygulama, sesli olarak kaydettiğiniz notları otomatik olarak yazıya döker ve Google Gemini API ile düzenleyerek okunabilir, özetlenmiş bir not haline getirir. Hem ham transkripsiyonu hem de düzenlenmiş halini görebilir ve istediğiniz zaman bilgisayarınıza indirebilirsiniz.

## Özellikler

- **Tamamen Türkçe arayüz**
- **Google Gemini API ile Türkçe transkripsiyon ve not düzenleme**
- **Ses kaydı ile otomatik not oluşturma**
- **Ham ve düzenlenmiş notlar arasında kolay geçiş**
- **Notları .txt formatında indirme**
- **Karanlık ve aydınlık tema desteği**

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (18+ önerilir)

### Adımlar
1. Depoyu klonlayın veya dosyaları indirin.
2. Terminalde proje klasörüne girin:
   ```sh
   cd dictation-app
   ```
3. Bağımlılıkları yükleyin:
   ```sh
   npm install
   ```
4. Google Gemini API anahtarınızı `.env.local` dosyasına ekleyin:
   ```env
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
5. Uygulamayı başlatın:
   ```sh
   npm run dev
   ```
6. Tarayıcıda `http://localhost:5173` adresine gidin.

## Kullanım

- **Kayıt Başlat/Durdur:** Mikrofon simgesine tıklayarak ses kaydını başlatın veya durdurun.
- **Sekmeler:** "Düzenlenmiş" sekmesinde yapay zeka ile düzenlenmiş notu, "Ham" sekmesinde ise orijinal transkripsiyonu görebilirsiniz.
- **Notu İndir:** İndir simgesine tıklayarak aktif sekmedeki notu `.txt` olarak bilgisayarınıza kaydedin.
- **Tema Değiştir:** Güneş/ay simgesine tıklayarak karanlık/aydınlık tema arasında geçiş yapabilirsiniz.

## Teknolojiler
- [Vite](https://vitejs.dev/) (hızlı geliştirme ortamı)
- [TypeScript](https://www.typescriptlang.org/)
- [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)
- [marked](https://www.npmjs.com/package/marked) (Markdown desteği)

## Lisans

Apache-2.0

---

Her türlü öneri ve katkı için PR gönderebilirsiniz. İyi kullanımlar!
