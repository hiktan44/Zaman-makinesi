/**
 * Çağ kartlarının İngilizce görünen metinleri.
 *
 * `eraConstants.ts` içindeki alanlar (yearDisplay, titleTr, titleEn, promptEn ...)
 * mantıkta ve yapay zekâ istemlerinde kullanıldığı için DEĞİŞTİRİLMEZ.
 * Bu dosya yalnızca arayüzde gösterilen metinleri dile göre döndürür;
 * `tr` için doğrudan eraConstants'taki mevcut alanlar kullanılır.
 */
import { ERAS, type EraDefinition } from './eraConstants';
import { getLang, type Lang } from '../lib/i18n';

export interface EraText {
    year: string;
    title: string;
    badge: string;
    headline: string;
    sub: string;
    fact: string;
}

const EN: Record<string, EraText> = {
    '1860s': {
        year: '1860s',
        title: '1860s — Victorian Era & Early Photography',
        badge: 'Daguerreotype',
        headline: 'A NEW ERA IN PHOTOGRAPHY: HISTORIC POSES OF THE 1860S',
        sub: 'Memories are immortalized for the first time on glass plates.',
        fact: 'In the 1860s, sitting for a portrait meant staying perfectly still for minutes at a time.',
    },
    '1870s': {
        year: '1870s',
        title: '1870s — Steam Age & Industrial Revolution',
        badge: 'Industrial Revolution',
        headline: 'THE AGE OF RAILWAYS AND FACTORIES: THE WORLD OF 1870',
        sub: 'Steam locomotives link continents as a new century dawns.',
        fact: 'In the 1870s, pocket watches and vest chains were among the greatest status symbols of the day.',
    },
    '1880s': {
        year: '1880s',
        title: '1880s — Gilded Age & the Wild West',
        badge: 'Gilded Age',
        headline: '1880: GOLD MINES AND THE BIRTH OF NEW CITIES',
        sub: 'Cowboys, merchants and explorers draw the borders of a new world.',
        fact: 'In the 1880s, the invention of the electric light bulb lit up city nights forever.',
    },
    '1890s': {
        year: '1890s',
        title: '1890s — Belle Époque Elegance',
        badge: 'Belle Époque',
        headline: 'THE AGE OF ART AND ELEGANCE IN THE 1890S: THE BELLE ÉPOQUE',
        sub: 'Music, literature and architecture reach their peak in the salons of Paris and Istanbul.',
        fact: 'By the 1890s the Eiffel Tower had opened and the world had seen its first moving pictures.',
    },
    '1900s': {
        year: '1900s',
        title: '1900s — Dawn of a New Century',
        badge: 'Turn of the Millennium',
        headline: 'HELLO NEW CENTURY: THE FIRST DAYS OF 1900',
        sub: 'The 20th century began with great hopes, new inventions and giant strides.',
        fact: 'At the 1900 Paris World’s Fair, moving walkways and talking pictures were shown to the public for the first time.',
    },
    '1910s': {
        year: '1910s',
        title: '1910s — Titanic & Early Aviation',
        badge: 'First Flights',
        headline: '1910: THE SKIES AND OCEANS ARE BEING CONQUERED!',
        sub: 'The world shrinks with the first airships and transatlantic liners.',
        fact: 'In the 1910s, aviation pioneers made their first intercontinental flight attempts in single-engine aircraft.',
    },
    '1920s': {
        year: '1920s',
        title: '1920s — Great Gatsby & the Jazz Age',
        badge: 'Roaring Twenties',
        headline: 'THE JAZZ CRAZE OF THE 1920S: A REVOLUTION IN DANCE AND FASHION!',
        sub: 'Charleston dances and jazz orchestras wrap the whole world in their rhythm.',
        fact: 'In the 1920s, as radio broadcasts entered homes, music became a global phenomenon for the first time.',
    },
    '1930s': {
        year: '1930s',
        title: '1930s — Art Deco & Classic Hollywood',
        badge: 'Golden Age of Cinema',
        headline: 'THE SILVER SCREEN OF THE 1930S: HOLLYWOOD LEGENDS',
        sub: 'Stars dazzle audiences in the golden age of cinema.',
        fact: 'In the 1930s, the first color films and radio dramas kept millions glued to their seats.',
    },
    '1940s': {
        year: '1940s',
        title: '1940s — Film Noir & Elegance',
        badge: 'Film Noir',
        headline: 'THE 1940S: AN ERA OF COURAGE, HONOR AND REBUILDING',
        sub: 'The world leaves the hard years behind and builds peace and brotherhood.',
        fact: 'In the late 1940s, ENIAC, the first electronic computer, was invented, laying the foundation of the technology age.',
    },
    '1950s': {
        year: '1950s',
        title: '1950s — Rockabilly & Retro Diner',
        badge: 'Age of Elvis',
        headline: '1950: THE ROCK’N’ROLL AND JUKEBOX CRAZE!',
        sub: 'Elvis Presley and a new generation of music send young people to the dance floors.',
        fact: 'In the 1950s, television sets entering homes gave birth to popular culture.',
    },
    '1960s': {
        year: '1960s',
        title: '1960s — Flower Children & Beatlemania',
        badge: 'Peace & Music',
        headline: '1969: MANKIND ON THE MOON! AN AGE OF PEACE AND FREEDOM',
        sub: 'Apollo 11 landed on the Moon and the Woodstock festival united millions in peace.',
        fact: 'On July 20, 1969, Neil Armstrong took the first step on the Moon’s surface, changing human history.',
    },
    '1970s': {
        year: '1970s',
        title: '1970s — Disco Fever & Studio 54',
        badge: 'Disco Fever',
        headline: 'THE 1970S: DISCO MUSIC AND GLITTER SWEEP THE WORLD',
        sub: 'As queues grow outside Studio 54, disco fashion spills onto the streets.',
        fact: 'In the 1970s, the first video game consoles (Pong, Atari) made their way into living rooms.',
    },
    '1980s': {
        year: '1980s',
        title: '1980s — Synthwave & Neon City',
        badge: 'Retro Neon',
        headline: '1980: THE BIRTH OF THE DIGITAL AGE AND ELECTRONIC MUSIC',
        sub: 'Cassette players, arcades and synthwave rhythms leave their mark on the ’80s.',
        fact: 'In the 1980s, the Walkman and the first personal computers (Commodore 64) changed the world.',
    },
    '1990s': {
        year: '1990s',
        title: '1990s — Grunge & Streetwear',
        badge: 'MTV & CD Era',
        headline: 'THE 1990S: THE BIRTH OF THE INTERNET AND ALTERNATIVE MUSIC',
        sub: 'As the World Wide Web connects the world, young people create a style of their own.',
        fact: 'With the internet opening to the public in 1995, the digital age officially began.',
    },
    '2000s': {
        year: '2000s',
        title: '2000s — Y2K & Millennium Aesthetics',
        badge: 'Y2K & Flip Phones',
        headline: '2000: THE NEW MILLENNIUM AND THE MOBILE PHONE CRAZE',
        sub: 'The 21st century began with futuristic silver outfits and digital music.',
        fact: 'In the early 2000s, the first camera phones and MP3 players became everyday essentials.',
    },
    '2010s': {
        year: '2010s',
        title: '2010s — Smartphones & Hipster',
        badge: 'Social Media Era',
        headline: 'THE 2010S: THE AGE OF SOCIAL MEDIA AND SMARTPHONES',
        sub: 'With Instagram, touchscreens and mobile internet, the world went instantly connected.',
        fact: 'The 2010s were the decade in which mobile apps and social media transformed human life from top to bottom.',
    },
    '2020s': {
        year: '2020s',
        title: '2020s — Today & Modern Aesthetics',
        badge: 'Age of AI',
        headline: 'THE 2020S: THE AI REVOLUTION AND DIGITAL TRANSFORMATION',
        sub: 'AI models and electric vehicles have moved to the center of daily life.',
        fact: 'The 2020s are the era in which artificial intelligence first began creating creative content and images.',
    },
    '2030s': {
        year: '2030s',
        title: '2030s — Autonomous Cities & Green Energy',
        badge: 'Smart Cities',
        headline: '2030: AUTONOMOUS TRANSPORT AND SKYSCRAPER GARDENS',
        sub: 'AI-controlled autonomous vehicles and green energy have transformed our cities.',
        fact: 'Projections for 2030 expect augmented reality glasses to replace phones.',
    },
    '2040s': {
        year: '2040s',
        title: '2040s — Holographic Life & Quantum',
        badge: 'Holo-Tech',
        headline: '2040: QUANTUM COMPUTERS AND THE DIGITAL UNIVERSE',
        sub: 'The quantum age begins as hologram communication reduces distances to zero.',
        fact: 'Forecasts for the 2040s expect the quantum internet to securely process trillions of operations per second worldwide.',
    },
    ancient_egypt: {
        year: '1350 BC',
        title: 'Ancient Egyptian Pharaoh / Queen',
        badge: 'Kingdom of the Nile',
        headline: 'CHILDREN OF THE SUN GOD: THE PYRAMIDS RISE!',
        sub: 'In a kingdom crowned by the bounty of the Nile, the greatest temple of the age has opened.',
        fact: 'In Ancient Egypt, the golden headdresses and jewelry worn by pharaohs symbolized immortality and divine power.',
    },
    ancient_rome: {
        year: '80 AD',
        title: 'Ancient Roman Senator / Gladiator',
        badge: 'Age of the Colosseum',
        headline: 'HISTORIC DECISION IN THE ROMAN SENATE: THE EMPIRE EXPANDS',
        sub: 'Tens of thousands of Romans gathered in the Forum cheered the triumphal procession.',
        fact: 'The purple border on a Roman toga could only be worn by senators and the highest officials of the state.',
    },
    ancient_greece: {
        year: '430 BC',
        title: 'Ancient Greek Philosopher / Hero of Olympus',
        badge: 'Acropolis',
        headline: 'A GREAT FEAST OF PHILOSOPHY AND SCIENCE AT THE ACROPOLIS',
        sub: 'Socrates and the Athenian assembly lay the foundations of reason and democracy.',
        fact: 'In Ancient Greece, crowns made of olive branches were the highest honor at the Olympic Games.',
    },
    viking_age: {
        year: '850 AD',
        title: 'Viking Warrior & Jarl',
        badge: 'Northern Fjords',
        headline: 'EAGLES OF THE NORTH SET OUT: FROM THE FJORDS TO THE OCEANS',
        sub: 'Scandinavian seafarers set sail for new routes and legendary discoveries.',
        fact: 'Without a compass, Vikings traveled thousands of miles guided only by sunstones and the positions of the stars.',
    },
    renaissance_italy: {
        year: '1505',
        title: 'Renaissance Florentine Artist / Noble',
        badge: 'Age of da Vinci',
        headline: 'THE GOLDEN AGE OF ART AND SCIENCE: REBIRTH IN FLORENCE',
        sub: 'Master artists and thinkers present works that will change human history.',
        fact: 'A noble strolling the streets of Renaissance Florence might have run into da Vinci or Michelangelo at the same coffeehouse.',
    },
    ottoman_sultan: {
        year: '1550',
        title: 'Ottoman Imperial Court & Sultan',
        badge: 'Topkapı Palace',
        headline: 'GRAND RECEPTION AT THE PALACE: A NEW ERA FOR THE WORLD EMPIRE!',
        sub: 'At a magnificent council meeting in the capital, a new envoy and the court dignitaries were introduced.',
        fact: 'In the 16th-century Ottoman palace, caftans were woven in special court workshops from silk, velvet and gold thread through months of handwork.',
    },
    ottoman_levanten: {
        year: '1890',
        title: 'Pera & Levantine Istanbul',
        badge: 'Beyoğlu 1890',
        headline: 'THE ORIENT EXPRESS PULLS UP AT PERA PALACE: ISTANBUL’S ELITE DAYS',
        sub: 'Fashion and elegance are at their peak on the streets of Pera, where the heart of Europe and the East beats.',
        fact: 'In the 1890s, Pera in Istanbul was the meeting point for Orient Express passengers and the world’s most distinguished artists.',
    },
    feudal_japan: {
        year: '1600',
        title: 'Feudal Samurai & Kyoto',
        badge: 'Edo Period',
        headline: 'THE SAMURAI CODE OF HONOR: A GREAT GATHERING IN KYOTO',
        sub: 'The legendary warriors of the Far East came together in a council of peace and honor.',
        fact: 'In the Edo period, samurai swords were seen not merely as weapons but as symbols of the spirit and honor of their bearer.',
    },
    persian_palace: {
        year: '500 BC',
        title: 'Persian Silk Palace & the Age of Zoroaster',
        badge: 'Persepolis',
        headline: 'THE HEART OF THE SILK ROAD: WORLD TRADE IN THE GREAT PALACE',
        sub: 'Trade routes uniting East and West meet at Persepolis.',
        fact: 'In the palaces of the ancient Persian kings, gardens were called "Pardis" (Paradise) and are regarded as the world’s first formal botanical parks.',
    },
    wild_west_1880: {
        year: '1885',
        title: 'Wild West Cowboy / Sheriff',
        badge: 'Wanted Poster',
        headline: 'WANTED OR HERO: THE TOWN’S FASTEST SHERIFF IS ON DUTY!',
        sub: 'On the dusty streets of the Wild West, justice and courage are being redefined.',
        fact: 'In the 1880s, Wild West sheriff stars were often hammered out of melted silver coins by local blacksmiths.',
    },
    cyberpunk_2077: {
        year: '2077',
        title: 'Cyberpunk 2077 — Neo-Istanbul',
        badge: 'Cybernetic Implants',
        headline: 'YEAR 2077: THE CITY RISES ABOVE THE CLOUDS!',
        sub: 'Artificial intelligence and cybernetic implants have become an inseparable part of human life.',
        fact: 'Projections for 2077 foresee neural interfaces that connect the human brain directly to a quantum internet network.',
    },
    mars_colony_2150: {
        year: '2150',
        title: 'Mars Colony 2150 & the Red Planet',
        badge: 'Interplanetary',
        headline: 'THE FIRST CITY ON MARS HAS REACHED A POPULATION OF 1 MILLION!',
        sub: 'The first independent off-world life cycle has been established inside the Red Planet’s biological domes.',
        fact: 'Colonization models for 2150 aim to terraform the Martian atmosphere to make it breathable.',
    },
    steampunk_1895: {
        year: '1895 Alternate Universe',
        title: 'Steampunk Steam Age Inventor',
        badge: 'Steam & Gears',
        headline: 'MASTER OF THE SKIES: GIANT ZEPPELIN COMPLETES ITS WORLD TOUR',
        sub: 'Airships powered by steam and brass mechanics have broken new ground in transport.',
        fact: 'Steampunk is a fascinating genre of fiction that blends 19th-century steam technology with 21st-century computing ideas.',
    },
    quantum_matrix_3000: {
        year: '3000+',
        title: 'Quantum Consciousness & Energy Being',
        badge: 'Pure Energy',
        headline: 'YEAR 3000: HUMAN CONSCIOUSNESS HAS TRANSCENDED THE DIMENSIONS OF THE UNIVERSE',
        sub: 'A new civilization emerges in a quantum universe where the concepts of time and space are reset.',
        fact: 'Futurology forecasts for the year 3000 predict that matter and consciousness will be converted into photonic energy.',
    },
};

/** Dile göre çağ metinleri. `tr` için eraConstants'taki mevcut alanlar aynen döner. */
export function eraText(era: EraDefinition, lang: Lang = getLang()): EraText {
    if (lang === 'tr') {
        return {
            year: era.yearDisplay,
            title: era.titleTr,
            badge: era.badge,
            headline: era.newspaperHeadlineTr,
            sub: era.newspaperSubTr,
            fact: era.historicalFactTr,
        };
    }
    return (
        EN[era.id] ?? {
            year: era.yearDisplay,
            title: era.titleEn,
            badge: era.badge,
            headline: era.newspaperHeadlineTr,
            sub: era.newspaperSubTr,
            fact: era.historicalFactTr,
        }
    );
}

/** Çağ kimliğinden metin (bulunamazsa null). */
export function eraTextById(eraId: string, lang: Lang = getLang()): EraText | null {
    const era = ERAS.find((e) => e.id === eraId);
    return era ? eraText(era, lang) : null;
}

/** Test/denetim için: her çağın İngilizce karşılığı var mı? */
export const ERA_EN_IDS = Object.keys(EN);
