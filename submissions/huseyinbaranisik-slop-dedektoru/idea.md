# Slop Dedektörü — Özelleşmiş Fikir (Track C)

## Seçilen Track: Track C (Otonomi ve İnsan-AI Köprüsü)

### Fikir (Pitch)
**"Slop Dedektörü"** — Yatırımcıların karşılaştığı girişim (startup) fikirlerini, sahte, aşırı abartılmış veya "slop" (kalitesiz AI üretimi) metinlerden arındırıp risk skorlaması (Slop Score) yapan bir platform. Yapay zeka ile yatırım sunumlarındaki iddiaları analiz eder ve kanıtsız/boş iddiaları tespit eder. 

### Problem
Melek yatırımcılar ve VC'ler her gün yüzlerce girişim başvurusu almaktadır. Bu başvuruların çoğu artık ChatGPT gibi araçlarla "şişirilmiş", büyük vaatlerde bulunan ancak somut temeli olmayan "slop" metinlerden oluşmaktadır. Bu durum zaman kaybına ve hatalı değerlendirmelere yol açmaktadır.

### Kullanıcı
Melek yatırımcılar, Venture Capital analistleri, teknokent değerlendirme kurulları ve girişimcilik ekosistemindeki mentörler.

### Kapsam (Scope)
- Kullanıcının girişim fikrini sesli dikte etmesi (mikrofon üzerinden) veya PDF yüklemesi.
- AI destekli metin analizi ile "Slop Score" (0-100) hesaplanması.
- Tespit edilen şüpheli iddiaların (claims) altının çizilmesi ve neden slop olduğunun açıklanması.
- Uygulama içi otonom ajan (Forge) döngüsü.

### Kısıtlar (Constraints)
- Gerçek zamanlı ses analizi gerektirdiğinden düşük gecikme (<200ms) hedeflenmektedir.
- Kullanıcıların hızlıca analiz yapabilmesi için üyelik gerektirmeyen (veya basit mock) giriş yapısı.
- Analiz modelinin (Gemini 1.5 Flash) context window sınırları içinde kalınması.
