export type EraCategory = 'ancient' | 'ottoman_east' | 'retro' | 'future';

export interface EraDefinition {
    id: string;
    yearDisplay: string;
    titleTr: string;
    titleEn: string;
    category: EraCategory;
    icon: string;
    badge: string;
    bgGradient: string;
    promptEn: string;
    newspaperHeadlineTr: string;
    newspaperSubTr: string;
    historicalFactTr: string;
    recommendedMusic?: string;
}

export const ERA_CATEGORIES: { id: EraCategory; labelTr: string; labelEn: string; icon: string }[] = [
    { id: 'ancient', labelTr: 'Antik & Efsaneler', labelEn: 'Ancient & Myths', icon: '🏛️' },
    { id: 'ottoman_east', labelTr: 'Osmanlı & Doğu', labelEn: 'Ottoman & Orient', icon: '🕌' },
    { id: 'retro', labelTr: 'Retro & 20. Yüzyıl', labelEn: 'Retro & 20th Century', icon: '📻' },
    { id: 'future', labelTr: 'Gelecek & Siber', labelEn: 'Future & Cyber', icon: '🚀' },
];

export const ERAS: EraDefinition[] = [
    // --- OSMANLI & DOĞU ---
    {
        id: 'ottoman_sultan',
        yearDisplay: '1550',
        titleTr: 'Osmanlı Saray İhtişamı',
        titleEn: 'Ottoman Imperial Court',
        category: 'ottoman_east',
        icon: '👑',
        badge: 'Topkapı Sarayı',
        bgGradient: 'from-amber-700 via-yellow-600 to-amber-900',
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
        bgGradient: 'from-stone-700 via-amber-800 to-stone-900',
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
        bgGradient: 'from-red-950 via-rose-900 to-black',
        promptEn: 'Depict the person in this photo as a noble samurai warrior or elegant aristocrat in 1600s Feudal Japan. Wearing authentic master-crafted dark lacquered samurai armor with katana or an exquisite traditional silk kimono, standing near a serene traditional Japanese wooden pagoda garden with cherry blossom petals falling. Photorealistic with authentic film texture, strictly maintaining facial features.',
        newspaperHeadlineTr: 'SAMURAY ONUR KANUNU: KYOTO’DA BÜYÜK BULUŞMA',
        newspaperSubTr: 'Uzakdoğu’nun efsanevi savaşçıları barış ve onur meclisinde bir araya geldi.',
        historicalFactTr: 'Edo döneminde samuray kılıçları yalnızca silah değil, taşıyan kişinin ruhunun ve onurunun sembolü sayılırdı.'
    },

    // --- ANTİK & EFSANELER ---
    {
        id: 'ancient_egypt',
        yearDisplay: 'M.Ö. 1350',
        titleTr: 'Antik Mısır Firavunu / Kraliçesi',
        titleEn: 'Ancient Egyptian Pharaoh / Queen',
        category: 'ancient',
        icon: '🏺',
        badge: 'Nil Krallığı',
        bgGradient: 'from-amber-600 via-yellow-500 to-yellow-800',
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
        bgGradient: 'from-red-900 via-amber-700 to-stone-900',
        promptEn: 'Depict the person in this photo as an influential Roman Senator with a pristine white and purple-bordered toga, or a brave Roman Centurion in polished bronze armor and crimson cloak, standing in the Roman Forum or the Colosseum with marble statues and sunlit colonnades. Hyperrealistic historical photograph style preserving face.',
        newspaperHeadlineTr: 'ROMA SENATOSUNDA TARİHİ KARAR: İMPARATORLUK GENİŞLİYOR',
        newspaperSubTr: 'Forum meydanında toplanan on binlerce Romalı zafer alayını coşkuyla karşıladı.',
        historicalFactTr: 'Roma togasındaki erguvan rengi bordür, yalnızca senatörler ve en yüksek devlet yöneticileri tarafından giyilebilirdi.'
    },
    {
        id: 'viking_age',
        yearDisplay: 'M.S. 850',
        titleTr: 'Viking Savaşçısı & Jarl',
        titleEn: 'Viking Warrior & Jarl',
        category: 'ancient',
        icon: '🛡️',
        badge: 'Kuzey Fiyortları',
        bgGradient: 'from-slate-800 via-cyan-950 to-slate-900',
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
        bgGradient: 'from-amber-900 via-stone-800 to-amber-950',
        promptEn: 'Depict the person in this photo as a distinguished Italian Renaissance nobleman or noblewoman painted with the masterly sfumato and chiaroscuro lighting of Leonardo da Vinci. Dressed in rich velvet doublet with fur trim, standing on a classical Florentine arched terrace overlooking Tuscany hills. Perfect oil painting portrait keeping authentic face.',
        newspaperHeadlineTr: 'SANAT VE BİLİMİN ALTIN ÇAĞI: FLORANSA’DA YENİDEN DOĞUŞ',
        newspaperSubTr: 'Usta sanatçılar ve düşünürler insanlık tarihini değiştirecek eserleri sergiliyor.',
        historicalFactTr: 'Rönesans döneminde Floransa sokaklarında yürüyen bir soylu, Da Vinci veya Michelangelo ile aynı kahvehanede karşılaşabilirdi.'
    },

    // --- RETRO & 20. YÜZYIL ---
    {
        id: 'wild_west_1880',
        yearDisplay: '1885',
        titleTr: 'Vahşi Batı Kovboyu / Şerifi',
        titleEn: 'Wild West Gunslinger & Sheriff',
        category: 'retro',
        icon: '🤠',
        badge: 'Wanted Posteri',
        bgGradient: 'from-amber-800 via-yellow-900 to-stone-900',
        promptEn: 'Depict the person in this photo as a legendary 1880s Wild West gunslinger, sheriff, or saloon pioneer. Wearing an authentic dusty leather duster coat, cowboy hat, silver sheriff star badge, neck bandana, in an authentic dusty frontier boomtown with wooden boardwalks and saloons in warm tintype vintage photo style. Preserving facial resemblance.',
        newspaperHeadlineTr: 'ARANIYOR VEYA KAHRAMAN: KASABANIN EN HIZLI ŞERİFİ GÖREVDE!',
        newspaperSubTr: 'Vahşi Batı’nın tozlu sokaklarında adalet ve cesaret yeniden tanımlanıyor.',
        historicalFactTr: '1880’lerde Vahşi Batı’daki şerif yıldızları genellikle eritilmiş gümüş paralardan yerel demircilerce dövülürdü.'
    },
    {
        id: 'gatsby_1920',
        yearDisplay: '1925',
        titleTr: '1920’ler Great Gatsby & Caz Çağı',
        titleEn: '1920s Great Gatsby & Jazz Age',
        category: 'retro',
        icon: '🎷',
        badge: 'Kükreyen 20’ler',
        bgGradient: 'from-yellow-900 via-amber-800 to-stone-950',
        promptEn: 'Depict the person in this photo as an ultra-glamorous 1920s Jazz Age socialite or tuxedo-clad tycoon at a lavish Great Gatsby art deco mansion party. Wearing sparkling flapper headband with feathers and pearl necklace, or a sharp 1920s pinstripe tuxedo holding a champagne flute, surrounded by gold art-deco geometry and soft speakeasy lighting. Retaining exact facial identity.',
        newspaperHeadlineTr: 'CAZ ÇAĞININ BÜYÜK BALOSU: ŞEHRİN EN PARLAK GECESİ!',
        newspaperSubTr: 'Gatsby’nin malikanesinde sabahlara kadar süren caz ritimleri tüm şehri büyüledi.',
        historicalFactTr: '1920’ler caz çağı, kadın modasında ilk kez saçların kısa kesildiği (bob kesim) ve dans salonlarının patlama yaptığı dönemdir.'
    },
    {
        id: 'vintage_1950',
        yearDisplay: '1955',
        titleTr: '1950’ler Rock’n Roll & Diner',
        titleEn: '1950s Rockabilly & Retro Diner',
        category: 'retro',
        icon: '🎸',
        badge: 'Elvis & Hollywood',
        bgGradient: 'from-rose-800 via-sky-900 to-slate-900',
        promptEn: 'Depict the person in this photo in the iconic mid-1950s style. Wearing a black leather motorcycle jacket with pompadour hair, or a polka-dot swing dress with cat-eye glasses, inside a classic American neon diner with red vinyl booths and chrome jukebox. Kodachrome film vintage color photography retaining facial fidelity.',
        newspaperHeadlineTr: 'ROCK’N ROLL FIRTINASI: YENİ NESİL MÜZİK DÜNYAYI SALLIYOR!',
        newspaperSubTr: 'Jukebox kutuları ve dans pistleri gençliğin enerjisiyle dolup taşıyor.',
        historicalFactTr: '1950’ler Kodachrome renkli filmlerinin canlı kırmızı ve mavi tonları, dönemin nostaljik görsel kimliğini oluşturdu.'
    },
    {
        id: 'disco_1970',
        yearDisplay: '1975',
        titleTr: '1970’ler Studio 54 & Disko',
        titleEn: '1970s Studio 54 & Bell Bottoms',
        category: 'retro',
        icon: '🪩',
        badge: 'Disko Ateşi',
        bgGradient: 'from-purple-900 via-pink-800 to-amber-900',
        promptEn: 'Depict the person in this photo as a fabulous 1970s disco icon at Studio 54. Wearing an open silk shirt with oversized collars or sparkling glitter jumpsuits, afro or feathered layered hairstyle, standing under spinning mirror disco balls with rainbow strobe lights and retro warm film grain. Preserving exact facial characteristics.',
        newspaperHeadlineTr: 'DİSKO ATEŞİ DÜNYAYI SARDI: DANS PİSTLERİNDE YENİ MODA',
        newspaperSubTr: 'Platform ayakkabılar ve ışıltılı kıyafetlerle 70’lerin müzik devrimi sürüyor.',
        historicalFactTr: '1970’lerin New York Studio 54 kulübü, dünyanın en ünlü sanatçıları ve yıldızlarının gizli buluşma yeriydi.'
    },
    {
        id: 'synthwave_1980',
        yearDisplay: '1985',
        titleTr: '1980’ler Synthwave & Neon Şehir',
        titleEn: '1980s Synthwave & Retro Tech',
        category: 'retro',
        icon: '🕹️',
        badge: 'Neon & Kaset',
        bgGradient: 'from-fuchsia-950 via-purple-900 to-cyan-950',
        promptEn: 'Depict the person in this photo as an iconic 1980s pop star or retro arcade enthusiast. Wearing oversized neon pastel blazer with rolled sleeves, aviator sunglasses, Walkman headphones around neck, voluminous 80s hairstyle, with glowing purple-magenta neon grids and vintage arcade cabinet reflections. Crisp authentic 80s Polaroid look preserving face.',
        newspaperHeadlineTr: 'DİJİTAL ÇAĞIN İLK ADIMI: ELEKTRONİK MÜZİK VE VİDEO OYUNLARI!',
        newspaperSubTr: 'Kasetçalarlar, neon ışıklar ve renkli ceketlerle 80’ler rüzgarı esiyor.',
        historicalFactTr: '1980’lerde Walkman taşınabilir kasetçaların çıkışı, insanların ilk kez sokakta kendi müziklerini dinleyebilmesini sağladı.'
    },
    {
        id: 'grunge_1990',
        yearDisplay: '1995',
        titleTr: '1990’lar Grunge & Sokak Modası',
        titleEn: '1990s Grunge & Streetwear',
        category: 'retro',
        icon: '🛹',
        badge: 'MTV & CD Dönemi',
        bgGradient: 'from-emerald-950 via-slate-800 to-stone-900',
        promptEn: 'Depict the person in this photo in authentic 1990s streetwear and grunge aesthetic. Wearing oversized flannel plaid shirt over a band tee, baggy denim jeans, backwards cap, holding a vintage portable CD player, with a 90s MTV aesthetic and 35mm disposable camera flash photo texture. Retaining exact facial identity.',
        newspaperHeadlineTr: 'ALTERNATİF GENÇLİK VE İNTERNETİN DOĞUŞU: 90’LAR DALGASI!',
        newspaperSubTr: 'World Wide Web dünyayı birbirine bağlarken gençlik kendi müziğini yaratıyor.',
        historicalFactTr: '1990’ların ortasında evlere internetin girmesiyle birlikte ilk dijital sohbet odaları ve web siteleri kuruldu.'
    },
    {
        id: 'y2k_2000',
        yearDisplay: '2004',
        titleTr: '2000’ler Y2K & Milenyum Estetiği',
        titleEn: '2000s Y2K & Early Digital',
        category: 'retro',
        icon: '💿',
        badge: 'Milenyum & Flip Phone',
        bgGradient: 'from-blue-900 via-indigo-950 to-pink-950',
        promptEn: 'Depict the person in this photo in iconic 2000s Y2K futuristic pop style. Wearing metallic silver puffer jacket, tinted rimless sunglasses, flip phone in hand, low-rise frosted aesthetic with glossy early digital camera flash glow and vibrant millennium pop colors. Perfectly preserving facial features.',
        newspaperHeadlineTr: 'YENİ BİNYILIN TEKNOLOJİSİ: CEP TELEFONLARI VE MP3 ÇILGINLIĞI',
        newspaperSubTr: 'Milenyum çağı fütüristik gümüş kıyafetler ve dijital müzikle başladı.',
        historicalFactTr: '2000’lerin başında kapaklı telefonlar ve MP3 çalarlar dönemin en büyük teknolojik statü sembolüydü.'
    },

    // --- GELECEK & SİBER ---
    {
        id: 'cyberpunk_2077',
        yearDisplay: '2077',
        titleTr: 'Cyberpunk 2077 — Neo-İstanbul / Night City',
        titleEn: 'Cyberpunk 2077 — Neon Metropolis',
        category: 'future',
        icon: '🤖',
        badge: 'Sibernetik İmplant',
        bgGradient: 'from-cyan-950 via-violet-950 to-fuchsia-950',
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
        bgGradient: 'from-orange-950 via-red-900 to-slate-950',
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
        bgGradient: 'from-amber-950 via-yellow-950 to-stone-900',
        promptEn: 'Depict the person in this photo as a visionary Steampunk inventor and airship captain in an alternate 1895 Victorian era. Wearing brass goggles on a leather top hat, ornate clockwork mechanical wrist gadget, tailored velvet vest with brass gears and copper tubes, inside an airship navigation bridge filled with glowing vacuum tubes and steam valves. Preserving exact facial identity.',
        newspaperHeadlineTr: 'GÖKLERİN HÂKİMİ: DEV ZEPPELİN DÜNYA TURUNU TAMAMLADI',
        newspaperSubTr: 'Buhar gücü ve pirinç mekaniklerle çalışan hava gemileri ulaşımda çığır açtı.',
        historicalFactTr: 'Steampunk türü, 19. yüzyılın buhar teknolojisiyle 21. yüzyılın bilgisayar fikirlerini birleştiren büyüleyici bir kurgudur.'
    }
];

export const ALL_ERA_IDS = ERAS.map(e => e.id);
