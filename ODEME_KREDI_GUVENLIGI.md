# Ödeme ve kredi işlem güvenliği

Bu değişiklik `feature/payment-system` dalındaki F81, F82, F83 ve F84 bulgularını kapsar. Ana daldaki ayrı giriş düzeltmesiyle otomatik olarak birleşmiş sayılmaz.

İmzalı Checkout bildirimi, ödeme satırı kilitlendikten sonra saklanan kullanıcı, oturum, gizli bağlama değeri, EUR tutarı ve para birimiyle karşılaştırılır. Kredi miktarı ödeme başlatılırken paketten alınan sabit kayıttır. Kullanıcının gönderdiği fiyat ve kredi miktarı kullanılmaz. Kredi, aktivite, benzersiz ödeme makbuzu ve tamamlanma durumu aynı PostgreSQL işlemiyle yazılır; herhangi bir hata hepsini geri alır ve HTTP 500 bildirimin tekrar gönderilmesini sağlar. Aynı ödeme için farklı olay kimlikleri ve paralel bildirimler ikinci kredi yatırmaz.

Ödeme oturumu oluşturulduktan sonra veritabanına oturum kimliğinin yazımı aksarsa, Stripe'a önceden iletilmiş gizli bağlama değeri eşleşen imzalı bildirim aynı ödemeyi kurtarabilir. Bu değer kullanıcı API yanıtına veya loga yazılmaz. Ayrı istemci checkout isteklerinin birbirini tekrar etmesi için kullanıcı düzeyinde bir idempotency anahtarı henüz yoktur; her yeni istek ayrı ödeme kaydı oluşturabilir. Stripe istemcisinin aynı ödeme kaydı için otomatik yeniden denemesinde aynı sağlayıcı anahtarı kullanılır.

Kredi harcaması `credits >= 1` koşullu atomik güncellemedir. Aktivite kaydı aynı işlem içindedir. Tamamlanan ödeme eski süre dolma bildirimiyle başarısıza dönmez. Ödenmemiş tamamlanma bildirimi kredi vermez; daha sonra doğrulanmış ödeme bildirimi işlenebilir. Anahtarın bir bölümü, imza, ham gövde ve sağlayıcının ayrıntılı hata yanıtları loglanmaz veya kullanıcıya dönmez.

## Kapalı finansal geçiş

Bu PR üretim veritabanına uygulanmadı. Geçişten önce yedek alın, eski ödeme/kredi yazıcılarını durdurun ve mevcut ödemeleri Stripe ile mutabık hale getirin. `server/sql/payment-credit-transition.sql` ayrı bir işlemde uygulanır. `npm run migrate` kullanılmamalıdır: mevcut bootstrap ayrı davranışlar ve sabit yönetici hesabı içerir. SQL negatif veya eksik eski kredi bakiyesinde durur; bakiye, eski ödeme durumu ve eski kredi miktarları otomatik değiştirilmez.

Eski kayıtlar sürüm 1 olarak kalır. Paket miktarı veya ödeme sonucu tahmin edilerek bunlara yeniden kredi verilmez; bu kayıtların yeni bildirimleri HTTP 500 ve kapalı mutabakat gerektirir. Oturum, gerçek tahsilat ve önce verilmiş kredi kontrol edilmeden sürüm 2'ye çevrilmemelidir. SQL tamamlanmadan geçiş işareti oluşmaz ve yeni checkout/kredilendirme kapalı kalır. Tabloları uygulama rolünden farklı bir rol oluşturursa yalnız sunucu rolüne gerekli izinler ayrıca verilmelidir; yeni finansal tablolar PUBLIC erişimine açılmaz.

Dağıtımda yalnız bu ödeme dalı ve geçiş birlikte ele alınmalı; ana dal için hazırlanmış ayrı giriş PR'ıyla uyumu ayrıca incelenmelidir. Eski kod çalışmaya devam ederken yeni finansal kayıtlar oluşturulmamalıdır. Geçiş SQL'i yeniden çalıştırılabilir; eski ödeme ve bakiyeler korunur.

## Doğrulama

Test komutu: sunucu klasöründe yalnız kurgusal, yerel `codex_zaman_` veritabanı URL'si (`sslmode=disable`) ve `CODEX_ZAMAN_TEST_ALLOW=1` ile `npm run test:payment-security`. Testler şemayı sıfırlar; gerçek veritabanında çalıştırılmamalıdır. Runner gerçek `.env` dosyalarını reddeder, sağlayıcı anahtarlarını kurgusal değerlerle değiştirir ve dış ağ bağlantısını engeller. Stripe HTTP ve TCMB XML yanıtları kurgusaldır; Express route, JWT, Stripe SDK imza doğrulaması, PostgreSQL satır kilidi, transaction ve hata tetikleyicileri gerçektir.

Yerel PostgreSQL 14 üzerinde 30 test geçti. Sekiz regresyonun tamamı SHA doğrulanmış eski kaynakta başarısız oldu; sekiz paralel bildirim eski kodda 10 yerine 20 kredi yatırdı. Sabit eski kaynak ve düzeltme için tam sunucu TypeScript derlemesi geçti. GitHub CI aynı testleri PostgreSQL 17 ile çalıştırır.

Gerçek Stripe tahsilatı, OAuth, kur hizmeti, e-posta, Coolify ve üretim kullanıcı arayüzü bu kaynak düzeltmesinde çalıştırılmadı. Yönetici bootstrap parolası, Google hesap birleştirme politikası, PostgreSQL TLS doğrulaması, tüm yönetici kredi yazımları ve görsel üretiminin başarısızlık/iade politikası ayrı kapsamdır.
