# Bug Raporu — Nokta Audit-Forge

**Tarih:** 14.05.2026 21:38
**Toplam:** 1 not · 🔴 1 açık · ✅ 0 düzeltildi
**Raporlayan:** qa-221118054

> Bu rapor `@xtatistix/mobile-audit` widget'ı ile CreateIdeaScreen üzerinde
> üretildi. Burn-in'li ekran görüntüsü sarı kutu ile işaretli bölgeyi
> içerir — forge cycle için visual ground truth.

---

## Ekran: CreateIdeaScreen

### 🔴 #1 — Boş formda "Kaydet" butonu aktif görünüyor

![Screenshot — CreateIdeaScreen, Kaydet butonu](./assets/audit-3-create.png)

> **Burn-in seçim:** Form boşken yeşil "Kaydet" butonu sarı kutuyla
> işaretlendi — buton tam opak/tıklanabilir görünüyor.

- **Durum:** Açık
- **Ekran:** CreateIdeaScreen
- **Bileşen ipucu:** `app/create.tsx` → `styles.submitBtn` + `handleSubmit`
- **Zaman:** 14.05.2026 21:38
- **Raporlayan:** qa-221118054

**Not (insan dili):**
Yeni fikir formunda başlık ve özet alanları boşken bile "Kaydet" butonu tam
parlak ve aktif görünüyor. Kullanıcı basıyor, sonra "Eksik alan" uyarısı
çıkıyor — bu kötü bir deneyim. Buton, form geçersizken görsel olarak soluk
(disabled) görünmeli; kullanıcı basmadan önce anlamalı.

**Beklenen davranış:**
Başlık veya özet boşken "Kaydet" butonu yarı saydam (opacity düşük) ve
`disabled` durumda olmalı. Her iki alan da doluyken normal parlaklığa
dönmeli.
