# 🏆 Nokta Leaderboard

Otomatik puanlama: `.github/scripts/score.py` rubric ile her submission'a 0–110 arası skor verir. Anti-slop + APK düzeltmesi dahil. "Çılgınlık +10" bonusu demo gününde elden eklenecek.

**Rubric (Challenge 1 - Away Mission):** Delivery 35 + Scope 25 + Anti-Slop 20 + Trace 20 + APK (±3/−5) = 110 max.

**Rubric (Challenge 2 - Audit-Forge):** Aynı temel puanlama geçerlidir. Ancak `FORGE.md` dosyası eksikse Engineering Trace otomatik olarak **0** puanlanır. `audit-reports/` altında en az 3 adet `.md` raporu yoksa Çalışır Teslim puanından **-10** düşülür.

---

## ☄️ Challenge 1: Away Mission

### Top Contributors
| Rank | Contributor | Best Score | Submissions | Best PR |
|---|---|---|---|---|
| — | — | — | — | — |

### All Submissions
| Rank | Submission | Score | Delivery | Scope | Anti-Slop | Trace | APK | Author | PR | Flags |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `2026-05-05-hoop` | **11** | 3/35 | 0/25 | 13/20 | 0/20 | −5 ❌ | — | — | ⚠️ similarity |

---

## 🛠️ Challenge 2: Audit-Forge Mission

### Top Contributors
| Rank | Contributor | Best Score | Submissions | Best PR |
|---|---|---|---|---|
| — | — | — | — | — |

### All Submissions
| Rank | Submission | Score | Delivery | Scope | Anti-Slop | Trace | APK | Author | PR | Flags |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `231118098-tohum` | **93** | 25/35 | 25/25 | 20/20 | 20/20 | +3 ✅ | — | — |  |

---

## Anti-Slop (Similarity ≥ 0.80)

TF-IDF cosine similarity; `.github/scripts/similarity_check.py` detayını üretir. Daha geç commit eden "copycat" sayılır ve anti-slop puanı %35 ceza alır.

| Original | Copycat | Similarity |
|---|---|---|
| `231118098-tohum` | `2026-05-05-hoop` | **0.832** |

---

**Last Updated:** 2026-05-20 21:41 UTC

**Total Contributors:** 0

**Total Submissions (Challenge 1):** 1

**Total Submissions (Challenge 2):** 1

**Similarity flags:** 1


🤖 Otomatik üretildi — kaynak: `scoring/scores.json` + `gh pr list --state merged`. Manuel "Çılgınlık +10" bonusu eklenmedi.
