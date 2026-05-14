# IDEA: Duyarlı Nokta (Sentient Dot)

## Use Case Özeti
Bu senaryoda müşteri, uygulamanın merkezindeki "nokta"nın statik ve cansız olduğundan şikayet ediyor. Müşteri (aynı zamanda bir geliştirici gözüyle), bu noktanın uygulamanın "kalbi" olması gerektiğini ve kullanıcıyla etkileşime girmesi gerektiğini savunuyor.

## Müşteri-Geliştirici Pitch
"Uygulamadaki nokta şu an sadece bir görsel. Ancak 'Nokta' ismiyle bu kadar özdeşleşmiş bir uygulamada, bu noktanın yaşayan bir organizma gibi davranmasını istiyorum. Örneğin, kaydedilmemiş bir fikir olduğunda nokta hafifçe 'pulse' (nabız) animasyonu yapmalı. Eğer uygulama bir veri işliyorsa rengi değişmeli. Bu, sadece bir görsel geliştirme değil; uygulamanın durumunu (state) kullanıcıya sessizce ileten bir feedback mekanizmasıdır."

Bu yaklaşım, audit raporu üzerinden agent'a "burada bir animasyon eksik" demek yerine "burada bir durum iletimi eksik, şu state'e bağlı şu animasyonu ekle" şeklinde bir feature request olarak döner. Forge döngüsü, bu soyut isteği somut bir animasyon bileşenine ve state bağlamına dönüştürür.
