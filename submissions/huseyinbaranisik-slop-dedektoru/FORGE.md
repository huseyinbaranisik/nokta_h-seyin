# FORGE Ledger - Otonom Ajan Döngüsü

Bu dosya Nokta-Audit widget'ı tarafından üretilen burn-in raporlarının ve STT diktelerinin coding agent'a (veya AI modeline) verilerek çalıştırılan tamir (forge) döngülerini kaydeder.

## Cycle 1 (Başarılı)
- **Time Box:** 15 dk
- **Status:** `COMMIT`
- **READ:** Kullanıcı sesli olarak şu raporu dikte etti: "ResultScreen'deki Gauge animasyonu çok yavaş çalışıyor, sıfırdan 80'e çıkması 3 saniye sürüyor."
- **LOCATE:** `SlopGauge.tsx` içerisindeki reanimated `withTiming` süresi.
- **HYPOTHESIZE:** `duration: 3000` değeri çok yüksek, bunun `1000` ms'ye düşürülmesi ve `withSpring` kullanılması kullanıcı deneyimini artırır.
- **REPAIR:** `duration` parametresi `1000` olarak güncellendi.
- **TEST:** Expo üzerinde canlı test yapıldı, animasyon daha akıcı.
- **VERIFY:** Yüklenme hissi korundu ve gecikme hissi ortadan kalktı.

## Cycle 2 (Başarılı)
- **Time Box:** 15 dk
- **Status:** `COMMIT`
- **READ:** Audit raporu: "HomeScreen'deki mikrofon butonuna basınca tepki vermiyor, kullanıcı kaydedip kaydetmediğini anlamıyor."
- **LOCATE:** `HomeScreen.tsx` içindeki `handleMicPress` fonksiyonu.
- **HYPOTHESIZE:** Haptic feedback eksik ve renk değişimi yeterince belirgin değil. Haptics eklenip buton rengi kırmızı yapılabilir.
- **REPAIR:** `expo-haptics` import edildi, `ImpactFeedbackStyle.Medium` eklendi, background color `colors.error` olarak değiştirildi.
- **TEST:** Butona basıldığında cihaz titriyor ve kırmızıya dönüyor.
- **VERIFY:** Görsel ve dokunsal geri bildirim sağlandı.

## Cycle 3 (Rollback)
- **Time Box:** 20 dk
- **Status:** `ROLLBACK`
- **READ:** Audit raporu: "Avatar yüklenirken Expo Go çöküyor, model boyutu çok büyük."
- **LOCATE:** `AvatarScene.tsx` ve `ThreeAvatar.tsx`.
- **HYPOTHESIZE:** `avatar.glb` dosyasını `useGLTF` ile yüklerken `draco` compression kullanırsam performans artar ve çökme çözülür.
- **REPAIR:** `draco` decoder eklendi.
- **TEST:** Expo Go'da `draco` binary dosyaları native tarafta eksik olduğu için `Error: Draco decoder module not found` hatası alındı.
- **VERIFY:** Çökme devam etti, native build gerektirdiği için değişiklik geri alındı (Rollback). Yerine ErrorBoundary ve 2D fallback eklendi.

## Cycle 4 (STUCK -> Expert Call Trigger)
- **Time Box:** 20 dk
- **Status:** `STUCK`
- **READ:** Analiz modelinden sürekli olarak "Slop Score > 60" ve JSON parse hatası dönüyor. Regex temizleme çalışmıyor.
- **LOCATE:** `api/analyzer.ts` içindeki `json.match` regex kuralı.
- **HYPOTHESIZE:** Groq LLM çıktısı bazen markdown formatında ```json blokları olmadan dönüyor, bazen de ekstra metinlerle dönüyor.
- **REPAIR:** Çeşitli regex'ler denendi.
- **TEST:** 2 defa üst üste FAIL (SlopScore > 60 ve Parse error).
- **VERIFY:** Modelin cevabı stabilize edilemedi. Sistem otonom olarak **STUCK** durumuna geçti. Uzmana WebRTC bağlantısı açıldı. (Bkz. `BRIDGE.md`)
