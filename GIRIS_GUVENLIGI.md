# Gerçek giriş ve yapılandırma — F57

Bu PR GitHub `main` dalının `7b927a7` sürümündeki sahte giriş akışını kaldırır. `feature/payment-system` dalı bu paketle güncellenmez; o dalın ödeme/kredi sorunları ayrı bulgulardır. Dağıtılacak dal ile bu PR'ın kaynak eşleşmesi doğrulanmadan dal değiştirilmemelidir.

Supabase yapılandırması eksik veya geçersizse e-posta/parola, kayıt ve Google girişi kapalı kalır. Parola doğrulanmadan yerel kullanıcı veya sabit yönetici oluşturulmaz. Sahte bir demo oturumu açan yeni bayrak eklenmemiştir. Giriş ekranında Türkçe kullanılabilirlik mesajı görünür.

Eski `zm_local_user` kaydı başlangıçta kaldırılır ve kullanıcı kimliği için okunmaz. `zm_auth_changed` özel tarayıcı olayı oturum açmaz. Kimlik durumu yalnız SDK oturum olayından sonra `getUser(access_token)` ile kimlik hizmetinden doğrulanır; SDK'daki yerel kullanıcı nesnesi tek başına yeterli değildir. Dönen kullanıcı kimliği oturumla eşleşmelidir. Çıkış olayı, yeni oturum veya bileşenin kapanmasından sonra geciken eski doğrulama sonucu kullanıcıyı geri getiremez. Auth callback içinde başka bir SDK çağrısı beklenmez; doğrulama dışarıda çalıştırılır.

## Coolify ve Supabase kurulumu

1. Coolify uygulamasının Vite **derleme** ortamına `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` ekleyin. Eski kurulumlarda `VITE_SUPABASE_ANON_KEY` altında yalnız `anon` JWT anahtarı uyumluluk için kabul edilir. Örnek dosyada gerçek değer yoktur.
2. `sb_secret_...` veya `service_role` anahtarını tarayıcı değişkenine koymayın. Kod bu anahtar türleriyle Auth istemcisi açmaz; ancak Vite'ın başka şekilde pakete alınabilecek bir sırrı temizlediği iddia edilmez. Daha önce gerçek bir sır yayımlanmışsa Supabase'de ayrıca iptal edilmelidir.
3. Supabase Auth panelinde Google sağlayıcısı ve uygulamanın HTTPS dönüş adresi mevcut projenize göre tanımlanmalıdır. Yanlış adres veya gerçek hizmet hatası yerel kullanıcıya çevrilmez. E-posta doğrulaması gereken kayıtta kullanıcıya bağlantıyı açması söylenir.
4. Vite değişkenleri çalışma sırasında değil derlemede okunur. Ortam değişikliğinden sonra yeniden derleyip doğru commit ile dağıtın. Bu çalışmada gerçek proje ayarı, hesap, parola veya dağıtım değiştirilmedi.

Yönetici ekranının mevcut e-posta listesi yalnız kullanıcı arayüzü davranışıdır; sunucu yetkilendirmesi veya RLS yerine geçmez. Main dalındaki kredi/alışveriş ve yönetici listelerinin yerel demo veri modeli bu PR ile sunucu muhasebesine taşınmaz; F56 açık kalır. Üretim verisi erişimi sunucu/RLS kurallarıyla ayrıca sınırlandırılmalıdır.

## Doğrulama

`npm run test:auth-security` gerçek kilitli Supabase SDK ve derlenmiş kaynak modüllerini kurgusal HTTP yanıtlarıyla kontrol eder. Yapılandırma yokken bütün giriş yolları, eski tarayıcı kaydı, doğrulama hatası, sahte e-posta, geç gelen yanıt, çıkış ve abonelik temizliği sınanır. React'ın ilk çıktısı gerçek React DOM sunucu render'ı ile kontrol edilir. Gerçek Supabase/Google hesabına istek gönderilmez; gerçek tarayıcı tıklaması ve canlı Coolify kabulü değildir.

Giriş kapsamı `npx tsc --noEmit -p tsconfig.auth-security.json` ile kontrol edilir; Vite üretim derlemesi de çalıştırılır. Tam `tsc --noEmit` video/gazete bileşenlerinde beş mevcut hata bildirir: iki video çağrısındaki giriş/çıktı tipi ve gazetenin yedek dönem tanımındaki eksik görsel alanı. Bu dosyalar bu PR'da değiştirilmez; tam TypeScript kontrolü geçti sayılmaz. SDK HTTP fixture'larında otomatik zamanlayıcı yenilemesi kapalıdır; gerçek token yenileme ve kopyalanmış erişim JWT'sinin iptali ayrıca sınanmalıdır.

[Supabase getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [oturum olayları](https://supabase.com/docs/reference/javascript/auth-onauthstatechange) ve [tarayıcı API anahtarları](https://supabase.com/docs/guides/getting-started/api-keys) bu SDK sözleşmelerini açıklar. Güncel [değişiklik listesi](https://supabase.com/changelog.md) de uygulama öncesi kontrol edildi.
