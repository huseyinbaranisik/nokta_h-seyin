# 231118023 - StoryForge (Nokta Yazar Asistanı)

## Track Seçimi
**Track A — Dot Capture & Enrich**

Bu proje, Track A'nın "mühendislik spec'i oluşturma" mantığını, "yaratıcı senaryo ve hikaye spec'i (Story Bible) oluşturma" alanına uyarlar. Kullanıcının ham hikaye fikri alınır, AI tarafından sorularla genişletilir ve yapılandırılmış bir doküman üretilir.

Ayrıca "Hoop" (İnsan Uzman Devri ve Writeback) simülasyonu projeye entegre edilmiştir.

## Karar Günlüğü (Decision Log)
1. **Mimari & UI:** Mobilde akıcı bir deneyim için "Hikayelerim", "Sohbet" ve "Doküman" olmak üzere üçlü sekme (tab) yapısı kuruldu. `KeyboardAvoidingView` ve `app.json` ayarlarıyla klavye deneyimi optimize edildi.
2. **AI Entegrasyonu (Groq API):** Projeye Groq API (`llama-3.3-70b-versatile`) doğrudan entegre edildi. Yapay zeka, kullanıcının fikrine göre **dinamik** sorular üretir ve son adımda profesyonel bir Senaryo İskeleti yazar.
3. **Hoop Bonusu (Uzman Devri & Writeback):** Uzman görüşmesi simülasyonu eklendi. Kullanıcı butona bastığında, Groq API o hikayenin en zayıf noktasını tespit edip **dinamik** bir uzman tavsiyesi üretir. Görüşme bitince bu tavsiye doğrudan dokümana (Writeback) kalıcı olarak işlenir.
4. **Çoklu Proje & Kurgu Yönetimi:** Kullanıcının birden fazla hikaye oluşturabilmesi sağlandı. Ayrıca oluşturulan dokümanın (Spec) hem **manuel olarak (yazı kutusu ile)** hem de **Nokta AI ile sohbet ederek** değiştirilebilmesi (Edit) özelliği eklendi.

## Kurulum ve Çalıştırma
```bash
cd app
npm install
npx expo start
```

## Teslim Bileşenleri
- [x] `idea.md` (Özelleşmiş fikir dosyası)
- [x] `app/` (Expo projesi)
- [x] `app-release.apk` (Derlenmiş APK eklendi)
- [x] **Demo Video:** [YouTube üzerinden izle](https://youtube.com/shorts/jCe-x0BJ4jg?feature=share)
- [x] **APK İndirme Linki:** [EAS Build üzerinden indir](https://expo.dev/artifacts/eas/57tFcsAAUcF5unT4cPZfJa.apk)
