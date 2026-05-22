# Bug Raporu — Nokta Audit-Forge

**Tarih:** 14.05.2026 21:24
**Toplam:** 1 not · 🔴 1 açık · ✅ 0 düzeltildi
**Raporlayan:** qa-221118054

> Bu rapor `@xtatistix/mobile-audit` widget'ı ile IdeaDetailScreen üzerinde
> üretildi. Burn-in'li ekran görüntüsü sarı kutu ile işaretli bölgeyi
> içerir — forge cycle için visual ground truth.

---

## Ekran: IdeaDetailScreen

### 🔴 #1 — Özet metni kutu kenarına yapışık

![Screenshot — IdeaDetailScreen, özet kutusu](./assets/audit-2-detail.png)

> **Burn-in seçim:** "ÖZET" başlığının altındaki gri kutudaki metnin sol/sağ
> kenarı sarı kutuyla işaretlendi — metin kutu çerçevesine değiyor.

- **Durum:** Açık
- **Ekran:** IdeaDetailScreen
- **Bileşen ipucu:** `app/detail.tsx` → `styles.summary`
- **Zaman:** 14.05.2026 21:24
- **Raporlayan:** qa-221118054

**Not (insan dili):**
Fikir detayındaki özet metni kutunun içinde nefes alamıyor. Metnin sol ve sağ
kenarı doğrudan kutu çerçevesine değiyor; okuması rahatsız edici. Kutuda dikey
padding var ama yatay padding yok. Metin ile çerçeve arasında boşluk olmalı.

**Beklenen davranış:**
Özet kutusunun yatay iç boşluğu (paddingHorizontal) dikey boşlukla aynı
olmalı, böylece metin her yönden eşit boşlukla çevrelenmeli.
