/**
 * Ana uygulama, tanıtım, kokpit, fiyatlandırma metinleri.
 * `tr` metinleri koddaki orijinal Türkçe ile birebir aynıdır.
 */
import type { Entry } from '../i18n';

export const APP_DICT: Record<string, Entry> = {
  // --- app ---
  'app.insufficient': {
    tr: 'Yetersiz Plütonyum Kredisi! {n} çağ için {req} kredi gerekiyor. Mevcut bakiyeniz: {credits}',
    en: 'Not enough Plutonium Credits! {n} eras require {req} credits. Your current balance: {credits}',
  },
  'app.insufficientCat': {
    tr: 'Yetersiz Kredi! Bu kategorideki {n} çağ için {req} kredi gerekiyor.',
    en: 'Not enough credits! The {n} eras in this category require {req} credits.',
  },
  'app.erasCount': {
    tr: '{n} Çağ',
    en: '{n} Eras',
  },
  'app.noReady': {
    tr: 'İndirilecek hazır görsel bulunamadı.',
    en: 'No ready images found to download.',
  },
  'app.albumError': {
    tr: 'Albüm PDF oluşturulurken bir hata oluştu.',
    en: 'An error occurred while creating the PDF album.',
  },
  'app.allDone': {
    tr: 'Bu sekmedeki tüm çağlar zaten üretilmiş durumda!',
    en: 'All eras in this tab have already been generated!',
  },
  'app.newPhoto': {
    tr: 'Yeni Fotoğraf Yükle',
    en: 'Upload New Photo',
  },
  'app.readyLabel': {
    tr: 'Hazır Portreler: ',
    en: 'Ready Portraits: ',
  },
  'app.video': {
    tr: '9:16 Video Stüdyosu',
    en: '9:16 Video Studio',
  },
  'app.newspaper': {
    tr: 'Gazete & Pasaport',
    en: 'Newspaper & Passport',
  },
  'app.pdf': {
    tr: 'PDF Albüm',
    en: 'PDF Album',
  },
  'app.downloadAll': {
    tr: 'Tümünü İndir',
    en: 'Download All',
  },
  'app.beamAll': {
    tr: 'Bu Sekmedeki Tümünü Işınla',
    en: 'Beam Up Everything in This Tab',
  },
  'app.beamOne': {
    tr: 'Bu Çağa Işınlan (1 Kredi)',
    en: 'Beam to This Era (1 Credit)',
  },
  'nav.cockpit': {
    tr: '⏳ Zaman Sıçraması',
    en: '⏳ Time Jump',
  },
  'nav.cockpit.short': {
    tr: 'Zaman',
    en: 'Time Jump',
  },
  'nav.video': {
    tr: '🎬 9:16 Video Klip',
    en: '🎬 9:16 Video Clip',
  },
  'nav.video.short': {
    tr: '9:16',
    en: '9:16 Video',
  },
  'nav.newspaper': {
    tr: '📰 Gazete & Pasaport',
    en: '📰 Newspaper & Passport',
  },
  'nav.newspaper.short': {
    tr: 'Gazete',
    en: 'Newspaper',
  },
  'nav.album': {
    tr: '📖 Tarih Albümü',
    en: '📖 History Album',
  },
  'nav.album.short': {
    tr: 'Tarih',
    en: 'History',
  },
  'nav.intro': {
    tr: 'Tanıtım',
    en: 'Intro',
  },
  'header.admin': {
    tr: 'Admin Panel',
    en: 'Admin Panel',
  },
  'header.credits': {
    tr: '{n} Kredi',
    en: '{n} Credits',
  },
  'header.buy': {
    tr: '+ AL',
    en: '+ BUY',
  },
  'header.logout': {
    tr: 'Çıkış',
    en: 'Sign Out',
  },
  'header.login': {
    tr: 'Giriş Yap',
    en: 'Sign In',
  },
  // --- intro ---
  'ip.demo1.title': {
    tr: '1920’ler — Great Gatsby',
    en: '1920s — The Great Gatsby',
  },
  'ip.demo1.badge': {
    tr: 'Caz Çağı',
    en: 'Jazz Age',
  },
  'ip.demo1.fact': {
    tr: 'Pinstripe zarafet, şampanya kadehleri, art-deco speakeasy balosu ve inci saç bandı.',
    en: 'Pinstripe elegance, champagne flutes, an art-deco speakeasy ball and a pearl headband.',
  },
  'ip.demo2.title': {
    tr: '1550 — Osmanlı Saray Sultanı',
    en: '1550 — Ottoman Palace Sultan',
  },
  'ip.demo2.badge': {
    tr: 'Topkapı Sarayı',
    en: 'Topkapı Palace',
  },
  'ip.demo2.fact': {
    tr: 'Altın işlemeli zümrüt kadife kaftan, mücevherli saray tacı ve İznik çinili kemerli avlu.',
    en: 'A gold-embroidered emerald velvet caftan, a jeweled court crown and an arched courtyard with İznik tiles.',
  },
  'ip.demo3.title': {
    tr: '2077 — Cyberpunk Neo-İstanbul',
    en: '2077 — Cyberpunk Neo-Istanbul',
  },
  'ip.demo3.badge': {
    tr: 'Sibernetik İmplant',
    en: 'Cybernetic Implants',
  },
  'ip.demo3.fact': {
    tr: 'Işıldayan nöral şakak devreleri, holografik neon yaka ve yağmurlu siber gökdelenler.',
    en: 'Glowing neural temple circuits, a holographic neon collar and rain-soaked cyber skyscrapers.',
  },
  'ip.demo4.title': {
    tr: 'M.Ö. 1350 — Antik Mısır Kraliçesi',
    en: '1350 BC — Ancient Egyptian Queen',
  },
  'ip.demo4.year': {
    tr: 'M.Ö. 1350',
    en: '1350 BC',
  },
  'ip.demo4.badge': {
    tr: 'Nil Krallığı',
    en: 'Kingdom of the Nile',
  },
  'ip.demo4.fact': {
    tr: 'Lapis lazuli ve altın Nemes tacı, turkuaz geniş gerdanlık ve hiyeroglifli taş tapınak.',
    en: 'A lapis lazuli and gold Nemes crown, a broad turquoise collar and a stone temple covered in hieroglyphs.',
  },
  'ip.demo5.title': {
    tr: '1885 — Vahşi Batı Şerifi',
    en: '1885 — Wild West Sheriff',
  },
  'ip.demo5.badge': {
    tr: 'Frontier Kovboyu',
    en: 'Frontier Cowboy',
  },
  'ip.demo5.fact': {
    tr: 'Tozlu deri trençkot, gümüş şerif yıldızı, kovboy şapkası ve batı kasabası boardwalk.',
    en: 'A dusty leather duster, a silver sheriff star, a cowboy hat and a frontier-town boardwalk.',
  },
  'ip.faq1.q': {
    tr: 'Zaman Makinesi yüz benzerliğimi nasıl koruyor?',
    en: 'How does Zaman Makinesi preserve my facial likeness?',
  },
  'ip.faq1.a': {
    tr: 'Gelişmiş yüz tanıma ve yüz koruma (Face-Fidelity) algoritmalarımız sayesinde göz, burun, çene ve bakış yapınız birebir korunurken; kıyafetleriniz, saç stiliniz, ışıklandırma ve fotoğraf dokusu seçtiğiniz tarihi döneme kusursuzca uyarlanır.',
    en: 'Thanks to our advanced face recognition and Face-Fidelity algorithms, your eyes, nose, jawline and gaze are preserved exactly, while your clothing, hairstyle, lighting and photo texture are flawlessly adapted to the historical era you choose.',
  },
  'ip.faq2.q': {
    tr: 'Ücretsiz deneme yapabilir miyim?',
    en: 'Can I try it for free?',
  },
  'ip.faq2.a': {
    tr: 'Evet! Google ile giriş yapan her yeni kullanıcıya anında 5 Ücretsiz Plütonyum Kredisi tanımlanır. İstediğiniz 5 farklı çağa anında ücretsiz seyahat edebilirsiniz.',
    en: 'Yes! Every new user who signs in with Google instantly receives 5 free Plutonium Credits. You can travel to any 5 different eras of your choice, completely free.',
  },
  'ip.faq3.q': {
    tr: 'Tarihi Gazete ve Zaman Pasaportu çıktısı nedir?',
    en: 'What are the Historic Newspaper and Time Passport outputs?',
  },
  'ip.faq3.a': {
    tr: 'Ürettiğiniz her dönem portresi için o yılın gerçek tarihi manşetini (örneğin 1923 Cumhuriyet ilanı veya 1969 Ay’a iniş) içeren sararmış antika gazete sayfası ve Zaman Bakanlığı onaylı seyahat pasaportu oluşturup yüksek çözünürlüklü PNG ve PDF olarak indirebilirsiniz.',
    en: 'For every era portrait you create, you can generate a yellowed antique newspaper page featuring that year’s real historic headline (for example, the proclamation of the Turkish Republic in 1923 or the 1969 Moon landing) and a Ministry of Time-approved travel passport, and download them as high-resolution PNG and PDF files.',
  },
  'ip.faq4.q': {
    tr: '9:16 Video Klip (Timelapse) nasıl çalışır?',
    en: 'How does the 9:16 Video Clip (Timelapse) work?',
  },
  'ip.faq4.a': {
    tr: 'Orijinal fotoğrafınızdan başlayıp geçmiş ve gelecekteki tüm çağlarınıza akıcı bir geçiş (morph) yapan dikey reels/TikTok videosu oluşturur. Sosyal medyada paylaşmaya hazır tek tıkla indirilir.',
    en: 'It creates a vertical Reels/TikTok video that starts from your original photo and smoothly morphs through all of your past and future eras. Download it with a single click, ready to share on social media.',
  },
  'ip.hero.badge': {
    tr: 'V4 FLUX — YENİ NESİL ZAMAN YOLCULUĞU',
    en: 'V4 FLUX — NEXT-GENERATION TIME TRAVEL',
  },
  'ip.hero.title1': {
    tr: 'Kendinizi ',
    en: 'See Yourself in ',
  },
  'ip.hero.title2': {
    tr: 'Tarihin ve Geleceğin',
    en: 'History and the Future',
  },
  'ip.hero.title3': {
    tr: ' İçinde Görün.',
    en: '.',
  },
  'ip.hero.p1': {
    tr: 'Tek bir portrenizi yükleyin; ',
    en: 'Upload a single portrait and jump through time, from ',
  },
  'ip.hero.p2': {
    tr: 'Osmanlı Sarayı\'ndan 1920 Gatsby Caz Kulübü\'ne, Antik Mısır\'dan 2077 Cyberpunk Şehrine',
    en: 'the Ottoman Palace to a 1920s Gatsby jazz club, from Ancient Egypt to the Cyberpunk city of 2077',
  },
  'ip.hero.p3': {
    tr: ' kadar 30+ farklı çağda yüz hatlarınız bozulmadan zamanda sıçrayın.',
    en: ' across 30+ different eras, with your facial features left intact.',
  },
  'ip.feat.title1': {
    tr: 'Basit Bir Filtre Değil, ',
    en: 'Not Just a Filter, ',
  },
  'ip.cta.launch': {
    tr: '🚀 ZAMAN KOKPİTİNİ ÇALIŞTIR',
    en: '🚀 LAUNCH THE TIME COCKPIT',
  },
  'ip.bonus.title': {
    tr: '5 Ücretsiz Sıçrama',
    en: '5 Free Jumps',
  },
  'ip.bonus.sub': {
    tr: 'Giriş yap ve hemen dene',
    en: 'Sign in and try it right away',
  },
  'ip.proof.eras': {
    tr: 'Tarihi & Siber Çağ',
    en: 'Historic & Cyber Eras',
  },
  'ip.proof.speed': {
    tr: '3 Saniye',
    en: '3 Seconds',
  },
  'ip.proof.speedLabel': {
    tr: 'Hızlı AI Motoru',
    en: 'Fast AI Engine',
  },
  'ip.proof.likeness': {
    tr: 'Yüz Benzerliği',
    en: 'Facial Likeness',
  },
  'ip.original': {
    tr: '📷 Orijinal Portre',
    en: '📷 Original Portrait',
  },
  'ip.slide': {
    tr: '◀ Kaydırın ▶',
    en: '◀ Drag ▶',
  },
  'ip.feat.badge': {
    tr: '✨ ÇIĞIR AÇAN ÖZELLİKLER',
    en: '✨ GROUNDBREAKING FEATURES',
  },
  'ip.feat.title2': {
    tr: 'Eksiksiz Bir Zaman Makinesi',
    en: 'a Complete Time Machine',
  },
  'ip.feat.sub': {
    tr: 'Tarihi gazete baskısından TikTok timelapse videolarına, DeLorean ses efektlerinden çoklu çağ seçimine kadar hepsi elinizin altında.',
    en: 'From historic newspaper prints to TikTok timelapse videos, from DeLorean sound effects to multi-era selection, everything is at your fingertips.',
  },
  'ip.f1.title': {
    tr: 'DeLorean LED Zaman Devreleri & SFX',
    en: 'DeLorean LED Time Circuits & SFX',
  },
  'ip.f1.desc': {
    tr: 'Geleceğe Dönüş filmindeki gibi çalışan hedef, şimdiki zaman ve ayrılış LED göstergeleri ve tarayıcıda üretilen mekanik kadran sesleri.',
    en: 'Destination, present-time and last-departed LED displays that work just like in Back to the Future, plus mechanical dial sounds generated right in your browser.',
  },
  'ip.f2.title': {
    tr: 'Tarihi Gazete & Zaman Pasaportu',
    en: 'Historic Newspaper & Time Passport',
  },
  'ip.f2.desc': {
    tr: 'Gittiğiniz çağın gerçek tarihi manşetleriyle sararmış antika gazete küpürü veya Zaman Bakanlığı onaylı dijital pasaport çıktısı alın.',
    en: 'Get a yellowed antique newspaper clipping with real historic headlines from the era you visited, or a digital passport approved by the Ministry of Time.',
  },
  'ip.f3.title': {
    tr: '9:16 Reels & TikTok Video Klip',
    en: '9:16 Reels & TikTok Video Clip',
  },
  'ip.f3.desc': {
    tr: 'Orijinal fotoğrafınızdan tüm çağlara akıcı bir yüz morph timelapse geçişi. Sosyal medyada viral olacak formatta anında hazır.',
    en: 'A smooth face-morph timelapse from your original photo through every era, instantly ready in a format built to go viral on social media.',
  },
  'ip.cat.badge': {
    tr: '🌌 GENİŞ EVREN KATALOĞU',
    en: '🌌 A VAST UNIVERSE CATALOG',
  },
  'ip.cat.title': {
    tr: '30+ Zengin Tarih ve Gelecek Portalı',
    en: '30+ Rich Portals to History and the Future',
  },
  'ip.cat.link': {
    tr: 'Tüm Portalları Kokpitte Gör',
    en: 'See All Portals in the Cockpit',
  },
  'ip.price.badge': {
    tr: '⚡ ŞEFFAF VE DÜŞÜK MALİYETLİ',
    en: '⚡ TRANSPARENT AND LOW-COST',
  },
  'ip.price.title': {
    tr: '5 Ücretsiz Kredi ile Başlayın, Diledikçe Yükleyin',
    en: 'Start with 5 Free Credits, Top Up Whenever You Like',
  },
  'ip.price.sub': {
    tr: 'Abonelik tuzağı yok. Kullandığın kadar öde mantığıyla dilediğin zaman paket al, süresiz kullan.',
    en: 'No subscription trap. Pay as you go: buy a pack whenever you want and use it with no expiry.',
  },
  'ip.p1.name': {
    tr: 'Zaman Kapsülü',
    en: 'Time Capsule',
  },
  'ip.p1.cr': {
    tr: '25 Plütonyum Kredisi',
    en: '25 Plutonium Credits',
  },
  'ip.p1.l1': {
    tr: '✓ 25 Fotoğraf Sıçraması',
    en: '✓ 25 Photo Jumps',
  },
  'ip.p1.l2': {
    tr: '✓ Tarihi Gazete & Pasaport',
    en: '✓ Historic Newspaper & Passport',
  },
  'ip.p1.l3': {
    tr: '✓ HD İndirme',
    en: '✓ HD Download',
  },
  'ip.popular': {
    tr: 'En Popüler',
    en: 'Most Popular',
  },
  'ip.p2.name': {
    tr: 'Zaman Gezgini',
    en: 'Time Traveler',
  },
  'ip.p2.cr': {
    tr: '75 Plütonyum Kredisi',
    en: '75 Plutonium Credits',
  },
  'ip.p2.l1': {
    tr: '✓ 75 Fotoğraf Sıçraması',
    en: '✓ 75 Photo Jumps',
  },
  'ip.p2.l2': {
    tr: '✓ 9:16 Video Timelapse Klip',
    en: '✓ 9:16 Video Timelapse Clip',
  },
  'ip.p2.l3': {
    tr: '✓ Öncelikli Hızlı Üretim',
    en: '✓ Priority Fast Generation',
  },
  'ip.p2.btn': {
    tr: 'Hemen Yükle',
    en: 'Top Up Now',
  },
  'ip.p3.name': {
    tr: 'Zaman Lordu',
    en: 'Time Lord',
  },
  'ip.p3.cr': {
    tr: '250 Plütonyum Kredisi',
    en: '250 Plutonium Credits',
  },
  'ip.p3.l1': {
    tr: '✓ 250 Fotoğraf Sıçraması',
    en: '✓ 250 Photo Jumps',
  },
  'ip.p3.l2': {
    tr: '✓ Sınırsız Video Klip & Albüm',
    en: '✓ Unlimited Video Clips & Album',
  },
  'ip.p3.l3': {
    tr: '✓ En Yüksek Çözünürlük',
    en: '✓ Highest Resolution',
  },
  'ip.faq.title': {
    tr: 'Sıkça Sorulan Sorular',
    en: 'Frequently Asked Questions',
  },
  'ip.faq.sub': {
    tr: 'Aklınıza takılan tüm soruların yanıtları',
    en: 'Answers to all your questions',
  },
  'ip.bottom.title': {
    tr: 'Zaman Sizi Bekliyor. Tarihinize Bugün Tanıklık Edin.',
    en: 'Time Is Waiting for You. Witness Your History Today.',
  },
  'ip.bottom.sub': {
    tr: 'Hemen bir fotoğrafınızı yükleyin, 5 ücretsiz sıçrama hakkınızla geçmişe ve geleceğe ilk adımınızı atın.',
    en: 'Upload a photo right now and take your first step into the past and the future with your 5 free jumps.',
  },
  'ip.bottom.btn': {
    tr: '🚀 KOKPİTE GİT VE BAŞLA',
    en: '🚀 GO TO THE COCKPIT AND START',
  },
  'ip.pick': {
    tr: 'Paketi Seç',
    en: 'Choose Pack',
  },
  'ip.proof.likenessVal': {
    tr: '%100',
    en: '100%',
  },
  // --- cockpit ---
  'cp.sfx.title': {
    tr: 'Ses Efektlerini Aç / Kapat',
    en: 'Turn Sound Effects On / Off',
  },
  'cp.sfx.off': {
    tr: 'Ses Kapalı',
    en: 'Sound Off',
  },
  'cp.sfx.on': {
    tr: 'SFX Aktif',
    en: 'SFX On',
  },
  'cp.topbar': {
    tr: 'ZAMAN KONTROL MERKEZİ // V4.0 DE LOREAN FLUX',
    en: 'TIME CONTROL CENTER // V4.0 DE LOREAN FLUX',
  },
  'cp.fuel': {
    tr: '⚡ Plütonyum:',
    en: '⚡ Plutonium:',
  },
  'cp.topup': {
    tr: '+ YÜKLE',
    en: '+ ADD',
  },
  'cp.dest': {
    tr: 'HEDEF ZAMAN',
    en: 'TARGET TIME',
  },
  'cp.dest.lock': {
    tr: 'FLUX KİLİTLENDİ',
    en: 'FLUX LOCKED',
  },
  'cp.present': {
    tr: 'ŞİMDİKİ ZAMAN',
    en: 'CURRENT TIME',
  },
  'cp.present.foot': {
    tr: 'EVREN SAATİ',
    en: 'UNIVERSAL CLOCK',
  },
  'cp.departed': {
    tr: 'SON AYRILIŞ',
    en: 'LAST DEPARTURE',
  },
  'cp.departed.date': {
    tr: '26 EKİM 1985',
    en: 'OCT 26, 1985',
  },
  'cp.departed.place': {
    tr: 'HILL VALLEY // ZAMAN YOLCULUĞU BAŞLANGICI',
    en: 'HILL VALLEY // START OF TIME TRAVEL',
  },
  'cp.departed.foot': {
    tr: '88 MPH SİSTEMİ',
    en: '88 MPH SYSTEM',
  },
  'cp.noDest': {
    tr: 'HEDEF ÇAĞ SEÇİLMEDİ',
    en: 'NO DESTINATION ERA SELECTED',
  },
  'cp.fallbackDate': {
    tr: '30 AĞU 2026',
    en: '21 NOV 2026',
  },
  'cp.alt': {
    tr: 'Yüklenen Fotoğraf',
    en: 'Uploaded Photo',
  },
  'cp.change': {
    tr: 'Fotoğrafı Değiştir',
    en: 'Change Photo',
  },
  'cp.uploaded': {
    tr: ' Fotoğraf Zaman Kapsülüne Yüklendi',
    en: ' Photo loaded into the Time Capsule',
  },
  'cp.uploadTitle': {
    tr: 'Portrenizi Yükleyin',
    en: 'Upload Your Portrait',
  },
  'cp.uploadHint': {
    tr: 'Tek kişilik veya vesikalık net bir fotoğraf sürükleyin veya dosyalardan seçin.',
    en: 'Drag in or choose a clear single-person or passport-style photo from your files.',
  },
  'cp.choose': {
    tr: 'Fotoğraf Seç',
    en: 'Choose Photo',
  },
  'cp.entering': {
    tr: 'ZAMAN TÜNELİNE GİRİLİYOR...',
    en: 'ENTERING THE TIME TUNNEL...',
  },
  'cp.launch': {
    tr: 'ZAMANDA YOLCULUK YAP ({n} ÇAĞ)',
    en: 'TRAVEL THROUGH TIME ({n} ERAS)',
  },
  'es.selected': {
    tr: '{n} Çağ Seçili',
    en: '{n} Eras Selected',
  },
  'es.title': {
    tr: 'Hedef Çağları Seçin',
    en: 'Choose Destination Eras',
  },
  'es.all': {
    tr: 'Tümünü Seç',
    en: 'Select All',
  },
  'es.clear': {
    tr: 'Temizle',
    en: 'Clear',
  },
  // --- polaroid ---
  'pc.loading': {
    tr: 'Zaman Tüneli İşleniyor...',
    en: 'Processing the Time Tunnel...',
  },
  'pc.newspaperTitle': {
    tr: 'Tarihi Gazete & Pasaport Çıkar',
    en: 'Create Historic Newspaper & Passport',
  },
  'pc.newspaper': {
    tr: 'Gazete',
    en: 'Newspaper',
  },
  'pc.downloadTitle': {
    tr: 'Polaroid İndir',
    en: 'Download Polaroid',
  },
  // --- pricing ---
  'pkg.capsule_25.name': {
    tr: 'Zaman Kapsülü',
    en: 'Time Capsule',
  },
  'pkg.capsule_25.badge': {
    tr: 'Başlangıç',
    en: 'Starter',
  },
  'pkg.capsule_25.f0': {
    tr: '25 Adet Zaman Yolculuğu Görseli',
    en: '25 Time Travel Images',
  },
  'pkg.capsule_25.f1': {
    tr: 'Tüm Tarihi & Gelecek Çağlar Açık',
    en: 'All Historic & Future Eras Unlocked',
  },
  'pkg.capsule_25.f2': {
    tr: 'Tarihi Gazete & Pasaport Oluşturma',
    en: 'Historic Newspaper & Passport Creation',
  },
  'pkg.capsule_25.f3': {
    tr: 'Yüksek Çözünürlüklü Polaroid İndirme',
    en: 'High-Resolution Polaroid Downloads',
  },
  'pkg.capsule_25.f4': {
    tr: 'Süre sınırı yok (Krediler yanmaz)',
    en: 'No time limit (credits never expire)',
  },
  'pkg.traveler_75.name': {
    tr: 'Zaman Gezgini',
    en: 'Time Traveler',
  },
  'pkg.traveler_75.badge': {
    tr: 'En Popüler 🔥',
    en: 'Most Popular 🔥',
  },
  'pkg.traveler_75.f0': {
    tr: '75 Adet Zaman Yolculuğu Görseli',
    en: '75 Time Travel Images',
  },
  'pkg.traveler_75.f1': {
    tr: '15 Video Morph / Timelapse Klip Hakkı',
    en: '15 Video Morph / Timelapse Clips',
  },
  'pkg.traveler_75.f2': {
    tr: 'Öncelikli Ultra Hızlı AI Motoru',
    en: 'Priority Ultra-Fast AI Engine',
  },
  'pkg.traveler_75.f3': {
    tr: 'Tarihi Gazete & Pasaport PDF/PNG Çıktısı',
    en: 'Historic Newspaper & Passport PDF/PNG Output',
  },
  'pkg.traveler_75.f4': {
    tr: 'Ticari Kullanım İzni',
    en: 'Commercial Use License',
  },
  'pkg.traveler_75.f5': {
    tr: 'Süre sınırı yok (Krediler yanmaz)',
    en: 'No time limit (credits never expire)',
  },
  'pkg.timelord_250.name': {
    tr: 'Zaman Lordu',
    en: 'Time Lord',
  },
  'pkg.timelord_250.badge': {
    tr: 'En Avantajlı ⚡',
    en: 'Best Value ⚡',
  },
  'pkg.timelord_250.f0': {
    tr: '250 Adet Zaman Yolculuğu Görseli',
    en: '250 Time Travel Images',
  },
  'pkg.timelord_250.f1': {
    tr: '50 Video Morph / Timelapse Klip Hakkı',
    en: '50 Video Morph / Timelapse Clips',
  },
  'pkg.timelord_250.f2': {
    tr: '4K Ultra HD Upscaling Desteği',
    en: '4K Ultra HD Upscaling Support',
  },
  'pkg.timelord_250.f3': {
    tr: 'Toplu İndirme & Özel Albüm PDF',
    en: 'Bulk Download & Custom Album PDF',
  },
  'pkg.timelord_250.f4': {
    tr: 'Sınırsız Tarihi Gazete & Pasaport',
    en: 'Unlimited Historic Newspapers & Passports',
  },
  'pkg.timelord_250.f5': {
    tr: '7/24 VIP Destek',
    en: '24/7 VIP Support',
  },
  'pm.added': {
    tr: 'Tebrikler! {name} paketi ({n} Kredi) hesabınıza eklendi.',
    en: 'Congratulations! The {name} pack ({n} Credits) has been added to your account.',
  },
  'pm.perCredits': {
    tr: '/ {n} Kredi',
    en: '/ {n} Credits',
  },
  'pm.perImage': {
    tr: 'Görsel Başına Sadece {x} ₺',
    en: 'Only {x} ₺ per image',
  },
  'pm.buy': {
    tr: 'Hemen Satın Al ({n} Kredi)',
    en: 'Buy Now ({n} Credits)',
  },
  'pm.close': {
    tr: 'Kapat',
    en: 'Close',
  },
  'pm.fuel': {
    tr: ' Zaman Yakıtı & Kredi Paketleri',
    en: ' Time Fuel & Credit Packs',
  },
  'pm.title': {
    tr: 'Zamanda Sınırsız Yolculuğa Çıkın',
    en: 'Embark on Unlimited Time Travel',
  },
  'pm.balance': {
    tr: 'Mevcut Bakiyeniz: ',
    en: 'Your current balance: ',
  },
  'pm.balanceTail': {
    tr: '. Kredileriniz bittiğinde dilediğiniz paketi seçerek yolculuğa devam edebilirsiniz.',
    en: '. When your credits run out, pick any pack you like to keep traveling.',
  },
  'pm.ssl': {
    tr: '🔒 256-Bit SSL Güvenli Ödeme',
    en: '🔒 256-bit SSL Secure Payment',
  },
  'pm.instant': {
    tr: '⚡ Krediler anında hesaba yüklenir',
    en: '⚡ Credits are added to your account instantly',
  },
  'pm.noExpiry': {
    tr: '🔄 Kredilerin son kullanma tarihi yoktur',
    en: '🔄 Credits never expire',
  },
};
