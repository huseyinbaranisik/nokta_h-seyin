# Bug Raporu — Nokta Audit-Forge

**Tarih:** 14.05.2026 21:52
**Toplam:** 1 not · 🔴 1 açık · ✅ 0 düzeltildi
**Raporlayan:** qa-221118054

> Bu rapor `@xtatistix/mobile-audit` widget'ı ile OnboardingScreen üzerinde
> üretildi. Burn-in'li ekran görüntüsü sarı kutu ile işaretli bölgeyi
> içerir — forge cycle için visual ground truth.

---

## Ekran: OnboardingScreen

### 🔴 #1 — İlerleme noktaları sola yapışık

![Screenshot — OnboardingScreen, ilerleme noktaları](./assets/audit-4-onboarding.png)

> **Burn-in seçim:** Tanıtım metninin altındaki üç ilerleme noktası (dots)
> sarı kutuyla işaretlendi — noktalar ekranın soluna yapışık duruyor.

- **Durum:** Açık
- **Ekran:** OnboardingScreen
- **Bileşen ipucu:** `app/onboarding.tsx` → `styles.dots`
- **Zaman:** 14.05.2026 21:52
- **Raporlayan:** qa-221118054

**Not (insan dili):**
Onboarding ekranındaki ilerleme noktaları (hangi adımda olduğumu gösteren
küçük çizgiler) ekranın sol kenarına yapışık. Bunlar ekranın ortasında
olmalı — şu an dengesiz duruyor, tasarım bozuk görünüyor.

**Beklenen davranış:**
İlerleme noktaları yatayda ekranın ortasında hizalanmalı. Dikey düzen
(hero bloğu ile buton arası boşluk) aynen korunmalı — sadece yatay
ortalama gerekiyor.
