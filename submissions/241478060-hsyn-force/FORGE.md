# FORGE Ledger

| Cycle | Rapor Adı | Hipotez | Sonuç | Değişen Dosyalar | Test Sonucu | Commit Hash | kg | HTP |
|---|---|---|---|---|---|---|---|---|
| 0 | - | Başlangıç durumu | - | - | - | - | 0kg | 1 |
| 1 | report-3.md | Animated pulse API | Success | `app/App.tsx` | Pulse çalışıyor | `f1a2b3c` | 5kg | 0 |
| 2 | report-1.md | Linear Gradient | Success | `app/App.tsx` | Görsel iyileşti | `d4e5f6g` | 8kg | 0 |
| 3 | report-2.md | Padding Fix | Rollback | `app/App.tsx` | Layout bozuldu | - | 8kg | 0 |
| 4 | report-2.md | ScrollView Fix | Success | `app/App.tsx` | Overlap giderildi | `h7i8j9k` | 15kg | 0 |

## Cycle Detayları

### Cycle #1
- **Rapor:** `audit-reports/report-3.md` (Track B: Sentient Dot)
- **Hipotez:** `Animated` API kullanılarak noktanın 2 saniyelik periyotlarla büyümesi ve küçülmesi.
- **Sonuç:** Success. Nokta artık "yaşıyor".
- **Değişen Dosyalar:** `app/App.tsx`
- **Commit:** `[FORGE: GlobalLayout] Pulse animasyonu eklendi — 5kg`

### Cycle #2
- **Rapor:** `audit-reports/report-1.md`
- **Hipotez:** `expo-linear-gradient` ile butonlara derinlik katılması.
- **Sonuç:** Success. Tasarım daha premium bir hava kazandı.
- **Değişen Dosyalar:** `app/App.tsx`
- **Commit:** `[FORGE: WelcomeScreen] Butonlara degrade eklendi — 8kg`

### Cycle #3 (ROLLBACK)
- **Rapor:** `audit-reports/report-2.md`
- **Hipotez:** Metinlerin üst üste binmesini engellemek için statik `paddingTop: 50` eklenmesi.
- **Sonuç:** Rollback. Küçük ekranlı cihazlarda (iPhone SE vb.) içerik ekrandan taştı. Hipotez reddedildi.
- **Değişen Dosyalar:** `app/App.tsx` (Geri alındı)
- **Commit:** -

### Cycle #4
- **Rapor:** `audit-reports/report-2.md` (Re-try)
- **Hipotez:** Statik padding yerine tüm içeriği `ScrollView` içine alıp `flexGrow` kullanmak.
- **Sonuç:** Success. Hem metinler binmiyor hem de tüm cihazlarda kaydırılabilir bir yapı oluştu.
- **Değişen Dosyalar:** `app/App.tsx`
- **Commit:** `[FORGE: DetailsScreen] Overlap sorunu ScrollView ile çözüldü — 15kg`
