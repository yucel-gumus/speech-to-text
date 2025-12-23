# 🎤 Sesli Not Uygulaması

Sesli olarak kaydettiğiniz notları otomatik olarak yazıya döker ve AI ile düzenleyerek okunabilir, formatlanmış bir not haline getirir.

## ✨ Özellikler

- 🎙️ **Gerçek zamanlı ses kaydı** - Canlı dalga formu görselleştirmesi
- 🌍 **11 dil desteği** - Türkçe, İngilizce, Almanca, Fransızca ve daha fazlası
- 📝 **Otomatik transkripsiyon** - Ses → Metin dönüşümü
- ✨ **AI ile düzenleme** - Markdown formatında düzenli notlar
- 🌙 **Karanlık/Aydınlık tema**
- 📥 **Not indirme** - .txt formatında

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Python FastAPI backend (API için)

### Frontend

```bash
# Klonla
git clone https://github.com/username/speech-to-text.git
cd speech-to-text

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
echo "VITE_API_URL=http://localhost:8000" > .env

# Geliştirme sunucusunu başlat
npm run dev
```

### Backend API

Bu uygulama, transkripsiyon ve düzenleme için harici bir FastAPI backend kullanır.

Backend'inize aşağıdaki endpoint'leri ekleyin:

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/transcribe` | POST | Base64 audio → Transkript |
| `/api/polish` | POST | Ham metin → Düzenlenmiş not |

**Request/Response formatları için** `implementation_plan.md` dosyasına bakın.

## 📁 Proje Yapısı

```
src/
├── types/           # Type definitions
├── config/          # Uygulama ayarları
├── utils/           # Yardımcı fonksiyonlar
├── services/        # API ve ses servisleri
├── core/            # Ana bileşenler
├── app.ts           # Ana uygulama
└── main.ts          # Giriş noktası
```

## 🎯 Kullanım

1. **Dil seçin** - Dropdown'dan transkripsiyon dilini seçin
2. **Kaydet** - Mikrofon butonuna tıklayın ve konuşun
3. **Durdur** - Tekrar tıklayarak kaydı durdurun
4. **Bekleyin** - AI transkripsiyon ve düzenleme yapacak
5. **İndirin** - Düzenlenmiş notu indirin

## 🛠️ Teknolojiler

- **Frontend:** Vite, TypeScript, CSS
- **Backend:** Python FastAPI, Google Gemini AI
- **Markdown:** marked.js

## 📄 Lisans

Apache-2.0
