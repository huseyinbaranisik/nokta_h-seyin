# 🔨 FORGE.md — Forge Cycle Ledger

> Nokta Audit-Forge · Öğrenci 221118054 · Track A
>
> Karpathy autoresearch ratchet loop:
> `READ → LOCATE → HYPOTHESIZE → REPAIR → TEST → VERIFY → COMMIT/ROLLBACK`
>
> Her cycle 15 dakika ile kutulu. Başarısız hipotezler de loglanır —
> ratchet disiplini başarısızlığı veri sayar.

---

## Ledger özeti

| Cycle | Rapor | Hipotez sonucu | Değişen dosya | Test | Commit | kg | HTP |
|---|---|---|---|---|---|---|---|
| 1 | audit-1-idealist.md | ✅ success | `app/index.tsx` | pass | `a8f875e` | 5 | 0 |
| 2 | audit-2-detail.md | ✅ success | `app/detail.tsx` | pass | `347978f` | 5 | 0 |
| 3 | audit-3-create.md | ✅ success | `app/create.tsx` | pass | `66e2f59` | 10 | 0 |
| 4 | audit-4-onboarding.md | ⏪ rollback | `app/onboarding.tsx` | **fail** | — (rollback) | 0 | 1 |

**Toplam ağırlık (kg):** 20 · **Başarılı:** 3 · **Rollback:** 1
**Toplam human touch points:** 1 (Cycle 4 rollback onayı)

> Ratchet kanıtı: kg monoton — 5 → 10 → 20 → 20. Rollback cycle kg eklemedi
> ama hipotezi loglandı; sonraki cycle aynı hatayı tekrar etmez.

---

## Cycle 1 — IdeaListScreen: oy etiketi

**Rapor:** `audit-reports/audit-1-idealist.md`
**Süre:** 15dk kutulu · ~8dk'da tamamlandı
**Tool:** Claude Code CLI

### READ
Audit raporu okundu. Not: kart alt satırındaki çıplak `42` sayısının ne
olduğu belirsiz. Burn-in seçim oy sayısını işaretliyor.

### LOCATE
Ekran adı `IdeaListScreen` → `app/index.tsx`. Bileşen ipucu `renderItem`
fonksiyonu ve `styles.votes`. `BUG-1` yorumu doğrulandı (satır içi).

### HYPOTHESIZE
- **H1:** `<Text style={styles.votes}>{item.votes}</Text>` satırına " oy"
  suffix'i eklenirse sayı anlam kazanır. Minimal diff, tek satır.

### REPAIR
`app/index.tsx` içinde:
```diff
- <Text style={styles.votes}>{item.votes}</Text>
+ <Text style={styles.votes}>{item.votes} oy</Text>
```
`BUG-1` yorumu kaldırıldı.

### TEST
`npx tsc --noEmit` → pass. ESLint → pass. Uygulama Expo'da yeniden yüklendi,
liste ekranı hatasız render edildi.

### VERIFY
Yeniden ekran görüntüsü alındı; burn-in'li raporun işaretlediği bölgede artık
"42 oy" görünüyor. Kullanıcı notundaki "yanında bir etiket olmalı" beklentisi
karşılandı.

### COMMIT
```
[FORGE: IdeaListScreen] Oy sayısına "oy" etiketi eklendi — 5kg
```
Commit hash: `a8f875e`

---

## Cycle 2 — IdeaDetailScreen: özet yatay padding

**Rapor:** `audit-reports/audit-2-detail.md`
**Süre:** 15dk kutulu · ~6dk'da tamamlandı
**Tool:** Claude Code CLI

### READ
Not: detay ekranındaki özet metni kutu kenarına yapışık; yatay padding yok.

### LOCATE
`IdeaDetailScreen` → `app/detail.tsx`. Bileşen ipucu `styles.summary`.
`BUG-2` yorumu doğrulandı: `summary` stilinde `paddingVertical: 14` var ama
`paddingHorizontal` yok.

### HYPOTHESIZE
- **H1:** `styles.summary`'ye `paddingHorizontal: 14` eklenirse metin her
  yönden eşit boşlukla çevrelenir. Dikey padding zaten 14, simetri için
  aynı değer.

### REPAIR
`app/detail.tsx` içinde:
```diff
  summary: {
    ...
    paddingVertical: 14,
+   paddingHorizontal: 14,
    ...
  },
```
`BUG-2` yorumu kaldırıldı.

### TEST
`npx tsc --noEmit` → pass. ESLint → pass. Detay ekranı yeniden render edildi.

### VERIFY
Yeniden ekran görüntüsü; burn-in'li bölgede metin artık kutu çerçevesinden
14px içeride. Kullanıcı notundaki "metin nefes alamıyor" şikayeti giderildi.

### COMMIT
```
[FORGE: IdeaDetailScreen] Özet kutusuna yatay padding eklendi — 5kg
```
Commit hash: `347978f`

---

## Cycle 3 — CreateIdeaScreen: disabled buton durumu

**Rapor:** `audit-reports/audit-3-create.md`
**Süre:** 15dk kutulu · ~12dk'da tamamlandı
**Tool:** Claude Code CLI

### READ
Not: boş formda "Kaydet" butonu aktif görünüyor; kullanıcı basıp uyarı
yiyor. Buton form geçersizken soluk (disabled) görünmeli.

### LOCATE
`CreateIdeaScreen` → `app/create.tsx`. Bileşen ipucu `styles.submitBtn` +
`handleSubmit`. `BUG-3` yorumu doğrulandı: buton koşulsuz aktif render
ediliyor.

### HYPOTHESIZE
- **H1:** `title` ve `summary` state'lerinden bir `isValid` türetilir;
  buton `disabled={!isValid}` alır ve geçersizken `opacity: 0.5` stili
  uygulanır. Layout fix + davranış değişikliği — feature ağırlığında.

### REPAIR
`app/create.tsx` içinde:
```diff
+ const isValid = title.trim().length > 0 && summary.trim().length > 0;
  ...
- <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
+ <TouchableOpacity
+   style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
+   onPress={handleSubmit}
+   disabled={!isValid}
+ >
  ...
+ submitBtnDisabled: { opacity: 0.5 },
```
`BUG-3` yorumu kaldırıldı.

### TEST
`npx tsc --noEmit` → pass. ESLint → pass. Form ekranı yeniden render edildi;
boş formda buton soluk + tıklanamaz, alanlar dolunca parlak + aktif.

### VERIFY
Yeniden ekran görüntüsü (boş form); burn-in'li bölgede buton artık yarı
saydam. Dolu form ekran görüntüsünde buton normal parlaklıkta. Kullanıcı
beklentisi karşılandı.

### COMMIT
```
[FORGE: CreateIdeaScreen] Kaydet butonuna disabled state eklendi — 10kg
```
Commit hash: `66e2f59`

---

## Cycle 4 — OnboardingScreen: dot hizalama (ROLLBACK)

**Rapor:** `audit-reports/audit-4-onboarding.md`
**Süre:** 15dk kutulu · ~11dk'da rollback kararı
**Tool:** Claude Code CLI

> Bu cycle bilinçli olarak loglanmış bir **ROLLBACK** örneğidir. Spec ≥1
> rollback istiyor. Başarısız hipotez silinmedi — ratchet disiplini gereği
> veri olarak burada tutuluyor.

### READ
Not: onboarding ilerleme noktaları (dots) sola yapışık; ortada olmalı.

### LOCATE
`OnboardingScreen` → `app/onboarding.tsx`. Bileşen ipucu `styles.dots`.
`BUG-4` yorumu doğrulandı: `dots` container'ında `justifyContent` yok.

### HYPOTHESIZE
- **H1:** `styles.dots`'a `justifyContent: 'center'` eklemek noktaları
  ortalar.
- **H2 (denenmedi):** `dots` container'ına `alignSelf: 'center'` eklemek.

### REPAIR (H1)
`app/onboarding.tsx` içinde `dots` stiline ek olarak `flex: 1` de eklendi
(agent, dikey hizalamayı da "düzeltmek" istedi — kapsam dışı dokunuş):
```diff
  dots: {
    flexDirection: 'row',
+   justifyContent: 'center',
+   flex: 1,
    marginBottom: 32,
  },
```

### TEST
`npx tsc --noEmit` → pass.
**Manuel kontrol → FAIL:** `flex: 1` eklenmesi `dots` container'ını dikeyde
genişletti; hero bloğu ile "Devam" butonu arası boşluk bozuldu, noktalar
ekranın ortasına kaydı. Layout regresyonu — mevcut görsel düzen kırıldı.

### VERIFY
Yeniden ekran görüntüsü; burn-in'li bölgedeki sorun (yatay hizalama) kısmen
düzeldi ama `flex: 1` yeni bir görsel bozulma yarattı. Ratchet kuralı 1:
"yeni fix mevcut düzeni kıramaz" → ihlal.

### ROLLBACK
```
git checkout -- app/onboarding.tsx
```
H1'in kapsam dışı `flex: 1` dokunuşu nedeniyle rollback yapıldı.

**Human touch point #1:** Rollback kararı insan onayıyla verildi — agent
"flex:1'i de kaldırıp tekrar deneyeyim mi?" diye sordu; bu cycle'ı kapatıp
temiz bir cycle'da yeniden ele almak tercih edildi (15dk kutusu disiplini).

**Öğrenilen (sonraki cycle'lar için):** Onboarding dot hizalaması yalnızca
`justifyContent: 'center'` ile yapılmalı; `flex: 1` EKLENMEMELİ. Bu not
gelecek cycle'ın aynı hatayı tekrar etmesini önler.

### Sonuç
Cycle ROLLBACK ile kapandı. kg eklenmedi. Bug hâlâ açık — temiz bir sonraki
cycle'da yalnız `justifyContent` ile minimal diff olarak ele alınacak.

---

## Ratchet notu

Cycle 4'ün başarısızlığı ledger'dan silinmedi. Karpathy ratchet disiplini:
başarısız hipotez bir sonraki cycle için bilgi birikimidir. Cycle 5 (gelecek)
artık `flex: 1` tuzağını biliyor — aynı hata tekrar edilmeyecek.

Monoton kg ilerleyişi: `5 → 10 → 20 → 20` (rollback düşürmedi, sadece
artıramadı). Ratchet hiç geriye düşmedi.
