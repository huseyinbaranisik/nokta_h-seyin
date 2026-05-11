# Proje Özeti: Nokta - Yapay Zeka Tabanlı Siber Güvenlik ve Olay Müdahale Asistanı

Bu proje, kullanıcıların günlük teknolojik sorularını yanıtlayan, ancak "SQL Injection", "Zararlı Yazılım", "Oltalama" gibi kriz anlarını otomatik olarak algılayıp kullanıcıyı anında alanında uzman bir **Beyaz Şapkalı Hacker / Olay Müdahale Uzmanı** simülasyonuna aktaran interaktif bir mobil asistan uygulamasıdır.

### ✨ Öne Çıkan Geliştirmeler ve Özellikler
- **Nokta Mascot Entegrasyonu:** React Native ortamına entegre edilen animasyonlu asistan arayüzü. Kriz anında arayüz dinamik olarak değişerek kullanıcının acil duruma geçtiğini görsel olarak da bildirir.
- **Dinamik Alan Tespiti ve Uzman Desteği (Human-in-the-Loop):** Sistem, gelen metni analiz ederek sorunun hangi siber güvenlik alanına (Örn: Ağ Güvenliği, Veritabanı Güvenliği) ait olduğunu tespit eder. Kullanıcıyı 5 saniyelik bir geçiş ile spesifik alan uzmanına aktarır.
- **Gelişmiş Sesli Etkileşim (Voice-to-Voice AI):** Kullanıcıya hem mesajla hem de **konuşarak** destek alma seçeneği sunulur. `Expo-AV` ve `Groq Whisper API` ile kullanıcının sesi metne çevrilir, yapay zekanın ürettiği olay müdahale protokolleri `Expo-Speech` ile yüksek sesle kullanıcıya okunur.
- **Güvenlik Odaklı Prompt Engineering:** Olay müdahale uzmanı profilinin rolden çıkmasını, kod yazmasını veya zararlı/ofansif hack taktikleri vermesini engellemek adına katı güvenlik kısıtlamaları (Prompt Guard) uygulanmıştır. Sistem yalnızca defansif (savunma) yönlendirmeleri yapar.
- **Native Android Build:** Proje, Expo altyapısı kullanılarak başarıyla derlenmiş ve test edilmiştir.

### 🎥 Demo Videosu
Uygulamanın siber kriz anını nasıl yönettiğini, uzman moduna geçişi ve sesli etkileşim özelliklerini gösteren demo videosu:
**[Demo Videoyu İzle (YouTube)](#)** *(Buraya kendi çekeceğin videonun linkini koymalısın)*

### 📱 Expo QR Kodu
> Proje Expo Go üzerinden yerel ağda sorunsuz çalışabilmektedir. Terminalde `npx expo start -c` komutu ile başlatabilirsiniz.

### 🛠 Kullanılan Teknolojiler & AI Araçları
- **Altyapı:** React Native, Expo, React Native Safe Area Context
- **Yapay Zeka (LLM & STT):** Groq API (Llama-3.3-70b-versatile), Groq Whisper (whisper-large-v3)
- **Ses ve Medya:** Expo Speech (Text-to-Speech), Expo AV (Audio Recording)
- **Geliştirme Desteği:** Mimari kurgu, asenkron ses sorunlarının çözümü ve arayüz entegrasyonu süreçlerinde AI araçları etkin olarak kullanılmıştır.

### 📦 Uygulama APK Dosyası
Projenin Android için derlenmiş çalışabilir APK dosyasına aşağıdaki bağlantıdan ulaşabilirsiniz:
🔗 **[Nokta Uygulamasını İndir (Google Drive)](#)** *(Buraya APK linkini ekleyebilirsin)*

### 📝 Decision Log (Tasarım Kararları)
1. **İki Aşamalı Ses Yönetimi:** iOS cihazlardaki donanımsal mikrafon kısıtlamalarını aşmak için, ses kaydı bittiği an sistem zorla medya hoparlörüne (Speaker Mode) geçirilerek yapay zekanın sesinin gür çıkması sağlandı.
2. **Toggle Kayıt Sistemi:** "Bas-Konuş" mantığı yerine, asenkron hataları (çift tetiklenme) önlemek adına "Dokun Başlasın, Dokun Bitsin" mantığı tercih edildi.
3. **Güvenlik Duvarı:** AI modelinin siber güvenlik asistanı rolündeyken prompt injection saldırılarına maruz kalmaması için sistem yönergeleri defansif eylemlerle sınırlandırıldı.