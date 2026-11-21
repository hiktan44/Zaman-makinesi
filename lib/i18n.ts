/**
 * Arayüz çeviri sözlüğü (tr / en).
 *
 * - `tr` metinleri koddaki orijinal Türkçe ile birebir aynıdır.
 * - Yapay zekâya giden istemler, API alanları, log mesajları ve veritabanı içeriği çevrilmez.
 */

export type Lang = 'tr' | 'en';

type Entry = { tr: string; en: string };

// Geçerli dil (React dışı kodlar — alert/confirm/canvas/servis hataları — için).
// use-lang.ts tarafından güncellenir.
let currentLang: Lang = 'tr';
export function getLang(): Lang {
  return currentLang;
}
export function setCurrentLang(lang: Lang): void {
  currentLang = lang;
}

const DICT: Record<string, Entry> = {
  // --- Ortak ---
  'common.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
  'common.login': { tr: 'Giriş Yap', en: 'Log In' },
  'common.logout': { tr: 'Çıkış Yap', en: 'Log Out' },
  'common.credit': { tr: 'Kredi', en: 'Credits' },
  'common.creditUnit': { tr: 'kredi', en: 'credits' },
  'common.toggleTheme': { tr: 'Toggle theme', en: 'Toggle theme' },
  'common.error': { tr: 'Bir hata oluştu', en: 'Something went wrong' },
  'common.unknownError': { tr: 'Bilinmeyen bir hata oluştu.', en: 'An unknown error occurred.' },
  'common.langTitle': { tr: 'Language / Dil', en: 'Language / Dil' },

  // --- Üst menü ---
  'header.title': { tr: 'Zaman Makinesi Fotoğrafları', en: 'Time Machine Photos' },
  'header.credits': { tr: '💎 {n} Kredi', en: '💎 {n} Credits' },
  'header.buyCredits': { tr: 'Kredi Yükle', en: 'Add Credits' },
  'header.gallery': { tr: 'Galeri', en: 'Gallery' },
  'header.faq': { tr: 'SSS', en: 'FAQ' },
  'header.admin': { tr: 'Admin Paneli', en: 'Admin Panel' },

  // --- Alt bilgi ---
  'footer.madeBy': { tr: 'THIRDHAND AI tarafından yapılmıştır.', en: 'Made by THIRDHAND AI.' },
  'footer.visit': { tr: "www.thirdhand.com.tr'yi ziyaret edebilirsiniz", en: 'Visit www.thirdhand.com.tr' },
  'footer.whatsapp': { tr: 'WhatsApp ile iletişime geç', en: 'Contact us on WhatsApp' },

  // --- Tanıtım sayfası ---
  'intro.nav.features': { tr: 'Özellikler', en: 'Features' },
  'intro.nav.about': { tr: 'Hakkında', en: 'About' },
  'intro.nav.start': { tr: 'Şimdi Başla', en: 'Start Now' },
  'intro.hero.title': { tr: 'Anılarınızı Zamanda Yolculuğa Çıkarın', en: 'Take Your Memories on a Journey Through Time' },
  'intro.hero.subtitle': {
    tr: 'Geçmişe ait bir fotoğrafınızı yükleyin, on yılı seçin ve sihrin gerçekleşmesini izleyin.',
    en: 'Upload a photo from your past, pick a decade and watch the magic happen.',
  },
  'intro.hero.cta': { tr: 'Uygulamayı Dene', en: 'Try the App' },
  'intro.how.title': { tr: 'Üç Basit Adımda Zamanda Yolculuk', en: 'Time Travel in Three Simple Steps' },
  'intro.how.subtitle': {
    tr: 'Geçmişe gitmek hiç bu kadar kolay olmamıştı. Sadece üç basit adımı izleyin ve fotoğraflarınızın on yıllar boyunca dönüşümünü izleyin.',
    en: 'Traveling to the past has never been this easy. Just follow three simple steps and watch your photos transform across the decades.',
  },
  'intro.how.step1.title': { tr: '1. Yükle', en: '1. Upload' },
  'intro.how.step1.desc': {
    tr: 'Yeniden hayal etmek istediğiniz bir fotoğrafı cihazınızdan seçin.',
    en: 'Choose a photo from your device that you want to reimagine.',
  },
  'intro.how.step2.title': { tr: '2. On Yıl Seç', en: '2. Pick a Decade' },
  'intro.how.step2.desc': {
    tr: "1920'lerden 2000'lere kadar geniş bir yelpazeden bir on yıl seçin.",
    en: 'Choose a decade from a wide range, from the 1920s to the 2000s.',
  },
  'intro.how.step3.title': { tr: '3. Keşfet', en: '3. Discover' },
  'intro.how.step3.desc': {
    tr: 'Yapay zekanın fotoğrafınızı o dönemin tarzına dönüştürmesini izleyin.',
    en: "Watch AI transform your photo into the style of that era.",
  },
  'intro.features.title': { tr: 'Temel Özellikler', en: 'Key Features' },
  'intro.features.subtitle': {
    tr: 'Zaman Makinesi Fotoğrafları, anılarınızı yeniden keşfetmeniz için güçlü ve kullanımı kolay araçlar sunar.',
    en: 'Time Machine Photos offers powerful, easy-to-use tools to help you rediscover your memories.',
  },
  'intro.features.f1.alt': { tr: 'Zaman Yolculuğu Örneği', en: 'Time Travel example' },
  'intro.features.f1.title': { tr: 'Zaman Yolculuğu', en: 'Time Travel' },
  'intro.features.f1.desc': {
    tr: "Fotoğraflarınızın 1920'lerden 2000'lere kadar farklı dönemlerde nasıl görüneceğini keşfedin.",
    en: 'See how your photos would look in different eras, from the 1920s to the 2000s.',
  },
  'intro.features.f2.alt': { tr: 'İnteraktif Arayüz Örneği', en: 'Interactive interface example' },
  'intro.features.f2.title': { tr: 'İnteraktif Arayüz', en: 'Interactive Interface' },
  'intro.features.f2.desc': {
    tr: 'Sadece birkaç tıklama ile yaratıcılığınızı ortaya çıkarın. Kullanıcı dostu arayüzümüzle kolayca gezinin.',
    en: 'Unleash your creativity with just a few clicks. Navigate with ease thanks to our user-friendly interface.',
  },
  'intro.features.f3.alt': { tr: 'İndirme ve Paylaşım Örneği', en: 'Download and sharing example' },
  'intro.features.f3.title': { tr: 'İndirme ve Paylaşım', en: 'Download and Share' },
  'intro.features.f3.desc': {
    tr: 'Oluşturduğunuz görselleri yüksek kalitede indirin ve arkadaşlarınızla sosyal medyada paylaşın.',
    en: 'Download the images you create in high quality and share them with your friends on social media.',
  },
  'intro.features.f4.alt': { tr: 'Gerçekçi Dönüşüm Örneği', en: 'Realistic transformation example' },
  'intro.features.f4.title': { tr: 'Gerçekçi Dönüşüm', en: 'Realistic Transformation' },
  'intro.features.f4.desc': {
    tr: 'Yapay zeka teknolojimiz ile fotoğraflarınızın dokusunu ve atmosferini o döneme uygun hale getirin.',
    en: 'Our AI technology adapts the texture and atmosphere of your photos to match the era.',
  },
  'intro.cta.title': { tr: 'Kendi Zaman Kapsülünüzü Yaratmaya Hazır mısınız?', en: 'Ready to Create Your Own Time Capsule?' },
  'intro.cta.subtitle': {
    tr: 'Geçmişe yolculuğa şimdi başlayın ve anılarınızı daha önce hiç görülmemiş bir şekilde yeniden yaşayın. Tek bir tıklama ile fotoğraflarınızı on yıllar öncesine taşıyın.',
    en: 'Start your journey to the past now and relive your memories like never before. With a single click, take your photos back several decades.',
  },
  'intro.cta.button': { tr: 'Geçmişe Yolculuğa Şimdi Başla!', en: 'Start Your Journey to the Past Now!' },

  // --- Giriş ekranı ---
  'login.subtitle': { tr: 'Devam etmek için giriş yapın', en: 'Log in to continue' },
  'login.backHome': { tr: '← Ana sayfaya dön', en: '← Back to home' },
  'login.email': { tr: 'E-posta', en: 'Email' },
  'login.emailPlaceholder': { tr: 'ornek@email.com', en: 'example@email.com' },
  'login.password': { tr: 'Şifre', en: 'Password' },
  'login.failed': { tr: 'İşlem başarısız', en: 'Operation failed' },
  'login.submitting': { tr: 'Giriş yapılıyor...', en: 'Logging in...' },
  'login.registering': { tr: 'Kayıt yapılıyor...', en: 'Signing up...' },
  'login.register': { tr: 'Kayıt Ol', en: 'Sign Up' },
  'login.noAccount': { tr: 'Hesabın yok mu? Kayıt ol', en: "Don't have an account? Sign up" },
  'login.haveAccount': { tr: 'Zaten hesabın var mı? Giriş yap', en: 'Already have an account? Log in' },
  'login.or': { tr: 'veya', en: 'or' },
  'login.google': { tr: 'Google ile Giriş Yap', en: 'Sign in with Google' },
  'login.unauthorized': { tr: 'Yetkisiz erişim', en: 'Unauthorized access' },

  // --- Ana uygulama ---
  'app.title': { tr: 'Zamanda Yolculuk', en: 'Journey Through Time' },
  'app.steps': {
    tr: '1. Fotoğraf Yükle → 2. Yılları Seç → 3. Yolculuğa Başla.',
    en: '1. Upload a Photo → 2. Pick the Years → 3. Start the Journey.',
  },
  'app.dropTitle': { tr: 'Fotoğrafını Buraya Sürükle ve Bırak', en: 'Drag and Drop Your Photo Here' },
  'app.dropHint': {
    tr: 'veya dosya seç. Kabul edilenler: JPG, PNG, maks 5MB.',
    en: 'or choose a file. Accepted: JPG, PNG, max 5MB.',
  },
  'app.uploadedAlt': { tr: 'Uploaded', en: 'Uploaded' },
  'app.changePhoto': { tr: 'Fotoğrafı Değiştir', en: 'Change Photo' },
  'app.uploadPhoto': { tr: 'Fotoğraf Yükle', en: 'Upload Photo' },
  'app.pickYears': { tr: 'Gideceğin Yılları Seç', en: 'Choose the Years to Visit' },
  'app.selectAll': { tr: 'Tümünü Seç', en: 'Select All' },
  'app.clear': { tr: 'Temizle', en: 'Clear' },
  'app.start': { tr: 'Zaman Yolculuğunu Başlat', en: 'Start the Time Journey' },
  'app.downloading': { tr: 'İndiriliyor...', en: 'Downloading...' },
  'app.downloadAlbum': { tr: 'Albümü İndir', en: 'Download Album' },
  'app.downloadAll': { tr: 'Tüm Resimleri İndir', en: 'Download All Images' },
  'app.reset': { tr: 'Başa Dön', en: 'Start Over' },
  'app.noAccess': { tr: 'Bu sayfaya erişim yetkiniz yok', en: "You don't have permission to access this page" },
  'app.needLogin': { tr: 'Giriş yapmanız gerekiyor', en: 'You need to log in' },
  'app.sessionExpired': { tr: 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.', en: 'Your session has expired. Please log in again.' },
  'app.invalidResponse': { tr: 'Sunucudan geçersiz yanıt alındı', en: 'Received an invalid response from the server' },
  'app.creditFailed': { tr: 'Kredi kullanılamadı', en: 'Could not use credits' },
  'app.insufficientCreditsN': {
    tr: 'Yetersiz kredi! Gereken: {need}, Mevcut: {have}. Lütfen kredi satın alın.',
    en: 'Insufficient credits! Required: {need}, Available: {have}. Please purchase credits.',
  },
  'app.insufficientCredits': { tr: 'Yetersiz kredi! Lütfen kredi satın alın.', en: 'Insufficient credits! Please purchase credits.' },
  'app.noImagesToDownload': { tr: 'İndirilecek oluşturulmuş resim yok.', en: 'There are no generated images to download.' },
  'app.addCreditConfirm': {
    tr: "Albüm resimlerinin alt köşesine 'zamanmakinesi.app tarafından oluşturuldu' yazısı eklensin mi?",
    en: "Add the text 'created by zamanmakinesi.app' to the bottom corner of the album images?",
  },
  'app.albumError': {
    tr: 'Üzgünüz, albümünüz oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.',
    en: 'Sorry, an error occurred while creating your album. Please try again.',
  },
  'app.downloadError': {
    tr: 'Üzgünüz, resimler indirilirken bir hata meydana geldi. Lütfen tekrar deneyin.',
    en: 'Sorry, an error occurred while downloading the images. Please try again.',
  },

  // --- Fotoğraf kartı ---
  'card.retryTitle': { tr: 'Tekrar denemek için tıkla', en: 'Click to try again' },
  'card.retry': { tr: 'Tekrar Dene', en: 'Try Again' },
  'card.upload': { tr: 'Fotoğraf Yükle', en: 'Upload Photo' },
  'card.download': { tr: '{caption} için resmi indir', en: 'Download image for {caption}' },
  'card.regenerate': { tr: '{caption} için resmi yenile', en: 'Regenerate image for {caption}' },

  // --- Albüm görseli (canvas) ---
  'album.title': { tr: 'zamanmakinesi.app ile oluşturuldu', en: 'Created with zamanmakinesi.app' },
  'album.subtitle': { tr: 'zamanmakinesi.app üzerinde', en: 'on zamanmakinesi.app' },
  'album.credit': { tr: 'zamanmakinesi.app tarafından oluşturuldu', en: 'Created by zamanmakinesi.app' },

  // --- Görsel üretim servisi hataları ---
  'gemini.invalidImage': { tr: 'Geçersiz resim formatı.', en: 'Invalid image format.' },
  'gemini.textInstead': {
    tr: 'Yapay zeka model bir resim yerine metin ile yanıt verdi: "{text}..."',
    en: 'The AI model replied with text instead of an image: "{text}..."',
  },
  'gemini.failedBoth': {
    tr: 'Yapay zeka modeli resim oluşturamadı. Lütfen tekrar deneyin. (Detay: {detail})',
    en: 'The AI model could not create the image. Please try again. (Detail: {detail})',
  },
  'gemini.failed': {
    tr: 'Resim oluşturulurken bir hata oluştu: {detail}',
    en: 'An error occurred while creating the image: {detail}',
  },
  'gemini.quota': {
    tr: 'Günlük kullanım limitine ulaşıldı. Lütfen daha sonra tekrar deneyin.',
    en: 'The daily usage limit has been reached. Please try again later.',
  },
  'gemini.server': { tr: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.', en: 'A server error occurred. Please try again.' },
  'gemini.safety': { tr: 'Güvenlik filtresi nedeniyle resim oluşturulamadı.', en: 'The image could not be created because of the safety filter.' },
  'gemini.noImage': { tr: 'Model görüntü üretemedi.', en: 'The model could not produce an image.' },
  'gemini.unexpected': { tr: 'Beklenmedik bir hata oluştu.', en: 'An unexpected error occurred.' },

  // --- Fiyatlandırma ---
  'pricing.loginRequired': { tr: 'Satın almak için giriş yapmalısınız', en: 'You need to log in to make a purchase' },
  'pricing.checkoutFailed': { tr: 'Ödeme oluşturulamadı', en: 'Could not create the payment' },
  'pricing.title': { tr: 'Kredi Paketleri', en: 'Credit Packages' },
  'pricing.subtitle': {
    tr: 'Görsel üretmeye devam etmek için kredi satın alın. Her görsel üretimi 1 kredi harcar.',
    en: 'Buy credits to keep generating images. Each image generation uses 1 credit.',
  },
  'pricing.popular': { tr: 'En Popüler', en: 'Most Popular' },
  'pricing.redirecting': { tr: 'Yönlendiriliyor...', en: 'Redirecting...' },
  'pricing.buy': { tr: 'Satın Al', en: 'Buy Now' },
  'pricing.secure': { tr: 'Güvenli ödeme ile Stripe', en: 'Secure payment with Stripe' },
  'pricing.info.title': { tr: '💡 Ödeme Bilgileri', en: '💡 Payment Information' },
  'pricing.info.1': { tr: '• Ödemeler EUR cinsinden yapılmaktadır', en: '• Payments are made in EUR' },
  'pricing.info.2': { tr: '• Güncel TCMB kuru kullanılarak TRY fiyatlara çevrilir', en: '• TRY prices are converted using the current CBRT exchange rate' },
  'pricing.info.3': { tr: '• Ödeme başarılı olduğunda krediler otomatik yüklenir', en: '• Credits are added automatically once the payment succeeds' },
  'pricing.info.4': { tr: '• Krediler süresiz kullanılabilir', en: '• Credits never expire' },

  // --- Ödeme sonucu ---
  'pay.success.title': { tr: 'Ödeme Başarılı!', en: 'Payment Successful!' },
  'pay.success.subtitle': { tr: 'Kredileriniz başarıyla hesabınıza yüklendi.', en: 'Your credits have been added to your account.' },
  'pay.success.refreshing': { tr: 'Bakiye güncelleniyor...', en: 'Updating your balance...' },
  'pay.success.balance': { tr: 'Güncel Bakiyeniz:', en: 'Your current balance:' },
  'pay.success.start': { tr: 'Görsel Üretmeye Başla', en: 'Start Creating Images' },
  'pay.success.more': { tr: 'Daha Fazla Kredi Satın Al', en: 'Buy More Credits' },
  'pay.info': { tr: 'Bilgi', en: 'Info' },
  'pay.success.info.1': { tr: '• Kredileriniz anında hesabınıza yüklenmiştir', en: '• Your credits have been added to your account instantly' },
  'pay.success.info.2': { tr: '• Kredileriniz hiçbir surette zaman aşımına uğramaz', en: '• Your credits never expire under any circumstances' },
  'pay.success.info.3': { tr: '• Her görsel üretimi 1 kredi harcar', en: '• Each image generation uses 1 credit' },
  'pay.success.info.4': { tr: '• Ödeme detaylarınızı profilinizden görüntüleyebilirsiniz', en: '• You can view your payment details in your profile' },
  'pay.cancel.title': { tr: 'Ödeme İptal Edildi', en: 'Payment Cancelled' },
  'pay.cancel.subtitle': { tr: 'Ödeme işleminiz iptal edildi. Herhangi bir ücret alınmadı.', en: 'Your payment was cancelled. You have not been charged.' },
  'pay.cancel.note': { tr: 'Endişelenmeyin! Kredi satın almayı isterseniz, tekrar deneyebilirsiniz.', en: "Don't worry! You can try again if you'd like to buy credits." },
  'pay.cancel.back': { tr: 'Kredi Satın Almaya Dön', en: 'Back to Buying Credits' },
  'pay.cancel.home': { tr: 'Ana Sayfaya Dön', en: 'Back to Home' },
  'pay.cancel.info.1': { tr: '• İptal edilen ödemelerden herhangi bir ücret alınmaz', en: '• You are not charged for cancelled payments' },
  'pay.cancel.info.2': { tr: '• Kredi satın almayı isterseniz tekrar deneyebilirsiniz', en: '• You can try again if you want to buy credits' },
  'pay.cancel.info.3': { tr: '• Ödeme ile ilgili herhangi bir sorun yaşarsanız destek ekibimizle iletişime geçin', en: '• If you have any problem with the payment, please contact our support team' },

  // --- Yönetim paneli ---
  'admin.title': { tr: 'Admin Paneli', en: 'Admin Panel' },
  'admin.tab.dashboard': { tr: 'Dashboard', en: 'Dashboard' },
  'admin.tab.users': { tr: 'Kullanıcılar', en: 'Users' },
  'admin.tab.activities': { tr: 'Aktiviteler', en: 'Activities' },
  'admin.tab.payments': { tr: 'Ödemeler', en: 'Payments' },
  'admin.tab.settings': { tr: 'Ayarlar', en: 'Settings' },
  'admin.stat.users': { tr: 'Toplam Kullanıcı', en: 'Total Users' },
  'admin.stat.credits': { tr: 'Toplam Kredi Üretimi', en: 'Total Credits Generated' },
  'admin.stat.revenue': { tr: 'Toplam Gelir (TRY)', en: 'Total Revenue (TRY)' },
  'admin.stat.payments': { tr: 'Aktif Ödemeler', en: 'Active Payments' },
  'admin.recent': { tr: 'Son Aktiviteler', en: 'Recent Activities' },
  'admin.col.user': { tr: 'Kullanıcı', en: 'User' },
  'admin.col.action': { tr: 'İşlem', en: 'Action' },
  'admin.col.description': { tr: 'Açıklama', en: 'Description' },
  'admin.col.date': { tr: 'Tarih', en: 'Date' },
  'admin.col.email': { tr: 'E-posta', en: 'Email' },
  'admin.col.credit': { tr: 'Kredi', en: 'Credits' },
  'admin.col.registered': { tr: 'Kayıt Tarihi', en: 'Registered' },
  'admin.col.actions': { tr: 'İşlemler', en: 'Actions' },
  'admin.col.status': { tr: 'Durum', en: 'Status' },
  'admin.usersTitle': { tr: 'Kullanıcılar ({n})', en: 'Users ({n})' },
  'admin.search': { tr: 'Ara...', en: 'Search...' },
  'admin.refresh': { tr: 'Yenile', en: 'Refresh' },
  'admin.addCredits': { tr: 'Kredi', en: 'Credits' },
  'admin.delete': { tr: 'Sil', en: 'Delete' },
  'admin.prev': { tr: 'Önceki', en: 'Previous' },
  'admin.next': { tr: 'Sonraki', en: 'Next' },
  'admin.page': { tr: 'Sayfa {n}', en: 'Page {n}' },
  'admin.activitiesTitle': { tr: 'Aktiviteler', en: 'Activities' },
  'admin.filter.all': { tr: 'Tümü', en: 'All' },
  'admin.filter.pending': { tr: 'Bekleyen', en: 'Pending' },
  'admin.filter.completed': { tr: 'Tamamlandı', en: 'Completed' },
  'admin.filter.failed': { tr: 'Başarısız', en: 'Failed' },
  'admin.settingsTitle': { tr: 'Sistem Ayarları', en: 'System Settings' },
  'admin.freeCredits': { tr: 'Ücretsiz Kredi (Kayıt Olunca)', en: 'Free Credits (On Sign-Up)' },
  'admin.packagePrices': { tr: 'Paket Fiyatları', en: 'Package Prices' },
  'admin.pkgCredits': { tr: '{n} Kredi', en: '{n} Credits' },
  'admin.active': { tr: '• Aktif', en: '• Active' },
  'admin.inactive': { tr: '• Pasif', en: '• Inactive' },
  'admin.priceTry': { tr: 'Fiyat (TRY)', en: 'Price (TRY)' },
  'admin.update': { tr: 'Güncelle', en: 'Update' },
  'admin.saveSettings': { tr: 'Ayarları Kaydet', en: 'Save Settings' },
  'admin.confirmDelete': { tr: 'Bu kullanıcıyı silmek istediğinizden emin misiniz?', en: 'Are you sure you want to delete this user?' },
  'admin.userDeleted': { tr: 'Kullanıcı başarıyla silindi', en: 'User deleted successfully' },
  'admin.deleteError': { tr: 'Silme hatası', en: 'Delete error' },
  'admin.promptAmount': { tr: 'Kredi miktarı:', en: 'Credit amount:' },
  'admin.promptReason': { tr: 'Sebep:', en: 'Reason:' },
  'admin.addError': { tr: 'Ekleme hatası', en: 'Add error' },
  'admin.creditsAdded': { tr: 'Kredi başarıyla eklendi', en: 'Credits added successfully' },
  'admin.updateError': { tr: 'Güncelleme hatası', en: 'Update error' },
  'admin.settingsUpdated': { tr: 'Ayarlar güncellendi', en: 'Settings updated' },
  'admin.packageUpdated': { tr: 'Paket fiyatı güncellendi', en: 'Package price updated' },
  'admin.apiError': { tr: 'API hatası', en: 'API error' },

  // --- Sayfa üstbilgisi (statik HTML'i çalışma zamanında günceller) ---
  'meta.title': { tr: 'Zaman Makinesi Fotoğrafları', en: 'Time Machine Photos' },
  'meta.description': {
    tr: 'Fotoğraflarınızı farklı dönemlerin estetiğiyle yeniden yorumlayan yapay zekâ destekli Zaman Makinesi deneyimi.',
    en: 'An AI-powered Time Machine experience that reimagines your photos in the aesthetics of different eras.',
  },
  'meta.ogDescription': {
    tr: 'Fotoğraflarınızı farklı dönemlerin estetiğiyle yeniden yorumlayın.',
    en: 'Reimagine your photos in the aesthetics of different eras.',
  },
  'meta.siteDescription': {
    tr: 'Yapay zekâ destekli yaratıcı görsel deneyim platformu.',
    en: 'An AI-powered creative visual experience platform.',
  },
  'meta.ogLocale': { tr: 'tr_TR', en: 'en_US' },

  // --- Yasal sayfa bağlantıları (index.html alt bilgisi) ---
  'legal.privacy': { tr: 'Gizlilik ve KVKK', en: 'Privacy and KVKK' },
  'legal.terms': { tr: 'Kullanım Koşulları', en: 'Terms of Use' },
  'legal.cookies': { tr: 'Çerez Politikası', en: 'Cookie Policy' },
  'legal.contact': { tr: 'İletişim', en: 'Contact' },
};

// Yasal sayfa bağlantıları: Türkçe adresler -> İngilizce sayfa adresleri
export const LEGAL_LINKS: Record<string, { key: string; en: string }> = {
  '/gizlilik/': { key: 'legal.privacy', en: '/en/privacy/' },
  '/kullanim-kosullari/': { key: 'legal.terms', en: '/en/terms/' },
  '/cerez-politikasi/': { key: 'legal.cookies', en: '/en/cookies/' },
  '/iletisim/': { key: 'legal.contact', en: '/en/contact/' },
};

/**
 * Çeviri döndürür. `{degisken}` yer tutucuları `vars` ile doldurulur.
 * Dil verilmezse geçerli (modül düzeyi) dil kullanılır.
 */
export function t(key: string, lang?: Lang, vars?: Record<string, string | number>): string {
  const entry = DICT[key];
  if (!entry) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  const text = entry[lang || currentLang] || entry.tr;
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (result, [k, v]) => result.split(`{${k}}`).join(String(v)),
    text
  );
}

/** React dışı kodlar için: geçerli dille çeviri. */
export function tn(key: string, vars?: Record<string, string | number>): string {
  return t(key, currentLang, vars);
}

export function pickByLang<T>(lang: Lang, tr: T, en: T): T {
  return lang === 'tr' ? tr : en;
}

/** Tarih/sayı biçimlendirme yereli. */
export function localeFor(lang: Lang): string {
  return lang === 'tr' ? 'tr-TR' : 'en-US';
}

// --- Sunucu hata mesajlarının istemci tarafı çevirisi ---
// Sunucu Türkçe hata metni döndürür; İngilizce arayüzde bilinen mesajlar burada eşlenir.
const SERVER_ERRORS: Record<string, string> = {
  'Sunucu hatası': 'Server error',
  'Giriş yapmanız gerekiyor': 'You need to log in',
  'Paket ID gereklidir': 'Package ID is required',
  'Paket bulunamadı': 'Package not found',
  'Kur dönüştürme hatası': 'Currency conversion error',
  'Stripe session oluşturma hatası': 'Could not create the Stripe checkout session',
  'Kullanıcı bulunamadı': 'User not found',
  'Admin kullanıcısı silinemez': 'Admin users cannot be deleted',
  'Kredi ve fiyat gereklidir': 'Credits and price are required',
  'Oturum bulunamadı': 'Session not found',
  'Kullanıcı ID ve miktar gereklidir': 'User ID and amount are required',
  'Kredi ekleme sırasında hata oluştu': 'An error occurred while adding credits',
  'Yetkisiz işlem': 'Unauthorized action',
  'Yetersiz kredi. Lütfen kredi satın alın.': 'Insufficient credits. Please purchase credits.',
  'Endpoint bulunamadı': 'Endpoint not found',
  'E-posta ve şifre gereklidir': 'Email and password are required',
  'Bu e-posta zaten kayıtlı': 'This email is already registered',
  'Kayıt sırasında hata oluştu': 'An error occurred during sign-up',
  'Geçersiz e-posta veya şifre': 'Invalid email or password',
  'Bu hesap Google ile oluşturuldu. Google ile giriş yapın.': 'This account was created with Google. Please sign in with Google.',
  'Giriş sırasında hata oluştu': 'An error occurred during login',
  'Google girişi başarısız': 'Google sign-in failed',
  'Oturum açılmadı veya süresi doldu': 'You are not logged in or your session has expired',
  'Bu işlem için yetkiniz yok': 'You are not authorized to perform this action',
};
const SERVER_ERROR_PREFIXES: Array<[string, string]> = [
  ['Ödeme oluşturma hatası: ', 'Payment creation error: '],
];

/**
 * Sunucudan gelen (Türkçe) hata metnini geçerli dile çevirir.
 * Türkçede metin aynen döner; bilinmeyen mesajlar olduğu gibi bırakılır.
 */
export function serverError(message: string | undefined | null, fallbackKey: string): string {
  if (!message) return tn(fallbackKey);
  if (currentLang === 'tr') return message;
  if (SERVER_ERRORS[message]) return SERVER_ERRORS[message];
  for (const [trPrefix, enPrefix] of SERVER_ERROR_PREFIXES) {
    if (message.startsWith(trPrefix)) return enPrefix + message.slice(trPrefix.length);
  }
  return message;
}

export function getDictionary(): Record<string, Entry> {
  return DICT;
}
