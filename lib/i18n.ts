/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Lang } from './use-lang';

// Translation dictionary
export const DICT: Record<string, { tr: string; en: string }> = {
  // Navigation & Header
  'nav.title': { tr: 'Zaman Makinesi Fotoğrafları', en: 'Time Machine Photos' },
  'nav.gallery': { tr: 'Galeri', en: 'Gallery' },
  'nav.faq': { tr: 'SSS', en: 'FAQ' },
  'nav.features': { tr: 'Özellikler', en: 'Features' },
  'nav.about': { tr: 'Hakkında', en: 'About' },
  'nav.startNow': { tr: 'Şimdi Başla', en: 'Start Now' },

  // Landing Page
  'landing.timeTravel': { tr: 'Zamanda Yolculuk', en: 'Time Travel' },
  'landing.steps': { tr: '1. Fotoğraf Yükle → 2. Yılları Seç → 3. Yolculuğa Başla.', en: '1. Upload Photo → 2. Select Years → 3. Start Journey.' },
  'landing.dragDrop': { tr: 'Fotoğrafını Buraya Sürükle ve Bırak', en: 'Drag and Drop Your Photo Here' },
  'landing.orSelect': { tr: 'veya dosya seç. Kabul edilenler: JPG, PNG, maks 5MB.', en: 'or select a file. Accepted: JPG, PNG, max 5MB.' },
  'landing.changePhoto': { tr: 'Fotoğrafı Değiştir', en: 'Change Photo' },
  'landing.uploadPhoto': { tr: 'Fotoğraf Yükle', en: 'Upload Photo' },
  'landing.selectYears': { tr: 'Gideceğin Yılları Seç', en: 'Select Years to Travel To' },
  'landing.selectAll': { tr: 'Tümünü Seç', en: 'Select All' },
  'landing.clear': { tr: 'Temizle', en: 'Clear' },
  'landing.startJourney': { tr: 'Zaman Yolculuğunu Başlat', en: 'Start Time Travel' },

  // Intro Page
  'intro.hero.title': { tr: 'Anılarınızı Zamanda Yolculuğa Çıkarın', en: 'Take Your Memories on a Time Travel' },
  'intro.hero.subtitle': { tr: 'Geçmişe ait bir fotoğrafınızı yükleyin, on yılı seçin ve sihrin gerçekleşmesini izleyin.', en: 'Upload a photo from the past, select a decade, and watch the magic happen.' },
  'intro.tryApp': { tr: 'Uygulamayı Dene', en: 'Try the App' },
  'intro.howItWorks.title': { tr: 'Üç Basit Adımda Zamanda Yolculuk', en: 'Time Travel in Three Simple Steps' },
  'intro.howItWorks.subtitle': { tr: 'Geçmişe gitmek hiç bu kadar kolay olmamıştı. Sadece üç basit adımı izleyin ve fotoğraflarınızın on yıllar boyunca dönüşümünü izleyin.', en: 'Going to the past has never been this easy. Just follow three simple steps and watch your photos transform over decades.' },
  'intro.step1.title': { tr: '1. Yükle', en: '1. Upload' },
  'intro.step1.desc': { tr: 'Yeniden hayal etmek istediğiniz bir fotoğrafı cihazınızdan seçin.', en: 'Select a photo from your device that you want to reimagine.' },
  'intro.step2.title': { tr: '2. On Yıl Seç', en: '2. Select Decade' },
  'intro.step2.desc': { tr: '1920\'lerden 2000\'lere kadar geniş bir yelpazeden bir on yıl seçin.', en: 'Choose a decade from a wide range from the 1920s to the 2000s.' },
  'intro.step3.title': { tr: '3. Keşfet', en: '3. Explore' },
  'intro.step3.desc': { tr: 'Yapay zekanın fotoğrafınızı o dönemin tarzına dönüştürmesini izleyin.', en: 'Watch AI transform your photo into the style of that era.' },
  'intro.features.title': { tr: 'Temel Özellikler', en: 'Key Features' },
  'intro.features.subtitle': { tr: 'Zaman Makinesi Fotoğrafları, anılarınızı yeniden keşfetmeniz için güçlü ve kullanımı kolay araçlar sunar.', en: 'Time Machine Photos provides powerful and easy-to-use tools to rediscover your memories.' },
  'intro.feature1.title': { tr: 'Zaman Yolculuğu', en: 'Time Travel' },
  'intro.feature1.desc': { tr: 'Fotoğraflarınızın 1920\'lerden 2000\'lere kadar farklı dönemlerde nasıl görüneceğini keşfedin.', en: 'Discover how your photos would look in different eras from the 1920s to the 2000s.' },
  'intro.feature2.title': { tr: 'İnteraktif Arayüz', en: 'Interactive Interface' },
  'intro.feature2.desc': { tr: 'Sadece birkaç tıklama ile yaratıcılığınızı ortaya çıkarın. Kullanıcı dostu arayüzümüzle kolayca gezinin.', en: 'Unleash your creativity with just a few clicks. Navigate easily with our user-friendly interface.' },
  'intro.feature3.title': { tr: 'İndirme ve Paylaşım', en: 'Download and Share' },
  'intro.feature3.desc': { tr: 'Oluşturduğunuz görselleri yüksek kalitede indirin ve arkadaşlarınızla sosyal medyada paylaşın.', en: 'Download your created visuals in high quality and share them on social media with friends.' },
  'intro.feature4.title': { tr: 'Gerçekçi Dönüşüm', en: 'Realistic Transformation' },
  'intro.feature4.desc': { tr: 'Yapay zeka teknolojimiz ile fotoğraflarınızın dokusunu ve atmosferini o döneme uygun hale getirin.', en: 'With our AI technology, make the texture and atmosphere of your photos appropriate for that era.' },
  'intro.cta.title': { tr: 'Kendi Zaman Kapsülünüzü Yaratmaya Hazır mısınız?', en: 'Ready to Create Your Own Time Capsule?' },
  'intro.cta.subtitle': { tr: 'Geçmişe yolculuğa şimdi başlayın ve anılarınızı daha önce hiç görülmemiş bir şekilde yeniden yaşayın. Tek bir tıklama ile fotoğraflarınızı on yıllar öncesine taşıyın.', en: 'Start your journey to the past now and relive your memories like never before. Move your photos decades back with a single click.' },
  'intro.cta.button': { tr: 'Geçmişe Yolculuğa Şimdi Başla!', en: 'Start Journey to the Past Now!' },

  // Auth Modal
  'auth.signIn': { tr: 'Giriş Yap', en: 'Sign In' },
  'auth.signUp': { tr: 'Üye Ol', en: 'Sign Up' },
  'auth.signIn.subtitle': { tr: 'Hesabına giriş yap', en: 'Sign in to your account' },
  'auth.signUp.subtitle': { tr: 'Zaman yolculuğuna başla', en: 'Start your time travel' },
  'auth.google.button': { tr: 'Google ile {action}', en: '{action} with Google' },
  'auth.or': { tr: 'veya', en: 'or' },
  'auth.email': { tr: 'E-posta', en: 'Email' },
  'auth.email.placeholder': { tr: 'ornek@email.com', en: 'example@email.com' },
  'auth.password': { tr: 'Şifre', en: 'Password' },
  'auth.confirmPassword': { tr: 'Şifre Tekrar', en: 'Confirm Password' },
  'auth.password.placeholder': { tr: '••••••••', en: '••••••••' },
  'auth.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
  'auth.hasAccount': { tr: 'Zaten hesabın var mı?', en: 'Already have an account?' },
  'auth.noAccount': { tr: 'Hesabın yok mu?', en: 'Don\'t have an account?' },
  'auth.error.match': { tr: 'Şifreler eşleşmiyor.', en: 'Passwords do not match.' },
  'auth.error.length': { tr: 'Şifre en az 6 karakter olmalı.', en: 'Password must be at least 6 characters.' },
  'auth.close': { tr: 'Kapat', en: 'Close' },

  // Pricing Modal
  'pricing.title': { tr: 'Fiyatlandırma', en: 'Pricing' },
  'pricing.subtitle': { tr: 'Size en uygun planı seçin', en: 'Choose the plan that suits you best' },
  'pricing.visuals': { tr: 'görsel', en: 'visuals' },
  'pricing.unlimited': { tr: 'Sınırsız görsel', en: 'Unlimited visuals' },
  'pricing.popular': { tr: 'Popüler', en: 'Popular' },
  'pricing.currentPlan': { tr: 'Mevcut Plan', en: 'Current Plan' },
  'pricing.buy': { tr: 'Satın Al', en: 'Buy' },
  'pricing.upgrade': { tr: 'Premium\'a Geç', en: 'Go Premium' },
  'pricing.secure': { tr: 'Tüm ödemeler Stripe ile güvenli bir şekilde işlenir', en: 'All payments are securely processed via Stripe' },
  'pricing.free.name': { tr: 'Ücretsiz', en: 'Free' },
  'pricing.payg.name': { tr: 'Kredi Bazlı', en: 'Pay As You Go' },
  'pricing.premium.name': { tr: 'Premium', en: 'Premium' },

  // User Bar
  'user.signIn.signUp': { tr: 'Giriş Yap / Üye Ol', en: 'Sign In / Sign Up' },
  'user.signOut': { tr: 'Çıkış Yap', en: 'Sign Out' },
  'user.credits': { tr: 'Kredi', en: 'Credits' },
  'user.upgrade': { tr: 'Yükselt', en: 'Upgrade' },

  // Results Screen
  'results.album': { tr: 'Albümü İndir', en: 'Download Album' },
  'results.all': { tr: 'Tümünü İndir', en: 'Download All' },
  'results.back': { tr: 'Başa Dön', en: 'Back to Start' },
  'results.preparing': { tr: 'Albüm Hazırlanıyor...', en: 'Preparing Album...' },
  'results.downloading': { tr: 'İndiriliyor...', en: 'Downloading...' },
  'results.noImages': { tr: 'İndirilecek oluşturulmuş resim yok.', en: 'No generated images to download.' },
  'results.downloadError': { tr: 'Resimleri indirirken bir hata oluştu. Lütfen tekrar deneyin.', en: 'An error occurred while downloading images. Please try again.' },
  'results.albumError': { tr: 'Üzgünüz, albümünüz oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.', en: 'Sorry, an error occurred while creating your album. Please try again.' },
  'results.creditQuestion': { tr: 'Albüm resimlerinin alt köşesine \'Hikmet Tanrıverdi tarafından oluşturuldu\' yazısı eklensin mi?', en: 'Add the text \'Created by Hikmet Tanrıverdi\' to the bottom corner of album images?' },

  // Error Messages
  'error.unknown': { tr: 'Bilinmeyen bir hata oluştu.', en: 'An unknown error occurred.' },
  'error.insufficientCredits': { tr: 'Yetersiz kredi! {count} görsel oluşturmak için {count} krediye ihtiyacınız var. Mevcut krediniz: {credits}', en: 'Insufficient credits! You need {count} credits to create {count} visuals. Your current credits: {credits}' },

  // Album Download
  'album.filename': { tr: 'past-forward-albumu.jpg', en: 'past-forward-album.jpg' },

  // Footer
  'footer.madeBy': { tr: 'THIRDHAND AI tarafından yapılmıştır.', en: 'Made by THIRDHAND AI.' },
  'footer.visit': { tr: 'www.thirdhand.com.tr\'yi ziyaret edebilirsiniz', en: 'Visit www.thirdhand.com.tr' },
  'footer.whatsapp': { tr: 'WhatsApp ile iletişime geç', en: 'Contact via WhatsApp' },

  // Polaroid Card
  'card.upload': { tr: 'Fotoğraf Yükle', en: 'Upload Photo' },
  'card.retry': { tr: 'Tekrar Dene', en: 'Try Again' },
  'card.retryTitle': { tr: 'Tekrar denemek için tıkla', en: 'Click to try again' },
  'card.download': { tr: '{caption} için resmi indir', en: 'Download image for {caption}' },
  'card.refresh': { tr: '{caption} için resmi yenile', en: 'Refresh image for {caption}' },

  // Language
  'lang.switch': { tr: 'EN', en: 'TR' },
};

// Translation function
export const t = (key: string, lang: Lang, vars?: Record<string, string | number>): string => {
  const entry = DICT[key];
  if (!entry) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }

  let text = entry[lang] || entry.tr; // Fallback to Turkish

  // Variable substitution
  if (vars) {
    Object.entries(vars).forEach(([varKey, value]) => {
      text = text.replace(`{${varKey}}`, String(value));
    });
  }

  return text;
};
