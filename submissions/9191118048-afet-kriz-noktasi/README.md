# Afet / Kriz Noktası — Submission

**Öğrenci:** Khalid Tariq — **Numara:** 9191118048  
**Klasör:** `submissions/9191118048-afet-kriz-noktasi/`

Bu klasör [NOKTA](https://github.com/seyyah/nokta) ödev formatına uygundur.

## Track seçimi

**Track A — Dot Capture & Enrich**

- Ham fikir **metin veya ses** ile alınır.
- **5 mühendislik sorusu** sorulur: senaryo/tetikleyici, offline önceliği, güvenilir kaynak ve doğrulama, ölçek/yayılım, kısıtlar ve uyum (problem, kullanıcı, kapsam ve kısıt bu eksenlerin içinde ele alınır).
- Çıktı: **tek sayfalık** kriz kullanım senaryosu **spec** (OpenAI anahtarı yoksa yerel şablon).

Özelleştirilmiş fikir belgesi: bu klasördeki **`idea.md`**.

## Teslim checklist (öğrenci)

1. **Fork:** [https://github.com/seyyah/nokta](https://github.com/seyyah/nokta) reposunu kendi hesabınıza fork edin.
2. **Klasör adı:** Bu teslim `submissions/9191118048-afet-kriz-noktasi/` (CI: en az 6 haneli öğrenci no + slug).
3. Bu klasörde zorunlu dosyalar:
   - `README.md` (bu dosya — QR, video, decision log güncel)
   - `idea.md` (track için özelleştirilmiş fikir)
   - `app/` (Expo projesi)
   - `app-release.apk` (zorunlu; yoksa ceza)
4. **Sadece** `submissions/<sizin-klasörünüz>/` altına commit edin; repo köküne dokunmayın (CI reddeder).
5. **Pull Request:** Fork’unuzdan `seyyah/nokta` **upstream** `main` (veya belirtilen dal) hedefine PR açın. PR linkinizi öğretmene / formda paylaşın.  
   Örnek: `https://github.com/seyyah/nokta/pull/1`
6. **Form:** [Ödev teslim formu](https://forms.gle/AqNnb2cWdxHyV8iF9)

## Expo (QR / link)

1. `cd app && npm install`
2. İsteğe bağlı: `cp .env.example .env` ve `EXPO_PUBLIC_OPENAI_API_KEY` ekleyin (ses → metin ve zengin spec için).
3. `npx expo start --tunnel` (veya aynı ağda `--lan`)
4. Terminaldeki **QR** ve **exp://** / Expo Go linkini **aşağıya yapıştırın**:

`<!-- PR öncesi: exp://... veya Expo paylaşım URL’si -->`

**Şu an:** _çalıştırıldıktan sonra doldurulacak._

## Demo video (~60 sn)

_Video linki (YouTube unlisted / Drive vb.):_ **PR öncesi eklenecek**

## APK

- Dosya adı: **`app-release.apk`** (bu submission klasörünün kökünde, `app/` ile aynı seviyede).
- Üretim örneği: `cd app && npx eas-cli build -p android --profile production` (Expo hesabı gerekir) veya `npx expo prebuild` + Android Studio `assembleRelease`.
- Binary’yi commit etmeden PR açarsanız rubrikte **-5** riski vardır.

## Decision log

| Tarih | Karar | Gerekçe |
|------|--------|---------|
| 2026-04-23 | Track A + afet/kriz nişi | NOKTA tezine uygun, şablonlu artifact; jenerik sohbet botundan ayrışır |
| 2026-04-23 | 5 mühendislik sorusu | Ödev 3–5 soru; kriz alanında senaryo/offline/güven/ölçek/uyum net |
| 2026-04-23 | `idea.md` submission içinde | Güncel ödev formatı; kök `idea.md` ile karışmaması için bu klasörde özelleştirilmiş belge |
| 2026-04-23 | OpenAI opsiyonel | Anahtar yoksa akış yerel şablonla tamamlanır (sınav ortamı) |
| 2026-04-23 | `crisisSpec.ts` + `App.tsx` | Okunaklı ayrım, Expo SDK 54 |
| 2026-04-23 | Klasör `9191118048-afet-kriz-noktasi` | Öğrenci no ile CI klasör formatı |

## AI araçları logu

- **Cursor** (Claude): UI, `crisisSpec.ts`, `idea.md`, README uyumu.
- Yedek: doğrudan OpenAI API / Playground (limit olursa yerel spec).
