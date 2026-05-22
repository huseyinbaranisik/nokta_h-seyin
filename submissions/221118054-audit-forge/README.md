Track: A

# Nokta Audit-Forge — 221118054

> **Track A — Sadelik (drop-in primitive disiplini)**
> En az ek koda en geniş etki. `nokta-audit` widget'ı host uygulamaya tek
> mount satırıyla gömülür; kaldırıldığında uygulama bozulmadan çalışır.

---

## Özet

İki repo, iki rol, bir kapalı döngü:

1. **Phase A** — `@xtatistix/mobile-audit` widget'ı 5 ekranlı bir mini nokta
   klonuna drop-in entegre edildi. 3 farklı ekrandan burn-in'li `.md` audit
   raporu üretildi.
2. **Phase B** — Üretilen raporlar Claude Code'a input verilerek
   `READ → LOCATE → HYPOTHESIZE → REPAIR → TEST → VERIFY → COMMIT/ROLLBACK`
   forge döngüsü koşturuldu: **3 başarılı + 1 rollback** cycle, hepsi
   `FORGE.md` ledger'ında.

---

## Drop-in disiplini (Track A kanıtı)

Widget'ın host uygulamaya değdiği **tüm yüzey** üç dosyadan ibaret:

| Dosya | Rol |
|---|---|
| `app/_layout.tsx` | Tek `<AuditWidget />` mount satırı |
| `src/audit/auditDeps.ts` | Native yeteneklerin `deps` bundle'ı |
| `src/audit/auditStorage.ts` | `AuditStorage` adaptörü (AsyncStorage) |

```bash
# Drop-in tersi testi:
grep -rn 'AuditWidget' app/
# → app/_layout.tsx içinde TEK mount satırı döner.
```

Mount satırı silinirse 5 ekranın hiçbiri bozulmaz — widget tamamen
host application boundary'nin dışında yaşar.

---

## Demo

- **Expo QR / link:** `cd app && npm install && npx expo start`
- **Demo video (≤60 sn):** https://youtube.com/shorts/xz237wWkMiM
- **APK:** `app-release.apk` (kök submission klasöründe)

---

## Uygulama yapısı

```
app/
├── app/
│   ├── _layout.tsx     Kök ağaç + AuditWidget tek mount
│   ├── index.tsx       IdeaListScreen   — fikir listesi
│   ├── detail.tsx      IdeaDetailScreen — fikir detayı
│   ├── create.tsx      CreateIdeaScreen — yeni fikir formu
│   ├── onboarding.tsx  OnboardingScreen — tanıtım akışı
│   └── about.tsx       AboutScreen      — hakkında
└── src/
    ├── audit/
    │   ├── auditDeps.ts     deps factory
    │   └── auditStorage.ts  AsyncStorage adaptörü
    └── data/
        └── ideas.ts         mock fikir verisi
```

---

## Decision Log

| # | Karar | Gerekçe |
|---|---|---|
| 1 | Track A seçildi | Drop-in disiplini önceki submission'lardaki minimal yaklaşımla tutarlı; widget kaldırılabilir kalmalı |
| 2 | `@xtatistix/mobile-audit` paketi npm'den kuruldu | nokta-audit deposunu submodule yerine paket olarak almak host boundary'yi netleştirir |
| 3 | `deps` ayrı dosyada (`auditDeps.ts`) toplandı | Tüm native bağımlılık tek noktada; `_layout.tsx` temiz kalır |
| 4 | `currentScreen` Expo Router `useSegments()` ile besleniyor | README § Kullanım: host router'dan dinamik beslenmeli |
| 5 | 4 kasıtlı UX bug'ı koduna gömüldü | Forge cycle'larına gerçek, izlenebilir input sağlamak için (her bug `BUG-N` yorumuyla işaretli) |
| 6 | Forge cycle'larında minimal diff disiplini | Track A: tek dosya, tek değişiklik, tek test — "fırsattan istifade" refactor yok |
| 7 | 1 cycle bilinçli ROLLBACK | Spec ≥1 rollback istiyor; başarısız hipotez değerli veri, FORGE.md'de loglu |

---

## Human Touch Points

Phase B boyunca agent kaç kez durdurulup yönlendirildi:

| # | Cycle | An | Neden |
|---|---|---|---|
| 1 | Cycle 0 (kurulum) | Claude Code başlatma | Forge döngüsü insan tarafından tetiklenir (spec: widget tek başına loop çalıştırmaz) |
| 2 | Cycle 4 | Rollback kararı | Agent'ın hipotezi testi kırdı; rollback insan onayıyla yapıldı |

**Toplam human touch points: 2** (her ikisi de spec gereği zorunlu müdahale —
tetikleme + rollback onayı).

---

## Kullanılan AI Tool Log

| Cycle | Tool | Sonuç |
|---|---|---|
| Cycle 1 | Claude Code CLI | success |
| Cycle 2 | Claude Code CLI | success |
| Cycle 3 | Claude Code CLI | success |
| Cycle 4 | Claude Code CLI | rollback |

Tek tool kullanıldı (Claude Code CLI); rate limit'e takılmadı, backup tool
gerekmedi.

---

## Self-check

- [x] `README.md` ilk satırında `Track: A`
- [x] `app/` altında çalışır Expo projesi + audit widget mount
- [x] `audit-reports/` altında 3 burn-in'li `.md` rapor
- [x] `FORGE.md` ledger: 3 başarılı + 1 rollback cycle
- [x] `app-release.apk` mevcut
- [x] Decision log + human touch points + AI tool log README'de
- [x] Root dizine dokunulmadı (yalnızca `submissions/221118054-audit-forge/`)
