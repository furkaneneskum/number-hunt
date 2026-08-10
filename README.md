# NUMBER HUNT

Modern, mobil uyumlu sayı tahmin web oyunu. XP, seri, başarımlar ve birden fazla oyun modu içerir.

## Özellikler

- **4 Oyun Modu**: Klasik, Zaman Saldırısı, Seri, Günlük Görev
- **4 Zorluk**: Kolay, Orta, Zor, Çılgın
- **İlerleme**: XP, seviye, seri, başarımlar
- **Kalıcılık**: localStorage ile kayıt
- **Responsive**: Mobil öncelikli tasarım

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda http://localhost:5173 adresini aç.

## Production Build

```bash
npm run build
npm run preview
```

## GitHub'a Yükleme

### 1. GitHub'da yeni repo oluştur

1. [github.com/new](https://github.com/new) adresine git
2. Repository adı: `number-hunt` (veya istediğin isim)
3. **Public** veya **Private** seç
4. **README, .gitignore ekleme** — projede zaten var, boş repo oluştur
5. **Create repository** tıkla

### 2. Projeyi bağla ve yükle

Terminalde proje klasöründe şu komutları çalıştır (`KULLANICI_ADIN` yerine GitHub kullanıcı adını yaz):

```bash
git remote add origin https://github.com/KULLANICI_ADIN/number-hunt.git
git branch -M main
git push -u origin main
```

GitHub Desktop kullanıyorsan: **File → Add local repository** ile klasörü ekle, ardından **Publish repository**.

### 3. GitHub Pages ile yayınla

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → **Source:** **GitHub Actions** seç  
   ⚠️ **Deploy from a branch DEĞİL** — Jekyll ile React projesi build edilemez.
3. Ayarı kaydettikten sonra **Actions** → **Deploy to GitHub Pages** → **Re-run all jobs**
4. Deploy bitince site: **https://furkaneneskum.github.io/number-hunt/**

## Proje Yapısı

```
src/
├── i18n/tr.ts      # Türkçe metinler
├── config/         # Oyun kuralları ve başarımlar
├── services/       # Oyun mantığı, depolama, ses
├── context/        # Global oyun state
├── components/     # UI bileşenleri
└── pages/          # Sayfa rotaları
```

## Teknolojiler

- React 19 + TypeScript
- Vite
- React Router
- Vanilla CSS
