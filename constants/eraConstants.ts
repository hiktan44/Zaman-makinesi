export type EraCategory = 'all' | 'classic_decades' | 'ancient' | 'ottoman_east' | 'retro' | 'future';

export interface EraDefinition {
    id: string;
    yearDisplay: string;
    titleTr: string;
    titleEn: string;
    category: 'classic_decades' | 'ancient' | 'ottoman_east' | 'retro' | 'future';
    icon: string;
    badge: string;
    bgGradient: string;
    bgImage: string;
    promptEn: string;
    newspaperHeadlineTr: string;
    newspaperSubTr: string;
    historicalFactTr: string;
}

export const ERA_CATEGORIES: { id: EraCategory; labelTr: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelTr: '✨ Tüm Çağlar', labelEn: 'All Eras', icon: '✨' },
    { id: 'classic_decades', labelTr: '⏳ On Yıllık Zaman Tüneli (1860-2040)', labelEn: 'Decades (1860-2040)', icon: '⏳' },
    { id: 'ancient', labelTr: '🏛️ Antik & Efsaneler', labelEn: 'Ancient & Legends', icon: '🏛️' },
    { id: 'ottoman_east', labelTr: '🕌 Osmanlı & Doğu', labelEn: 'Ottoman & Orient', icon: '🕌' },
    { id: 'retro', labelTr: '📻 Retro & 20. Yüzyıl', labelEn: 'Retro 20th Century', icon: '📻' },
    { id: 'future', labelTr: '🚀 Gelecek & Siber', labelEn: 'Future & Cyber', icon: '🚀' },
];

export const ERAS: EraDefinition[] = [
    // ==========================================
    // 1. KLASİK ON YILLIK ZAMAN TÜNELİ (1860s - 2040s)
    // ==========================================
    {
        id: '1860s',
        yearDisplay: '1860’lar',
        titleTr: '1860’lar — Viktorya & İlk Fotoğraflar',
        titleEn: '1860s Victorian Era',
        category: 'classic_decades',
        icon: '📷',
        badge: 'Dagerreyotip',
        bgGradient: 'from-amber-950/80 via-stone-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in authentic 1860s Victorian style daguerreotype photograph. High stiff collar, wool frock coat or corset dress, soft sepia plate tint with vintage vignette. Strictly preserve facial features.',
        newspaperHeadlineTr: 'FOTOĞRAFÇILIKTA YENİ ÇAĞ: 1860’LARDA TARİHİ POZLAR',
        newspaperSubTr: 'Cam levhalara basılan fotoğraflarla hatıralar ilk kez ölümsüzleşiyor.',
        historicalFactTr: '1860’larda bir portre fotoğrafı çektirmek için insanların dakikalarca hareketsiz durması gerekirdi.'
    },
    {
        id: '1870s',
        yearDisplay: '1870’ler',
        titleTr: '1870’ler — Buhar Çağı & Sanayi Devrimi',
        titleEn: '1870s Industrial Era',
        category: 'classic_decades',
        icon: '🚂',
        badge: 'Sanayi Devrimi',
        bgGradient: 'from-stone-900 via-amber-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1870s industrial revolution era clothing, tailored wool vest, pocket watch chain, Victorian atmosphere with steam train aesthetic. Preserve exact facial likeness.',
        newspaperHeadlineTr: 'DEMİRYOLLARI VE FABRİKALAR ÇAĞI: 1870 DÜNYASI',
        newspaperSubTr: 'Buharlı lokomotifler kıtaları birbirine bağlarken yeni bir yüzyıl müjdeleniyor.',
        historicalFactTr: '1870’lerde cep saatleri ve yelek zincirleri dönemin en büyük prestij sembolleri arasındaydı.'
    },
    {
        id: '1880s',
        yearDisplay: '1880’ler',
        titleTr: '1880’ler — Gilded Age & Vahşi Batı',
        titleEn: '1880s Gilded Age',
        category: 'classic_decades',
        icon: '🤠',
        badge: 'Gilded Age',
        bgGradient: 'from-amber-900 via-yellow-950 to-stone-950',
        bgImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1880s authentic American or European frontier attire, leather duster coat, felt hat, tintype warm tone photograph preserving facial features.',
        newspaperHeadlineTr: '1880: ALTIN MADENLERİ VE YENİ ŞEHİRLERİN DOĞUŞU',
        newspaperSubTr: 'Kovboylar, tüccarlar ve kaşifler yeni dünyanın sınırlarını çiziyor.',
        historicalFactTr: '1880’lerde elektrik ampulünün icadı şehir gecelerini sonsuza dek aydınlattı.'
    },
    {
        id: '1890s',
        yearDisplay: '1890’lar',
        titleTr: '1890’lar — Belle Époque Zarafeti',
        titleEn: '1890s Belle Époque',
        category: 'classic_decades',
        icon: '🎭',
        badge: 'Belle Époque',
        bgGradient: 'from-purple-950 via-stone-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1890s Belle Époque high society fashion. Tailored velvet coat or extravagant Edwardian lace dress with feathers, warm platinum print photo texture preserving face.',
        newspaperHeadlineTr: '1890’LARIN SANAT VE ZARAFET ÇAĞI: BELLE ÉPOQUE',
        newspaperSubTr: 'Paris ve İstanbul salonlarında müzik, edebiyat ve mimari zirvede.',
        historicalFactTr: '1890’larda Eyfel Kulesi açılmış ve dünya sinemanın ilk hareketli görüntüleriyle tanışmıştı.'
    },
    {
        id: '1900s',
        yearDisplay: '1900’ler',
        titleTr: '1900’ler — Yeni Yüzyılın Şafağı',
        titleEn: '1900s Edwardian Dawn',
        category: 'classic_decades',
        icon: '🎩',
        badge: 'Milenyum Başlangıcı',
        bgGradient: 'from-slate-900 via-stone-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1900s Edwardian style, three-piece wool suit with silk tie or Gibson Girl styled hair with high lace collar. Retaining facial likeness with vintage black and white film.',
        newspaperHeadlineTr: 'YENİ YÜZYILA MERHABA: 1900 YILININ İLK GÜNLERİ',
        newspaperSubTr: '20. yüzyıl büyük umutlar, yeni icatlar ve dev adımlarla başladı.',
        historicalFactTr: '1900 yılında Paris Dünya Fuarı’nda yürüyen merdivenler ve sesli sinema ilk kez tanıtıldı.'
    },
    {
        id: '1910s',
        yearDisplay: '1910’lar',
        titleTr: '1910’lar — Titanic & Erken Havacılık',
        titleEn: '1910s Aviation & Titanic',
        category: 'classic_decades',
        icon: '🚢',
        badge: 'İlk Uçuşlar',
        bgGradient: 'from-blue-950 via-slate-900 to-stone-950',
        bgImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1910s attire, aviator leather coat with goggles or transatlantic luxury passenger formal wear. Authentic vintage photographic texture preserving facial fidelity.',
        newspaperHeadlineTr: '1910: GÖKLER VE OKYANUSLAR FETHEDİLİYOR!',
        newspaperSubTr: 'İlk zeplinler ve transatlantik gemilerle dünya küçülüyor.',
        historicalFactTr: '1910’larda havacılığın öncüleri ilk kez tek motorlu uçaklarla kıtalararası uçuş denemeleri yaptı.'
    },
    {
        id: '1920s',
        yearDisplay: '1920’ler',
        titleTr: '1920’ler — Great Gatsby & Caz Çağı',
        titleEn: '1920s Roaring Twenties',
        category: 'classic_decades',
        icon: '🎷',
        badge: 'Kükreyen 20’ler',
        bgGradient: 'from-amber-900 via-yellow-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a glamorous 1920s Jazz Age icon, pinstripe tuxedo with champagne flute or beaded flapper dress with feather headband in art-deco speakeasy. Preserve face.',
        newspaperHeadlineTr: '1920’LERİN CAZ ÇILGINLIĞI: DANS VE MODA DEVRİMİ!',
        newspaperSubTr: 'Charleston dansları ve caz orkestraları tüm dünyayı ritmiyle sarıyor.',
        historicalFactTr: '1920’lerde radyo yayınlarının evlere girmesiyle birlikte müzik ilk kez küresel bir fenomen haline geldi.'
    },
    {
        id: '1930s',
        yearDisplay: '1930’lar',
        titleTr: '1930’lar — Art Deco & Klasik Hollywood',
        titleEn: '1930s Hollywood Glamour',
        category: 'classic_decades',
        icon: '🎬',
        badge: 'Altın Sinema',
        bgGradient: 'from-stone-900 via-slate-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1930s Golden Age of Hollywood film style. Silver screen lighting, tailored double-breasted suit or silk satin evening gown with soft glamorous studio lighting. Retain exact face.',
        newspaperHeadlineTr: '1930’LARIN GÜMÜŞ PERDESİ: HOLLYWOOD EFSANELERİ',
        newspaperSubTr: 'Sinemanın altın çağında yıldızlar göz kamaştırıyor.',
        historicalFactTr: '1930’larda ilk renkli sinema filmleri ve radyo tiyatroları milyonları ekran başına kilitledi.'
    },
    {
        id: '1940s',
        yearDisplay: '1940’lar',
        titleTr: '1940’lar — Film Noir & Zarafet',
        titleEn: '1940s Film Noir Style',
        category: 'classic_decades',
        icon: '🕵️',
        badge: 'Film Noir',
        bgGradient: 'from-slate-900 via-neutral-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in iconic 1940s Film Noir style. Fedora hat, trench coat with upturned collar, dramatic Venetian blind shadow lighting, holding vintage micro-camera. Preserve facial identity.',
        newspaperHeadlineTr: '1940’LAR: CESARET, ŞEREF VE YENİDEN İNŞA ÇAĞI',
        newspaperSubTr: 'Dünya zorlu yılları geride bırakıp barış ve kardeşliği inşa ediyor.',
        historicalFactTr: '1940’ların sonunda ilk elektronik bilgisayar ENIAC icat edildi ve teknoloji çağının temeli atıldı.'
    },
    {
        id: '1950s',
        yearDisplay: '1950’ler',
        titleTr: '1950’ler — Rockabilly & Retro Diner',
        titleEn: '1950s Rockabilly',
        category: 'classic_decades',
        icon: '🎸',
        badge: 'Elvis Çağı',
        bgGradient: 'from-rose-950 via-slate-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in iconic 1950s rockabilly style. Black leather biker jacket, pompadour hair or polka-dot swing dress in a neon retro diner with red booths. Kodachrome film preserving face.',
        newspaperHeadlineTr: '1950: ROCK’N ROLL VE JUKEBOX ÇILGINLIĞI!',
        newspaperSubTr: 'Elvis Presley ve yeni nesil müzik gençliği dans pistlerine döküyor.',
        historicalFactTr: '1950’lerde evlere giren renkli televizyonlar popüler kültürün doğuşunu sağladı.'
    },
    {
        id: '1960s',
        yearDisplay: '1960’lar',
        titleTr: '1960’lar — Çiçek Çocuklar & Beatlemania',
        titleEn: '1960s Woodstock & Peace',
        category: 'classic_decades',
        icon: '☮️',
        badge: 'Barış & Müzik',
        bgGradient: 'from-emerald-950 via-teal-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in vibrant 1960s bohemian style. Suede fringe jacket, round tinted sunglasses, peace necklace, 1969 festival atmosphere with warm vintage film grain. Preserve face.',
        newspaperHeadlineTr: '1969: İNSANOĞLU AY’DA! BARIŞ VE ÖZGÜRLÜK ÇAĞI',
        newspaperSubTr: 'Apollo 11 Ay’a indi, Woodstock festivali milyonları barışla birleştirdi.',
        historicalFactTr: '20 Temmuz 1969’da Neil Armstrong Ay yüzeyine ilk adımı atarak insanlık tarihini değiştirdi.'
    },
    {
        id: '1970s',
        yearDisplay: '1970’ler',
        titleTr: '1970’ler — Disko Ateşi & Studio 54',
        titleEn: '1970s Disco Fever',
        category: 'classic_decades',
        icon: '🪩',
        badge: 'Disko Ateşi',
        bgGradient: 'from-purple-950 via-pink-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a glamorous 1970s disco icon. Wide open collar silk shirt or glitter jumpsuit, platform shoes under spinning disco mirror ball with rainbow lights. Preserve face.',
        newspaperHeadlineTr: '1970’LER: DİSKO MÜZİK VE PARILTI DÜNYAYI SARDI',
        newspaperSubTr: 'Studio 54 kapılarında kuyruklar uzarken disko modası sokaklara taşıyor.',
        historicalFactTr: '1970’lerde ilk video oyun konsolları (Pong, Atari) oturma odalarına girdi.'
    },
    {
        id: '1980s',
        yearDisplay: '1980’ler',
        titleTr: '1980’ler — Synthwave & Neon Şehir',
        titleEn: '1980s Synthwave & Neon',
        category: 'classic_decades',
        icon: '🕹️',
        badge: 'Retro Neon',
        bgGradient: 'from-fuchsia-950 via-purple-950 to-cyan-950',
        bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in iconic 1980s synthwave style. Oversized pastel blazer with rolled sleeves, aviator glasses, Walkman headphones, surrounded by glowing magenta neon grid. Preserve face.',
        newspaperHeadlineTr: '1980: DİJİTAL ÇAĞIN DOĞUŞU VE ELEKTRONİK MÜZİK',
        newspaperSubTr: 'Kasetçalarlar, atari salonları ve synthwave ritimleri 80’lere damga vuruyor.',
        historicalFactTr: '1980’lerde Walkman ve ilk kişisel bilgisayarlar (Commodore 64) dünyayı değiştirdi.'
    },
    {
        id: '1990s',
        yearDisplay: '1990’lar',
        titleTr: '1990’lar — Grunge & Sokak Modası',
        titleEn: '1990s Grunge & Streetwear',
        category: 'classic_decades',
        icon: '🛹',
        badge: 'MTV & CD Dönemi',
        bgGradient: 'from-teal-950 via-slate-900 to-stone-950',
        bgImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 1990s grunge and streetwear aesthetic. Plaid flannel shirt, band tee, baggy denim, backwards cap, holding portable CD player, 90s disposable camera texture. Preserve face.',
        newspaperHeadlineTr: '1990’LAR: İNTERNETİN DOĞUŞU VE ALTERNATİF MÜZİK',
        newspaperSubTr: 'World Wide Web dünyayı birbirine bağlarken gençlik kendi tarzını oluşturuyor.',
        historicalFactTr: '1995’te internetin halka açılmasıyla birlikte dijital çağ resmi olarak başladı.'
    },
    {
        id: '2000s',
        yearDisplay: '2000’ler',
        titleTr: '2000’ler — Y2K & Milenyum Estetiği',
        titleEn: '2000s Y2K Millennium',
        category: 'classic_decades',
        icon: '💿',
        badge: 'Y2K & Kapaklı Telefon',
        bgGradient: 'from-blue-950 via-indigo-950 to-pink-950',
        bgImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 2000s Y2K pop star aesthetic. Shiny silver metallic puffer jacket, rimless gradient sunglasses, flip phone in hand, millennium gloss glow. Preserve face.',
        newspaperHeadlineTr: '2000: YENİ BİNYIL VE CEP TELEFONU ÇILGINLIĞI',
        newspaperSubTr: '21. yüzyıl fütüristik gümüş kıyafetler ve dijital müzikle başladı.',
        historicalFactTr: '2000’lerin başında ilk kameralı telefonlar ve MP3 çalarlar günlük hayatın vazgeçilmezi oldu.'
    },
    {
        id: '2010s',
        yearDisplay: '2010’lar',
        titleTr: '2010’lar — Akıllı Telefonlar & Hipster',
        titleEn: '2010s Hipster & Smart Era',
        category: 'classic_decades',
        icon: '📱',
        badge: 'Sosyal Medya Çağı',
        bgGradient: 'from-slate-900 via-stone-800 to-black',
        bgImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 2010s modern hipster aesthetic. Denim jacket, slim chinos, stylish round horn-rimmed glasses, artisan third-wave coffee shop background with warm indie film filter. Preserve face.',
        newspaperHeadlineTr: '2010’LAR: SOSYAL MEDYA VE AKILLI TELEFON ÇAĞI',
        newspaperSubTr: 'Instagram, dokunmatik ekranlar ve mobil internetle dünya anlık iletişime geçti.',
        historicalFactTr: '2010’lar mobil uygulamaların ve sosyal medyanın insan hayatını baştan aşağı değiştirdiği on yıldır.'
    },
    {
        id: '2020s',
        yearDisplay: '2020’ler',
        titleTr: '2020’ler — Günümüz & Modern Estetik',
        titleEn: '2020s Modern Era',
        category: 'classic_decades',
        icon: '⚡',
        badge: 'Yapay Zeka Çağı',
        bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
        bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in ultra-crisp modern 2020s aesthetic. Minimalist luxury streetwear, AirPods Max on neck, modern urban loft lighting, pristine 8k studio clarity. Preserve face.',
        newspaperHeadlineTr: '2020’LER: YAPAY ZEKA DEVRİMİ VE DİJİTAL DÖNÜŞÜM',
        newspaperSubTr: 'Yapay zeka modelleri ve elektrikli araçlar hayatın merkezine yerleşti.',
        historicalFactTr: '2020’ler insanlık tarihinde yapay zekanın ilk kez kreatif içerik ve görsel üretmeye başladığı çağdır.'
    },
    {
        id: '2030s',
        yearDisplay: '2030’lar',
        titleTr: '2030’lar — Otonom Şehirler & Yeşil Enerji',
        titleEn: '2030s Smart Cities',
        category: 'classic_decades',
        icon: '🏙️',
        badge: 'Akıllı Şehirler',
        bgGradient: 'from-teal-950 via-emerald-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in near-future 2030s attire. Smart biometric fabric jacket, subtle augmented reality smart glasses, in a lush green solar-powered futuristic sky-garden metropolis. Preserve face.',
        newspaperHeadlineTr: '2030: OTONOM ULAŞIM VE GÖKDELEN BAHÇELERİ',
        newspaperSubTr: 'Yapay zeka kontrollü otonom araçlar ve yeşil enerji şehirleri dönüştürdü.',
        historicalFactTr: '2030 projeksiyonlarında artırılmış gerçeklik gözlüklerinin telefonların yerini alması beklenmektedir.'
    },
    {
        id: '2040s',
        yearDisplay: '2040’lar',
        titleTr: '2040’lar — Holografik Yaşam & Kuantum',
        titleEn: '2040s Holographic Future',
        category: 'classic_decades',
        icon: '🔮',
        badge: 'Holo-Teknoloji',
        bgGradient: 'from-cyan-950 via-blue-950 to-fuchsia-950',
        bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo in 2040s futuristic style. Sleek bioluminescent smart clothing, interactive floating holographic wrist interfaces, overlooking a magnetic levitation transit hub. Preserve face.',
        newspaperHeadlineTr: '2040: KUANTUM BİLGİSAYARLAR VE DİJİTAL EVREN',
        newspaperSubTr: 'Hologram iletişimi mesafeleri sıfıra indirirken kuantum çağı başladı.',
        historicalFactTr: '2040’larda kuantum internetin tüm dünyada saniyede trilyonlarca işlemi güvenle yapacağı öngörülmektedir.'
    },

    // ==========================================
    // 2. ANTİK & EFSANEVİ ÇAĞLAR
    // ==========================================
    {
        id: 'ancient_egypt',
        yearDisplay: 'M.Ö. 1350',
        titleTr: 'Antik Mısır Firavunu / Kraliçesi',
        titleEn: 'Ancient Egyptian Pharaoh / Queen',
        category: 'ancient',
        icon: '🏺',
        badge: 'Nil Krallığı',
        bgGradient: 'from-amber-600/90 via-yellow-600 to-black',
        bgImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a grand Ancient Egyptian Pharaoh or Royal Queen circa 1350 BC. Wearing an opulent Nemes headcloth or jeweled lotus headdress, broad collar gold necklace with lapis lazuli and turquoise gems, regal linen garments, standing inside a magnificent hieroglyph-carved stone temple lit by warm golden torches. Exact facial resemblance preserved.',
        newspaperHeadlineTr: 'GÜNEŞ TANRISININ ÇOCUKLARI: PİRAMİTLER YÜKSELİYOR!',
        newspaperSubTr: 'Nil nehrinin bereketiyle taçlanan krallıkta asrın en büyük tapınağı açıldı.',
        historicalFactTr: 'Antik Mısır’da firavunların taktığı altın başlıklar ve takılar ölümsüzlük ve tanrısal gücün simgesiydi.'
    },
    {
        id: 'ancient_rome',
        yearDisplay: 'M.S. 80',
        titleTr: 'Antik Roma Senatörü / Gladyatör',
        titleEn: 'Ancient Roman Senator / Gladiator',
        category: 'ancient',
        icon: '🏛️',
        badge: 'Kolezyum Çağı',
        bgGradient: 'from-red-900/90 via-amber-800 to-black',
        bgImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as an influential Roman Senator with a pristine white and purple-bordered toga, or a brave Roman Centurion in polished bronze armor and crimson cloak, standing in the Roman Forum or the Colosseum with marble statues and sunlit colonnades. Hyperrealistic historical photograph style preserving face.',
        newspaperHeadlineTr: 'ROMA SENATOSUNDA TARİHİ KARAR: İMPARATORLUK GENİŞLİYOR',
        newspaperSubTr: 'Forum meydanında toplanan on binlerce Romalı zafer alayını coşkuyla karşıladı.',
        historicalFactTr: 'Roma togasındaki erguvan rengi bordür, yalnızca senatörler ve en yüksek devlet yöneticileri tarafından giyilebilirdi.'
    },
    {
        id: 'ancient_greece',
        yearDisplay: 'M.Ö. 430',
        titleTr: 'Antik Yunan Filozofu / Olimpos Kahramanı',
        titleEn: 'Ancient Greek Philosopher / Hero',
        category: 'ancient',
        icon: '⚡',
        badge: 'Akropolis',
        bgGradient: 'from-blue-900/90 via-sky-800 to-black',
        bgImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as an influential Ancient Greek philosopher or Olympian hero in 430 BC Athens. Dressed in white chiton with gold laurel wreath crown, standing in the Parthenon overlooking the Aegean Sea in warm Mediterranean sunset lighting. Preserving exact facial features.',
        newspaperHeadlineTr: 'AKROPOLİS’TE BÜYÜK FELSEFE VE BİLİM ŞÖLENİ',
        newspaperSubTr: 'Sokrates ve Atina meclisi insan aklının ve demokrasinin temellerini atıyor.',
        historicalFactTr: 'Antik Yunan’da zeytin dalından yapılan taçlar Olimpiyat oyunlarında en büyük onur ödülüydü.'
    },
    {
        id: 'viking_age',
        yearDisplay: 'M.S. 850',
        titleTr: 'Viking Savaşçısı & Jarl',
        titleEn: 'Viking Warrior & Jarl',
        category: 'ancient',
        icon: '🛡️',
        badge: 'Kuzey Fiyortları',
        bgGradient: 'from-slate-800/90 via-cyan-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a legendary Viking warrior or shield-maiden in 850 AD Scandinavia. Wearing rugged fur-lined leather armor, chainmail, braided hair with nordic beads, holding an engraved wooden battle shield, standing on the mist-covered shore of a dramatic Norwegian fjord with longships in the background. Ultra-detailed, preserving facial features perfectly.',
        newspaperHeadlineTr: 'KUZEYİN KARTALLARI YOLA ÇIKTI: FİYORTLARDAN OKYANUSLARA',
        newspaperSubTr: 'İskandinav denizcileri yeni rotalar ve efsanevi keşifler için yelken açtı.',
        historicalFactTr: 'Vikingler pusula olmadan yalnızca güneş taşları ve yıldızların konumunu okuyarak binlerce mil yol alırdı.'
    },
    {
        id: 'renaissance_italy',
        yearDisplay: '1505',
        titleTr: 'Rönesans Floransa Sanatçısı / Soylusu',
        titleEn: 'Renaissance Florentine Noble',
        category: 'ancient',
        icon: '🎨',
        badge: 'Da Vinci Çağı',
        bgGradient: 'from-amber-900/90 via-stone-800 to-black',
        bgImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a distinguished Italian Renaissance nobleman or noblewoman painted with the masterly sfumato and chiaroscuro lighting of Leonardo da Vinci. Dressed in rich velvet doublet with fur trim, standing on a classical Florentine arched terrace overlooking Tuscany hills. Perfect oil painting portrait keeping authentic face.',
        newspaperHeadlineTr: 'SANAT VE BİLİMİN ALTIN ÇAĞI: FLORANSA’DA YENİDEN DOĞUŞ',
        newspaperSubTr: 'Usta sanatçılar ve düşünürler insanlık tarihini değiştirecek eserleri sergiliyor.',
        historicalFactTr: 'Rönesans döneminde Floransa sokaklarında yürüyen bir soylu, Da Vinci veya Michelangelo ile aynı kahvehanede karşılaşabilirdi.'
    },

    // ==========================================
    // 3. OSMANLI & DOĞU MEDENİYETLERİ
    // ==========================================
    {
        id: 'ottoman_sultan',
        yearDisplay: '1550',
        titleTr: 'Osmanlı Saray İhtişamı & Sultan',
        titleEn: 'Ottoman Imperial Court',
        category: 'ottoman_east',
        icon: '👑',
        badge: 'Topkapı Sarayı',
        bgGradient: 'from-amber-700/90 via-yellow-600 to-black',
        bgImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a majestic Ottoman royal dignitary in the 16th century golden age of Istanbul. The person is dressed in luxurious gold-embroidered silk kaftan, a jewel-encrusted turban or regal Ottoman headdress, against a backdrop of classical Iznik tiled palace interior with ornate carpets and arched marble pillars. The facial features, gaze, and identity of the person in the photo must be strictly preserved with hyperrealistic 8k details.',
        newspaperHeadlineTr: 'SARAYDA BÜYÜK KABUL: CİHAN DEVLETİNDE YENİ DEVİR!',
        newspaperSubTr: 'Payitahtta düzenlenen görkemli divan toplantısında yeni elçi ve saray erkânı tanıtıldı.',
        historicalFactTr: '16. yüzyılda Osmanlı sarayında kaftanlar ipek, kadife ve altın tellerle özel saray atölyelerinde aylarca süren el işçiliğiyle dokunurdu.'
    },
    {
        id: 'ottoman_levanten',
        yearDisplay: '1890',
        titleTr: 'Pera & Levanten İstanbul',
        titleEn: '1890s Pera & Orient Express',
        category: 'ottoman_east',
        icon: '🎩',
        badge: 'Beyoğlu 1890',
        bgGradient: 'from-stone-700/90 via-amber-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as an elegant 1890s Pera (Istanbul) gentleman or aristocratic lady. Dressed in tailored Victorian-Ottoman fusion attire, waistcoat, monocle or ornate lace gown with a velvet parasol, standing near the historic Grand Rue de Pera with vintage horse trams and neoclassical architecture in soft sepia-tinted nostalgic photograph lighting. Preserve the exact facial identity.',
        newspaperHeadlineTr: 'ŞARK EKSPRESİ PERA PALAS’A YANAŞTI: İSTANBUL’UN ELİT GÜNLERİ',
        newspaperSubTr: 'Avrupa ve Doğu’nun kalbinin attığı Pera sokaklarında moda ve zarafet zirvede.',
        historicalFactTr: '1890’larda İstanbul Pera, Şark Ekspresi yolcularının ve dünyanın en seçkin sanatçılarının buluşma noktasıydı.'
    },
    {
        id: 'feudal_japan',
        yearDisplay: '1600',
        titleTr: 'Feodal Samuray & Kyoto',
        titleEn: 'Feudal Samurai & Kyoto',
        category: 'ottoman_east',
        icon: '⚔️',
        badge: 'Edo Dönemi',
        bgGradient: 'from-red-950/90 via-rose-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a noble samurai warrior or elegant aristocrat in 1600s Feudal Japan. Wearing authentic master-crafted dark lacquered samurai armor with katana or an exquisite traditional silk kimono, standing near a serene traditional Japanese wooden pagoda garden with cherry blossom petals falling. Photorealistic with authentic film texture, strictly maintaining facial features.',
        newspaperHeadlineTr: 'SAMURAY ONUR KANUNU: KYOTO’DA BÜYÜK BULUŞMA',
        newspaperSubTr: 'Uzakdoğu’nun efsanevi savaşçıları barış ve onur meclisinde bir araya geldi.',
        historicalFactTr: 'Edo döneminde samuray kılıçları yalnızca silah değil, taşıyan kişinin ruhunun ve onurunun sembolü sayılırdı.'
    },
    {
        id: 'persian_palace',
        yearDisplay: 'M.Ö. 500',
        titleTr: 'Pers İpek Sarayı & Zerdüşt Çağı',
        titleEn: 'Persian Silk Palace & Persepolis',
        category: 'ottoman_east',
        icon: '🕌',
        badge: 'Persepolis',
        bgGradient: 'from-emerald-950/90 via-teal-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a regal Persian royal noble in 500 BC Persepolis. Wearing a rich emerald-green and gold-brocaded silk robe, golden torc necklace, standing among the grand carved stone pillars and lion reliefs of Persepolis under a starry desert night sky. Preserve face.',
        newspaperHeadlineTr: 'İPEK YOLUNUN KALBİ: BÜYÜK SARAYDA DÜNYA TİCARETİ',
        newspaperSubTr: 'Doğu ile Batı’yı birleştiren ticaret yolları Persepolis’te buluşuyor.',
        historicalFactTr: 'Antik Pers krallarının saraylarında bahçeler "Pardis" (Cennet) adıyla anılır ve dünyanın ilk düzenli botanik parkları sayılırdı.'
    },

    // ==========================================
    // 4. RETRO & KÜLTÜR
    // ==========================================
    {
        id: 'wild_west_1880',
        yearDisplay: '1885',
        titleTr: 'Vahşi Batı Kovboyu / Şerifi',
        titleEn: 'Wild West Gunslinger & Sheriff',
        category: 'retro',
        icon: '🤠',
        badge: 'Wanted Posteri',
        bgGradient: 'from-amber-800/90 via-yellow-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a legendary 1880s Wild West gunslinger, sheriff, or saloon pioneer. Wearing an authentic dusty leather duster coat, cowboy hat, silver sheriff star badge, neck bandana, in an authentic dusty frontier boomtown with wooden boardwalks and saloons in warm tintype vintage photo style. Preserving facial resemblance.',
        newspaperHeadlineTr: 'ARANIYOR VEYA KAHRAMAN: KASABANIN EN HIZLI ŞERİFİ GÖREVDE!',
        newspaperSubTr: 'Vahşi Batı’nın tozlu sokaklarında adalet ve cesaret yeniden tanımlanıyor.',
        historicalFactTr: '1880’lerde Vahşi Batı’daki şerif yıldızları genellikle eritilmiş gümüş paralardan yerel demircilerce dövülürdü.'
    },

    // ==========================================
    // 5. GELECEK & SİBER EVRENLER
    // ==========================================
    {
        id: 'cyberpunk_2077',
        yearDisplay: '2077',
        titleTr: 'Cyberpunk 2077 — Neo-İstanbul',
        titleEn: 'Cyberpunk 2077 — Neon Metropolis',
        category: 'future',
        icon: '🤖',
        badge: 'Sibernetik İmplant',
        bgGradient: 'from-cyan-950/90 via-violet-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a high-tech Cyberpunk netrunner or mercenary in the year 2077. Featuring glowing cybernetic optical implants, subtle neon circuit facial tattoos, a high-collar holographic trench coat with glowing collar cables, standing on a rain-slicked neon street with flying aerodyne vehicles and massive holographic billboards. Hyperrealistic futuristic cinematic lighting preserving face.',
        newspaperHeadlineTr: 'YIL 2077: ŞEHİR BULUTLARIN ÜZERİNE YÜKSELİYOR!',
        newspaperSubTr: 'Yapay zeka ve sibernetik implantlar insan hayatının ayrılmaz parçası oldu.',
        historicalFactTr: '2077 projeksiyonunda insan beyniyle doğrudan kuantum internet ağına bağlanan nöral arayüzler öngörülmektedir.'
    },
    {
        id: 'mars_colony_2150',
        yearDisplay: '2150',
        titleTr: 'Mars Kolonisi 2150 & Kırmızı Gezegen',
        titleEn: 'Mars Colony 2150 — Red Planet Explorer',
        category: 'future',
        icon: '🪐',
        badge: 'Gezegenlerarası',
        bgGradient: 'from-orange-950/90 via-red-900 to-black',
        bgImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as an elite Mars Colony pioneer and astrophysicist in the year 2150. Wearing an ultra-modern sleek white and copper space exploration suit with a transparent illuminated visor showing their clear face, standing inside a massive biodome garden looking out at the red Martian landscape and Earth glowing in the distant night sky. Preserving facial details.',
        newspaperHeadlineTr: 'MARS’TA İLK ŞEHİR 1 MİLYON NÜFUSA ULAŞTI!',
        newspaperSubTr: 'Kızıl Gezegen’in biyolojik kubbelerinde dünya dışı ilk bağımsız yaşam döngüsü kuruldu.',
        historicalFactTr: '2150 kolonizasyon modellerinde Mars atmosferinin terraform edilerek nefes alınabilir hale getirilmesi hedeflenmektedir.'
    },
    {
        id: 'steampunk_1895',
        yearDisplay: '1895 Alt-Evren',
        titleTr: 'Steampunk Buhar Çağı Mucidi',
        titleEn: 'Steampunk Victorian Inventor',
        category: 'future',
        icon: '⚙️',
        badge: 'Buhar & Çarklar',
        bgGradient: 'from-amber-950/90 via-yellow-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a visionary Steampunk inventor and airship captain in an alternate 1895 Victorian era. Wearing brass goggles on a leather top hat, ornate clockwork mechanical wrist gadget, tailored velvet vest with brass gears and copper tubes, inside an airship navigation bridge filled with glowing vacuum tubes and steam valves. Preserving exact facial identity.',
        newspaperHeadlineTr: 'GÖKLERİN HÂKİMİ: DEV ZEPPELİN DÜNYA TURUNU TAMAMLADI',
        newspaperSubTr: 'Buhar gücü ve pirinç mekaniklerle çalışan hava gemileri ulaşımda çığır açtı.',
        historicalFactTr: 'Steampunk türü, 19. yüzyılın buhar teknolojisiyle 21. yüzyılın bilgisayar fikirlerini birleştiren büyüleyici bir kurgudur.'
    },
    {
        id: 'quantum_matrix_3000',
        yearDisplay: '3000+',
        titleTr: 'Kuantum Bilinç & Enerji Varlığı',
        titleEn: 'Quantum Matrix 3000 — Energy Being',
        category: 'future',
        icon: '🌌',
        badge: 'Saf Enerji',
        bgGradient: 'from-indigo-950/90 via-fuchsia-950 to-black',
        bgImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
        promptEn: 'Depict the person in this photo as a transcendent transhuman being in the year 3000. Luminous pure crystalline energy clothing, floating golden particle halos, cosmic nebula reflections in eyes, surrounded by hyperspace multidimensional geometric structures. Preserving facial resemblance.',
        newspaperHeadlineTr: 'YIL 3000: İNSAN BİLİNCİ EVRENİN BOYUTLARINI AŞTI',
        newspaperSubTr: 'Zaman ve mekan kavramlarının sıfırlandığı kuantum evreninde yeni bir medeniyet.',
        historicalFactTr: '3000 yılı fütüroloji tahminlerinde maddenin ve bilincin fotonik enerjiye dönüştürüleceği öngörülmektedir.'
    }
];

export const ALL_ERA_IDS = ERAS.map(e => e.id);
