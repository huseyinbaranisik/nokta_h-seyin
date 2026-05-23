# Bug Raporu — Nokta Audit-Forge

**Tarih:** 14.05.2026 21:10
**Toplam:** 1 not · 🔴 1 açık · ✅ 0 düzeltildi
**Raporlayan:** qa-221118054

> Bu rapor `@xtatistix/mobile-audit` widget'ı ile IdeaListScreen üzerinde
> üretildi. Burn-in'li ekran görüntüsü sarı kutu ile işaretli bölgeyi
> içerir — forge cycle için visual ground truth.

---

## Ekran: IdeaListScreen

### 🔴 #1 — Oy sayısının ne olduğu belli değil

![Screenshot — IdeaListScreen, kart alt satırı](./assets/audit-1-idealist.png)

> **Burn-in seçim:** Kart alt satırındaki sağ köşede duran `42` sayısı sarı
> kutuyla işaretlendi.

- **Durum:** Açık
- **Ekran:** IdeaListScreen
- **Bileşen ipucu:** `app/index.tsx` → `renderItem` → `styles.votes`
- **Zaman:** 14.05.2026 21:10
- **Raporlayan:** qa-221118054

**Not (insan dili):**
Fikir kartlarının alt satırında sadece çıplak bir sayı görünüyor (örn. "42").
Bu sayının ne anlama geldiği belli değil — oy mu, yorum mu, görüntülenme mi?
Sayının yanında bir etiket olmalı, örneğin "42 oy". Track tag'i ("Track A")
zaten etiketli; oy sayısı da aynı netlikte olmalı.

**Beklenen davranış:**
Oy sayısı bir ikon veya "oy" kelimesi ile birlikte gösterilmeli, böylece
kullanıcı tek bakışta ne olduğunu anlamalı.
