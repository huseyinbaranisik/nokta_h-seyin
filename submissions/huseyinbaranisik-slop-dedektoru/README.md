# Track C — Nokta-Nokta Final

## Submission

- **Öğrenci no:** 241478060
- **Slug:** huseyinbaranisik-slop-dedektoru
- **Track:** C

## Track Seçimi

**Track C — Halkayı Kapatıyoruz**

Önceki haftalarda inşa edilen Slop Dedektörü altyapısı üzerine üç yeni katman eklendi:
1. Mikrofon → ses dalga animasyonu (Voice Visualizer)
2. 3D Avatar + lipsync pipeline (react-three-fiber + viseme)
3. Forge döngüsü STUCK tespiti → uzmana WebRTC görüntülü köprü (Jitsi Meet)

---

## Expo Bağlantısı

> Projeyi klonlayıp bağımlılıkları yükledikten sonra `npx expo start` komutuyla çalıştırın.

```bash
cd submissions/huseyinbaranisik-slop-dedektoru/app
npm install
npx expo start
```

QR kodu terminalde görünür. Expo Go uygulamasıyla okutabilirsiniz.

---

## Demo Video

> 60 sn demo videosu: [Demo Video](https://www.youtube.com/watch?v=PLACEHOLDER)

---

## 🚀 Kurulum ve Çalıştırma

1. **Bağımlılıklar**: `cd app && npm install`
2. **API Key**: `app/.env` dosyasına `EXPO_PUBLIC_GROQ_API_KEY` değişkenini ekleyin. (Mock modunda da çalışabilir)
3. **Başlat**: `npx expo start`


---

## Uygulama Akışı

```
HomeScreen
  ├── 3D/2D Avatar (sese tepki verir, lipsync)
  ├── Voice Visualizer (mikrofon dalgaları)
  ├── Pitch text input (TextInput, maks 2000 karakter)
  ├── Mikrofon → STT → FORGE.md burn-in rapor
  ├── Örnek pitch pill'leri (tap to fill)
  └── "Analiz Et" butonu
        │
        ▼  analyzePitch() — Gemini 1.5 Flash / Groq (Llama 3.3)
        │
        ├── slopScore ≤ 60  → Başarılı → failCount sıfırlanır
        └── slopScore > 60  → FAIL → failCount++
              │
              ├── failCount < 2 → Normal sonuç göster
              └── failCount ≥ 2 → STUCK! → ExpertCall (Jitsi WebRTC)
                    │
                    └── Kapandığında → BRIDGE.md'ye özet kaydedilir

ResultScreen
  ├── SlopGauge (SVG animasyonlu daire)
  ├── AI Özeti
  ├── ClaimCard listesi (iddia × verdict)
  ├── Yatırımcı Önerisi
  └── Paylaş / Yeni Pitch butonları
```

---

## Yeni Özellikler (Final Haftası)

### 🎙️ Ses Görselleştirici (Voice Visualizer)
- `expo-av` ile mikrofon girişi yakalanır, `isMeteringEnabled` ile dB ölçülür.
- dB değeri 0-1 arasına normalize edilir, `react-native-reanimated` ile dinamik bar/dalga animasyonuna bağlanır.
- **Sessizlikte söner, konuşunca canlansın** prensibi (OpenAI voice-mode estetiği referans).

### 🧑 3D Avatar & Lipsync
- `react-three-fiber` + `@react-three/drei` ile `.glb` avatar yüklenir.
- Ses seviyesine göre `morphTargetInfluences['mouthOpen'/'viseme_O']` güncellenir (< 200ms latency).
- Expo Go uyumluluğu için **ErrorBoundary + 2D animated fallback** ile güvenli bir şekilde yüklenir.
- 3D yüklenemezse ağız animasyonlu 2D avatar otomatik olarak devreye girer.

### 🔄 Forge Döngüsü & STUCK Tespiti
- Her analiz sonucunda `slopScore > 60` ise `failCount++`.
- Art arda **2 defa FAIL** → `isStuck = true` → otomatik olarak uzmana yönlendir.
- Başarılı analiz geldiğinde `failCount` sıfırlanır.

### 📞 WebRTC Uzman Çağrısı (Jitsi Meet)
- STUCK durumunda `ExpertCall` bileşeni ekranı kaplar.
- `react-native-webview` + Jitsi Meet entegrasyonu ile görüntülü/sesli bağlantı.
- Görüşme sonlandığında özet `BRIDGE.md`'ye kaydedilir.

### 📝 FORGE.md & BRIDGE.md
- **FORGE.md**: Sesli dikte ile oluşturulan burn-in raporları otomatik yazılır.
- **BRIDGE.md**: Uzman görüşmesi sonrası çözüm transkripti kaydedilir ve bir sonraki cycle'a context olarak aktarılır.

---

## Decision Log

| # | Karar | Gerekçe |
|---|-------|---------|
| 1 | **Gemini 1.5 Flash** seçildi | Hız/maliyet/kalite optimumu; 128k context sayesinde uzun pitch'leri sığdırır |
| 2 | **Offline Mock** eklendi | API key yokken demo koşulabilir; jüri key olmadan da değerlendirebilir |
| 3 | **react-native-svg** ile Gauge | Bar/text yerine görsel etki maksimum; Recharts/Victory'den hafif |
| 4 | **Auto-JSON parsing** | Model bazen ```json``` bloğu ekler; regex ile temizlenir |
| 5 | **Animated fade+slide** ResultScreen | Kullanıcı score'u "açılıyor" hisseder; engagement artar |
| 6 | **Expo Linear Gradient** | iOS/Android gradient desteği cross-platform; native katman |
| 7 | Root dosyalara dokunulmadı | challenge.md kuralına tam uyum |
| 8 | **react-native-reanimated** ile Voice Visualizer | expo-av metering + reanimated = en düşük latency dalga animasyonu |
| 9 | **ErrorBoundary + 2D Fallback** Avatar | 3D sahne Expo Go'da crash olabilir; 2D lipsync animasyonu güvenli çalışır |
| 10 | **Jitsi Meet WebView** ile Expert Call | Native WebRTC SDK yerine WebView kullanıldı → kurulum sıfır, cross-platform |
| 11 | **Heuristik STUCK (2×FAIL)** mantığı | Forge döngüsünde 2 ardışık kötü skor (>60) → otomatik uzman çağrısı tetiklenir |
| 12 | **expo-file-system** ile FORGE/BRIDGE.md | Device-local dosya yazımı; AsyncStorage'dan farklı olarak markdown olarak okunabilir |

---

## AI Tool Log

- **Antigravity (Google DeepMind)** — kod scaffold, bileşen mimarisi, Gemini prompt tasarımı, entegrasyon, hata düzeltme
- Model: Claude Opus 4.6, Gemini 3.1 Pro, Gemini 3 Flash
- Kullanım: Mimari kurulum, WebRTC/Jitsi entegrasyonu, Lipsync pipeline, Voice Visualizer animasyonları, Forge STUCK mantığı, FORGE.md/BRIDGE.md dosya yönetimi

---

## 📦 APK Alma (EAS Build)

Rubric gereği `app-release.apk` dosyası bu klasörün kök dizininde olmalıdır. Oluşturmak için:

```bash
cd app
eas build -p android --profile preview
```

Build bittikten sonra inen APK'yı `submissions/huseyinbaranisik-slop-dedektoru/app-release.zip` olarak (GitHub limitleri nedeniyle ZIP'lenmiş şekilde) kaydedin.

> [!NOTE]
> GitHub dosya boyutu limitleri nedeniyle APK dosyası `app-release.zip` içerisindedir. Test için lütfen ZIP'den çıkarın.


---

## Öz Değerlendirme

| Eksen | Beklenen | Durum |
|-------|----------|-------|
| Çalışır Teslim | 35 | ✅ Expo link + mock demo + APK |
| Scope Disiplini | 25 | ✅ Track C tam akışı eksiksiz |
| Anti-Slop Orijinallik | 20 | ✅ Orijinal prompt + UX tasarımı |
| Engineering Trace | 20 | ✅ Decision log + commit'ler |

**Video:** https://youtube.com/shorts/88AA4B06uoA
