# Afet / Kriz Noktası (Track A dilimi)

*Bu belge, NOKTA vizyonunun **Track A — Dot Capture & Enrich** teslimi için özelleştirilmiştir. Kapsam: afet ve kriz anında ortaya çıkan dağınık yardım / koordinasyon fikirlerini, mühendislik sorularıyla olgunlaştırıp **tek sayfalık kriz kullanım senaryosu spesifikasyonuna** dönüştüren mobil dilim.*

---

## 1. Tez

Kriz anında en kritik kaynak hızlı kod üretmek değil; **doğru bağlamda, doğrulanabilir ve operasyonel** bir tasarıma indirgenebilmiş fikirdir. **Afet / Kriz Noktası**, ham “noktayı” (bir cümlelik ihtiyaç veya hipotez) **senaryo, offline önceliği, güvenilir kaynak, ölçek ve uyum** eksenlerinde sorularla disipline eder; çıktısı jenerik metin değil, **tek sayfa kullanım senaryosu spec’idir**.

---

## 2. Problem

- **Dağınık giriş:** WhatsApp, saha notu, toplantı çıktısı aynı fikri farklı dillere çevirir; ekip ve kurumlar ortak bir “tek doğru taslak”ta buluşamaz.
- **Bağlantı ve güven:** Krizde ağ kesilir; “çevrimiçi varsayan” slop ürün fikirleri sahada çöker. Kaynağı belirsiz bilgi ise zarar verir.
- **Ölçek ve uyum:** Pilot ile ülke geneli, KVKK ve resmi veri hatları aynı paragrafta karıştırıldığında yatırım ve entegrasyon riski artar.

Bu dilim, tam platformu kurmak yerine **fikri erken aşamada mühendislik diline çevirerek** bu sürtünmeyi azaltmayı hedefler.

---

## 3. Nasıl çalışır (mobil uygulama)

1. **Yakalama:** Kullanıcı ham fikri **metin** olarak girer veya (isteğe bağlı, API ile) **ses** kaydını metne çevirir.
2. **Engineering-guided sorular (5 adet):** Senaryo ve tetikleyici; offline öncelikleri; güvenilir kaynak ve doğrulama; ölçek ve yayılım; kısıtlar ve uyum (KVKK, erişilebilirlik, bütçe vb.).
3. **Artifact:** Yanıtlar **tek sayfalık kriz kullanım senaryosu spec** olarak birleştirilir; panoya kopyalanabilir.
4. **Anti-slop:** Yapılandırılmış şablon ve düşük sıcaklıklı model ayarı; veri yoksa “Tanımsız — sahada doğrulanmalı” ile açık bırakma.

---

## 4. Ne yapmaz

- Canlı afet yönetimi, resmi ihbar hattı veya navigasyon ürünü iddiası taşımaz.
- Tek başına “sohbet eden fikir üreticisi” değildir; soru seti ve spec şablonu **zorunludur**.
- Sosyal medya taraması, pazar yeri veya NDA’lı QA (NOKTA’nın geniş vizyonu) bu teslim kapsamında **yoktur**; sadece **Track A dilimi** vardır.

---

## 5. Kim fayda sağlar

- **Saha ve gönüllü koordinatörleri:** Dağınık ihtiyacı hızlıca ortak dile çevirir.
- **Kurum içi inovasyon ekipleri:** Pilot brief’ini tek sayfada sabitler.
- **Ürün / mühendislik:** “Mutlu yol” ve offline/güven eksenleri erken görünür hale gelir.

---

## 6. Özet

**Afet / Kriz Noktası**, NOKTA’nın “fikri artifact’a çevir” tezinin **dar, ölçülebilir** bir mobil kesitidir: **yakala → 5 mühendislik sorusu → tek sayfa kriz kullanım senaryosu spec**. Tam NOKTA ekosisteminin geri kalanı bu dilimin üzerine inşa edilebilecek katmanlardır.
