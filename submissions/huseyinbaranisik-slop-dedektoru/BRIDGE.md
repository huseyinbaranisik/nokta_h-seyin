# BRIDGE.md - Uzman Görüşmesi Özeti (Expert Call)

**Tarih:** 27 Mayıs 2026
**Bağlantı Türü:** WebRTC (Jitsi Meet)
**Süre:** 04:32

## Olayın Arka Planı (STUCK Durumu)
Uygulama arka arkaya 2 defa başarısız analiz (FAIL) veya parse hatası aldıktan sonra otonom olarak `ExpertCall` bileşenini tetikledi. Jitsi altyapısı kullanılarak uygulama içi görüntülü köprü açıldı.

## Görüşme Transkripti (Özet)
**Agent / Geliştirici:** Merhaba, Groq Llama 3.3 modelini kullanırken sürekli JSON parse hatası alıyoruz. Regex ile JSON bloklarını temizlemeye çalışıyoruz ama model bazen format dışına çıkıyor, ne yapabiliriz?
**Uzman (Sınıf Arkadaşı):** Merhaba, ekranı görebilir miyim?
*(Ekran paylaşımı açıldı)*
**Uzman:** API isteği atarken prompt'un sonuna "Please output ONLY valid JSON without any markdown formatting or explanation" yazdınız mı? Ayrıca Groq API'sinde response format parametresini destekliyorsa kullanabilirsiniz.
**Agent / Geliştirici:** Hayır, prompt içerisinde sadece "JSON dön" demiştik. Dediklerinizi ekleyelim.
**Uzman:** Ayrıca regex kullanmak yerine parse bloğunu bir try-catch içine alıp, hata durumunda default bir "FAIL" json'ı dönmesini sağlayabilirsiniz, böylece uygulama çökmez.
**Agent / Geliştirici:** Teşekkürler, prompt'u güncelliyorum ve fallback ekliyorum. Görüşmeyi sonlandırıyorum.

## Çözüm ve Sonraki Cycle'a Aktarım (Context Feed)
- **Yeni Prompt Kuralı:** `You must return ONLY a raw JSON object. Do not include markdown formatting like ```json or any other text.`
- **Hata Yönetimi:** `analyzer.ts` içerisindeki parse işlemi try-catch ile sarıldı ve yedek JSON eklendi.
- **Sonuç:** Değişiklikler uygulandıktan sonra sistem stabil çalışmaya başladı. STUCK durumu çözüldü.
