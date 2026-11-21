/**
 * Gazete, pasaport, albüm ve video stüdyosu metinleri.
 * `tr` metinleri koddaki orijinal Türkçe ile birebir aynıdır.
 */
import type { Entry } from '../i18n';

export const STUDIO_DICT: Record<string, Entry> = {
  // --- studio ---
  'hn.year': {
    tr: 'YIL: ',
    en: 'YEAR: ',
  },
  'hn.editionTail': {
    tr: ' // ÖZEL BASKI',
    en: ' // SPECIAL EDITION',
  },
  'hn.issue': {
    tr: 'SAYI: NO. ',
    en: 'ISSUE: NO. ',
  },
  'hn.photoCredit': {
    tr: 'Görsel: ',
    en: 'Photo: ',
  },
  'hn.code': {
    tr: 'KOD: ',
    en: 'CODE: ',
  },
  'hn.dropcap': {
    tr: 'B',
    en: 'T',
  },
  'hn.art1a': {
    tr: 'ugün tarihe geçecek olağanüstü bir hadiseye şahitlik edildi. Zaman tünelinden intikal eden seyyah ',
    en: 'oday, an extraordinary event destined for the history books was witnessed. The traveler ',
  },
  'hn.art1b': {
    tr: ', dönemin önde gelen cemiyeti tarafından karşılandı.',
    en: ', arriving through the time tunnel, was welcomed by the leading society of the era.',
  },
  'hn.art2a': {
    tr: 'Dönemin atmosferine bizzat intibak eden seyyah, ',
    en: 'Adapting to the atmosphere of the age in person, the traveler left the note ',
  },
  'hn.art2b': {
    tr: ' notunu düşerek tarihi arşive mühür vurdu.',
    en: ' and put a seal on the historic archive.',
  },
  'hn.dlNewspaper': {
    tr: 'Gazeteyi İndir (PNG)',
    en: 'Download Newspaper (PNG)',
  },
  'hn.dlPassport': {
    tr: 'Pasaportu İndir (PNG)',
    en: 'Download Passport (PNG)',
  },
  'hn.fallbackBadge': {
    tr: 'Tarihi Arşiv',
    en: 'Historical Archive',
  },
  'hn.fallbackTitle': {
    tr: 'Zamanın İzi',
    en: 'Traces of Time',
  },
  'hn.fallbackHeadline': {
    tr: 'TARİHTE BÜYÜK YOLCULUK: ÇAĞLAR ARASI KEŞİF!',
    en: 'THE GREAT JOURNEY THROUGH HISTORY: A DISCOVERY ACROSS THE AGES!',
  },
  'hn.fallbackSub': {
    tr: 'Zaman Gezgini tarihin en önemli anlarına bizzat tanıklık etti.',
    en: 'The Time Traveler personally witnessed the most important moments in history.',
  },
  'hn.fallbackFact': {
    tr: 'Tarih boyunca insanlık geçmişi anlamak ve geleceği inşa etmek için zamanın izlerini takip etti.',
    en: 'Throughout history, humanity has followed the traces of time to understand the past and build the future.',
  },
  'hn.alertFail': {
    tr: 'Görsel indirilirken bir sorun oluştu.',
    en: 'There was a problem downloading the image.',
  },
  'hn.tabNewspaper': {
    tr: '🗞️ Dönem Gazetesi',
    en: '🗞️ Period Newspaper',
  },
  'hn.tabPassport': {
    tr: '🛂 Zaman Pasaportu',
    en: '🛂 Time Passport',
  },
  'hn.close': {
    tr: 'Kapat',
    en: 'Close',
  },
  'hn.tagline': {
    tr: 'Cihan Havadisleri & Çağlar Arası Tarih Mecmuası',
    en: 'World News & the Inter-Era History Gazette',
  },
  'hn.price': {
    tr: 'FİYAT: 5 KURUŞ',
    en: 'PRICE: 5 KURUŞ',
  },
  'hn.photoAlt': {
    tr: 'Tarihi Portre',
    en: 'Historic Portrait',
  },
  'hn.footerLeft': {
    tr: 'ZAMAN BAKANLIĞI RESMİ ARŞİVİ',
    en: 'MINISTRY OF TIME OFFICIAL ARCHIVE',
  },
  'hn.passportTop': {
    tr: 'TEMPORAL TRAVEL AUTHORITY // PASAPORT',
    en: 'TEMPORAL TRAVEL AUTHORITY // PASSPORT',
  },
  'hn.visaTitle': {
    tr: 'ZAMAN BAKANLIĞI VİZESİ',
    en: 'MINISTRY OF TIME VISA',
  },
  'hn.travelerAlt': {
    tr: 'Seyyah Portresi',
    en: 'Traveler Portrait',
  },
  'hn.travelerName': {
    tr: 'Seyyah Adı',
    en: 'Traveler Name',
  },
  'hn.target': {
    tr: 'Hedef Çağ / Yıl',
    en: 'Target Era / Year',
  },
  'hn.passportNo': {
    tr: 'Pasaport No',
    en: 'Passport No.',
  },
  'hn.level': {
    tr: 'Yetki Düzeyi',
    en: 'Authorization Level',
  },
  'hn.levelValue': {
    tr: 'SINIRSIZ ZAMAN YOLCUSU ⚡',
    en: 'UNLIMITED TIME TRAVELER ⚡',
  },
  'hn.approved': {
    tr: 'ONAYLANDI: HILL VALLEY 1985',
    en: 'APPROVED: HILL VALLEY 1985',
  },
  'hn.sealed': {
    tr: 'MÜHÜRLÜ & GEÇERLİ',
    en: 'SEALED & VALID',
  },
  'hn.preparing': {
    tr: 'Hazırlanıyor...',
    en: 'Preparing...',
  },
  'ns.issue': {
    tr: 'SAYI: #',
    en: 'ISSUE: #',
  },
  'ns.witness': {
    tr: 'Dönemin tanıkları, {name} adlı zaman yolcusunun bu çağın en saygın simalarından biri olduğunu ve tarihin akışına bizzat tanıklık ettiğini bildirdi.',
    en: 'Witnesses of the era reported that the time traveler named {name} was one of the most respected figures of this age and had personally witnessed the course of history.',
  },
  'ns.date': {
    tr: 'TARİH: ',
    en: 'DATE: ',
  },
  'ns.dateTail': {
    tr: ' BASKISI',
    en: ' EDITION',
  },
  'ns.photoCredit': {
    tr: 'Fotoğraf: ',
    en: 'Photo: ',
  },
  'ns.note': {
    tr: 'Resmi Arşiv Notu:',
    en: 'Official Archive Note:',
  },
  'ns.noteBody': {
    tr: ' Bu belge Zaman Makinesi V4 Krono-Kayıt Dairesi tarafından onaylanmıştır.',
    en: ' This document has been certified by the Zaman Makinesi V4 Chrono-Records Office.',
  },
  'ns.alertFail': {
    tr: 'Görsel oluşturulurken bir hata oluştu.',
    en: 'An error occurred while creating the image.',
  },
  'ns.title': {
    tr: 'TARİHİ GAZETE & PASAPORT BASIMEVİ',
    en: 'HISTORIC NEWSPAPER & PASSPORT PRINT SHOP',
  },
  'ns.badge': {
    tr: 'ARŞİV BASKISI',
    en: 'ARCHIVE EDITION',
  },
  'ns.sub': {
    tr: 'Fotoğrafınızı o dönemin 1. sayfa manşet gazetesine veya holografik Zaman Gezgini Pasaportuna dönüştürün.',
    en: 'Turn your photo into that era’s front-page headline newspaper or a holographic Time Traveler Passport.',
  },
  'ns.modeNewspaper': {
    tr: 'Tarihi Gazete',
    en: 'Historic Newspaper',
  },
  'ns.modePassport': {
    tr: 'Zaman Pasaportu',
    en: 'Time Passport',
  },
  'ns.printing': {
    tr: 'Basılıyor...',
    en: 'Printing...',
  },
  'ns.download': {
    tr: 'Yüksek Kalitede İndir (PNG)',
    en: 'Download in High Quality (PNG)',
  },
  'ns.price': {
    tr: 'FİYAT: 5 KURUŞ',
    en: 'PRICE: 5 KURUŞ',
  },
  'ns.paper': {
    tr: 'ZAMAN VE HAKİKAT GAZETESİ',
    en: 'THE TIME & TRUTH GAZETTE',
  },
  'ns.motto': {
    tr: '"Geçmişin yankıları, bugünün ve yarının en büyük pusulasıdır."',
    en: '"The echoes of the past are the greatest compass of today and tomorrow."',
  },
  'ns.passport': {
    tr: 'ZAMAN GEZGİNİ PASAPORTU',
    en: 'TIME TRAVELER PASSPORT',
  },
  'ns.passportNo': {
    tr: 'PASAPORT NO',
    en: 'PASSPORT NO.',
  },
  'ns.approved': {
    tr: 'ONAYLANDI',
    en: 'APPROVED',
  },
  'ns.travelerName': {
    tr: 'GEZGİN ADI (TRAVELER)',
    en: 'TRAVELER NAME',
  },
  'ns.target': {
    tr: 'HEDEF ÇAĞ & DÖNEM',
    en: 'TARGET ERA & PERIOD',
  },
  'ns.class': {
    tr: 'YETKİ DERECESİ',
    en: 'AUTHORIZATION LEVEL',
  },
  'ns.classValue': {
    tr: 'SINIF-A DOKUNULMAZ',
    en: 'CLASS-A IMMUNITY',
  },
  'ns.status': {
    tr: 'GÖREV STATÜSÜ',
    en: 'MISSION STATUS',
  },
  'ns.editTitle': {
    tr: ' Manşet & Yazı Düzenle',
    en: ' Edit Headline & Text',
  },
  'ns.headlineLabel': {
    tr: 'Ana Manşet Başlığı:',
    en: 'Main Headline:',
  },
  'ns.subLabel': {
    tr: 'Alt Başlık & Açıklama:',
    en: 'Subheading & Description:',
  },
  'ns.reset': {
    tr: '↺ Orijinal Tarihi Metne Sıfırla',
    en: '↺ Reset to the Original Historic Text',
  },
  'ns.tip': {
    tr: ' İpucu',
    en: ' Tip',
  },
  'ns.tipBody': {
    tr: 'Yüksek çözünürlüklü PNG çıktısını doğrudan indirip poster olarak bastırabilir veya sosyal medyada hikaye olarak paylaşabilirsiniz.',
    en: 'You can download the high-resolution PNG and print it as a poster, or share it as a story on social media.',
  },
  'al.demoA': {
    tr: 'Şu anda ',
    en: 'You are currently viewing the ',
  },
  'al.demoB': {
    tr: 'Demo Gezgin Albümünü',
    en: 'Demo Traveler Album',
  },
  'al.demoC': {
    tr: ' görüntülüyorsunuz. Kendi fotoğrafınızla tüm çağlara ait kişisel bir albüm oluşturmak için kokpite gidin!',
    en: '. Head to the cockpit to create a personal album of every era with your own photo!',
  },
  'al.d1.title': {
    tr: '1920’ler — Great Gatsby & Caz',
    en: '1920s — The Great Gatsby & Jazz',
  },
  'al.d1.fact': {
    tr: 'Caz çağı, flapper elbiseleri ve art-deco dönemi.',
    en: 'The Jazz Age, flapper dresses and the art-deco era.',
  },
  'al.d2.title': {
    tr: '1550 Osmanlı Saray İhtişamı',
    en: '1550 Ottoman Palace Splendor',
  },
  'al.d2.fact': {
    tr: 'Topkapı Sarayı, ipek kaftanlar ve altın işlemeli saray zarafeti.',
    en: 'Topkapı Palace, silk caftans and gold-embroidered court elegance.',
  },
  'al.d3.title': {
    tr: '1885 Vahşi Batı Şerifi',
    en: '1885 Wild West Sheriff',
  },
  'al.d3.fact': {
    tr: 'Altına hücum, kovboy çizmeleri ve frontier kasabaları.',
    en: 'The gold rush, cowboy boots and frontier towns.',
  },
  'al.d4.title': {
    tr: 'M.Ö. 1350 Antik Mısır Kraliçesi',
    en: '1350 BC Ancient Egyptian Queen',
  },
  'al.d4.year': {
    tr: 'M.Ö. 1350',
    en: '1350 BC',
  },
  'al.d4.fact': {
    tr: 'Nil kıyısı, altın firavun taçları ve piramitler çağı.',
    en: 'The banks of the Nile, golden pharaoh crowns and the age of the pyramids.',
  },
  'al.d5.title': {
    tr: '2077 Cyberpunk Neo-İstanbul',
    en: '2077 Cyberpunk Neo-Istanbul',
  },
  'al.d5.fact': {
    tr: 'Neon gökdelenler, holografik köprüler ve sibernetik çağ.',
    en: 'Neon skyscrapers, holographic bridges and the cybernetic age.',
  },
  'al.archive': {
    tr: 'Zaman Makinesi arşivi.',
    en: 'Zaman Makinesi archive.',
  },
  'al.alertFail': {
    tr: 'PDF albüm oluşturulamadı.',
    en: 'The PDF album could not be created.',
  },
  'al.title': {
    tr: 'TARİH ALBÜMÜ & GEZGİN KOLEKSİYONU',
    en: 'HISTORY ALBUM & TRAVELER COLLECTION',
  },
  'al.badge': {
    tr: 'PDF & BASKI',
    en: 'PDF & PRINT',
  },
  'al.sub': {
    tr: 'Tüm çağlardaki fotoğraflarınızı antika bir deri ciltli aile albümü şeklinde inceleyin ve tek tıkla PDF olarak indirin.',
    en: 'Browse your photos from every era as an antique leather-bound family album and download them as a PDF with one click.',
  },
  'al.photos': {
    tr: 'Fotoğrafları İndir',
    en: 'Download Photos',
  },
  'al.compiling': {
    tr: 'Albüm Derleniyor...',
    en: 'Compiling Album...',
  },
  'al.pdf': {
    tr: 'Koleksiyonu PDF Olarak İndir',
    en: 'Download Collection as PDF',
  },
  'al.upload': {
    tr: 'Fotoğraf Yükle →',
    en: 'Upload Photo →',
  },
  'al.page': {
    tr: 'SAYFA NO: ',
    en: 'PAGE NO: ',
  },
  'al.d1.year': {
    tr: '1920’ler',
    en: '1920s',
  },
  'vm.frame': {
    tr: 'KARE: {i} / {n}',
    en: 'FRAME: {i} / {n}',
  },
  'vm.percent': {
    tr: '%{n}',
    en: '{n}%',
  },
  'vm.recording': {
    tr: 'Video Kaydediliyor (%{n})...',
    en: 'Recording Video ({n}%)...',
  },
  'vm.today': {
    tr: '2026 GÜNÜMÜZ',
    en: '2026 PRESENT DAY',
  },
  'vm.canvasSub': {
    tr: '9:16 VERTICAL REELS KLİP',
    en: '9:16 VERTICAL REELS CLIP',
  },
  'vm.alertFail': {
    tr: 'Tarayıcınızda video kaydı başlatılamadı.',
    en: 'Video recording could not be started in your browser.',
  },
  'vm.title': {
    tr: '9:16 ZAMAN TÜNELİ KLİBİ (REELS)',
    en: '9:16 TIME TUNNEL CLIP (REELS)',
  },
  'vm.live': {
    tr: 'CANLI',
    en: 'LIVE',
  },
  'vm.download': {
    tr: '9:16 Video Olarak İndir (Reels / TikTok)',
    en: 'Download as 9:16 Video (Reels / TikTok)',
  },
  'vs.th.present.year': {
    tr: '2026',
    en: '2026',
  },
  'vs.th.present.title': {
    tr: 'Günümüz — Orijinal Görünüm',
    en: 'Today — Original Look',
  },
  'vs.th.1920s.year': {
    tr: '1920’ler',
    en: '1920s',
  },
  'vs.th.1920s.title': {
    tr: 'Great Gatsby & Caz Çağı',
    en: 'Great Gatsby & Jazz Age',
  },
  'vs.th.ottoman.year': {
    tr: '1550',
    en: '1550',
  },
  'vs.th.ottoman.title': {
    tr: 'Osmanlı Saray İhtişamı & Kaftan',
    en: 'Ottoman Palace Splendor & Caftan',
  },
  'vs.th.wild_west.year': {
    tr: '1885',
    en: '1885',
  },
  'vs.th.wild_west.title': {
    tr: 'Vahşi Batı & Şerif Yeleği',
    en: 'Wild West & Sheriff Vest',
  },
  'vs.th.egypt.year': {
    tr: 'M.Ö. 1350',
    en: '1350 BC',
  },
  'vs.th.egypt.title': {
    tr: 'Antik Mısır Altın Zarafeti',
    en: 'Ancient Egyptian Golden Elegance',
  },
  'vs.th.cyberpunk.year': {
    tr: '2077',
    en: '2077',
  },
  'vs.th.cyberpunk.title': {
    tr: 'Cyberpunk Neon & Sibernetik',
    en: 'Cyberpunk Neon & Cybernetics',
  },
  'vs.stagesT': {
    tr: ' Kıyafet Dönüşüm Aşamaları ({n} Çağ)',
    en: ' Outfit Transformation Stages ({n} Eras)',
  },
  'vs.recordingLabel': {
    tr: 'KAYDEDİLİYOR %{n}',
    en: 'RECORDING {n}%',
  },
  'vs.processingVideo': {
    tr: 'Video İşleniyor (%{n})...',
    en: 'Processing Video ({n}%)...',
  },
  'vs.defaultNote': {
    tr: 'Kıyafetler rüzgarda canlı dalgalansın, altın enerji dalgasıyla çağlar arası kesintisiz ve akıcı dönüşsün.',
    en: 'Let the clothes ripple lively in the wind and transform seamlessly and fluidly between eras with a wave of golden energy.',
  },
  'vs.status1': {
    tr: '[1/3] Fal.ai sunucusuna bağlanılıyor...',
    en: '[1/3] Connecting to the Fal.ai server...',
  },
  'vs.toastOk': {
    tr: 'Fal.ai Videosu Başarıyla Oluşturuldu!',
    en: 'Fal.ai video created successfully!',
  },
  'vs.failed': {
    tr: 'Fal.ai işlemi başarısız oldu.',
    en: 'The Fal.ai operation failed.',
  },
  'vs.toastBg': {
    tr: 'Video arka planda işleniyor...',
    en: 'The video is being processed in the background...',
  },
  'vs.errGeneric': {
    tr: 'Fal.ai video üretimi sırasında bir hata oluştu.',
    en: 'An error occurred during Fal.ai video generation.',
  },
  'vs.title': {
    tr: 'FAL.AI OMNI LATEST — CANLI VİDEO & KIYAFET DÖNÜŞÜMÜ',
    en: 'FAL.AI OMNI LATEST — LIVE VIDEO & OUTFIT TRANSFORMATION',
  },
  'vs.desc': {
    tr: 'Fal.ai Omni Latest / Veo 2 motoru ile tek fotoğraftaki insan canlanır, rüzgarda kıyafetleri dalgalanır ve animasyonla çağlar arası kıyafet değiştirir.',
    en: 'With the Fal.ai Omni Latest / Veo 2 engine, the person in a single photo comes to life, their clothes ripple in the wind, and they change outfits between eras with animation.',
  },
  'vs.pick': {
    tr: 'Farklı Fotoğraf Seç',
    en: 'Choose a Different Photo',
  },
  'vs.checkKey': {
    tr: '🔑 Anahtarı Kontrol Et',
    en: '🔑 Check the Key',
  },
  'vs.processing': {
    tr: 'FAL.AI İŞLENİYOR',
    en: 'FAL.AI PROCESSING',
  },
  'vs.speedFast': {
    tr: '⚡ HIZLI',
    en: '⚡ FAST',
  },
  'vs.speedCinema': {
    tr: '🐌 SİNEMA',
    en: '🐌 CINEMA',
  },
  'vs.speedNormal': {
    tr: '⏱ NORMAL',
    en: '⏱ NORMAL',
  },
  'vs.computing': {
    tr: 'Fal.ai Omni Hesaplanıyor...',
    en: 'Fal.ai Omni Is Computing...',
  },
  'vs.generate': {
    tr: 'Fal.ai Omni Latest ile Video Üret',
    en: 'Generate Video with Fal.ai Omni Latest',
  },
  'vs.dlAi': {
    tr: 'Oluşturulan AI Videoyu İndir (MP4)',
    en: 'Download the Generated AI Video (MP4)',
  },
  'vs.dlLive': {
    tr: 'Canlı Kıyafet Videosunu İndir (60 FPS)',
    en: 'Download the Live Outfit Video (60 FPS)',
  },
  'vs.settings': {
    tr: ' Fal.ai Model & Motor Ayarları',
    en: ' Fal.ai Model & Engine Settings',
  },
  'vs.setKey': {
    tr: 'Fal.ai Key Ayarla',
    en: 'Set Fal.ai Key',
  },
  'vs.recommended': {
    tr: 'Önerilen',
    en: 'Recommended',
  },
  'vs.promptLabel': {
    tr: 'Fal.ai Hareket & Kıyafet Dönüşüm Talimatı (Prompt):',
    en: 'Fal.ai Motion & Outfit Transformation Instruction (Prompt):',
  },
  'vs.preset1': {
    tr: '⚡ Hızlı ve Akıcı Kıyafet Dönüşümü',
    en: '⚡ Fast and Fluid Outfit Transformation',
  },
  'vs.preset2': {
    tr: '🌊 Güçlü Rüzgar ve Kumaş Dalgalanması',
    en: '🌊 Strong Wind and Fabric Ripple',
  },
  'vs.preset3': {
    tr: '✨ Altın Enerji Parçacıkları ve Işık Dalgası',
    en: '✨ Golden Energy Particles and Light Wave',
  },
  'vs.seamless': {
    tr: 'Kesintisiz Akış',
    en: 'Seamless Flow',
  },
  'vs.liveBadge': {
    tr: 'CANLI',
    en: 'LIVE',
  },
  'vs.keyTitle': {
    tr: ' Fal.ai API Anahtarınızı (FAL_KEY) Girin',
    en: ' Enter Your Fal.ai API Key (FAL_KEY)',
  },
  'vs.keyDesc': {
    tr: 'Fal.ai Omni / Veo 2 video motorunu çalıştırmak için lütfen Fal.ai anahtarınızı girin:',
    en: 'Please enter your Fal.ai key to run the Fal.ai Omni / Veo 2 video engine:',
  },
  'vs.keySave': {
    tr: 'Kaydet & Video Üret',
    en: 'Save & Generate Video',
  },
};
