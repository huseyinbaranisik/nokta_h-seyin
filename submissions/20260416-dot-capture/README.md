# Nokta: Dot Capture - Sinir Ağı Modeli

## Track Seçimi: Track A — Dot Capture & Enrich
Bu projede Track A seçilmiş ve klasik yazılı (text-dump) formülünün ötesine geçilmiştir. Kullanıcıdan uzun bir paragraf girmesini beklemek yerine uygulamaya "Agentic" (otonom ajan) bir yapı kazandırılmış, kullanıcının sadece anahtar kelimeleri attığı ve bu kelimelerden bir **Canlı Sinir Ağı (Obsidian benzeri Node Graph)** oluşturulan interaktif bir deneyim kurgulanmıştır.

## Expo QR Kodu
> [Lütfen uygulamanızı Expo'da publish edip QR Linkini Buraya Yapıştırın]

## 60 Saniye Demo Video
> [Lütfen ekran kaydı videonuzun YouTube veya Drive linkini buraya yapıştırın]

## Decision Log (Karar Günlüğü)
- **Tasarım Dili (Ethereal Amethyst):** Standart karanlık mod UI kalıpları yıkıldı. Bunun yerine derin siyah üzerine parlayan Mor ve Camgöbeği tonlarında (Neon/Glassmorphism) fütüristik bir "Zihin Sarayı" estetiğine geçildi.
- **Node Graph (Sıfır Bağımlılık):** Ağ bağlantıları (çizgiler) ve hareketli noktalar, ağır SVG kütüphaneleri kullanılmadan yalnızca React Native'in yerleşik bileşenleri, trigonometri (Math.atan2, Pythorean teorem) ve Animated API ile geliştirildi. Böylece çok daha performanslı ve "Native" hissettiren bir akış elde edildi.
- **Oto-Genişleme Makinesi (Mock Sözlük):** Kelimelerin birbirine bağlanması tamamen rastgele değil, belirli bir Mock sözlüğü (ör: araba -> galeri, ikinci el -> değerleme) üzerinden otomatik önerilerle (Suggestion Nodes) bağların genişletilmesi sağlandı.
- **Çarpışma Engelleme (Collision Detection):** Nöronların uzay boşluğundaki konumları hesaplanırken üst üste binmemesi için Öklid mesafesi hesaplayan kural tabanlı bir algoritma eklendi.
- **Insight Ekranı (X-Ray):** Uygulamanın bir "kara kutu" olmasını engellemek adına, ağı analiz edip kullanıcıya detaylarını (tez, ürün fikri, riskler) transparan bir şekilde sunan yepyeni bir ara katman (InsightScreen) tasarlandı.
- **Human in the Loop (Hiyerarşik Eskalasyon - HOOP):** Uygulama mimarisi "Yaratıcı AI" (Mascot) ve "Profesyonel İnsan" (HOOP) olarak ikiye ayrıldı. Maskot artık direkt olarak **CaptureScreen (Ağ ekranı)** içine bir yol arkadaşı olarak entegre edildi. `idea.md` dökümanı oluştuktan sonra ise ciddi bir profesyonel denetim için HOOP üzerinden "Uzman Mentor" portalına geçiş sağlandı. Bu sayede tasarım dili ve kullanıcı amacı (Intent) daha net bir hale getirildi.

## AI Tool Log
Bu projenin geliştirilme sürecinde aşağıdaki yapay zeka araçları ve yöntemleri kullanılmıştır:
- **Gemini CLI (Interactive Agent):** Projenin tüm mimari tasarımı, kodlama süreci (React Native), PanResponder ile draggable maskot etkileşimi ve `expo-speech` hata ayıklama süreçleri Gemini CLI üzerinden otonom ve interaktif bir şekilde yürütülmüştür.
- **Karpathy/Autoresearch Felsefesi:** Kod yazımında "Yapay Zeka bir araç değil, bir iş ortağıdır" vizyonuyla hareket edilmiş; prompt mühendisliği yerine bağlamsal (context-aware) kod üretimi tercih edilmiştir.
- **Expo SDK:** Uygulamanın hızlı prototiplenmesi ve deploy edilmesi için kullanılmıştır.

