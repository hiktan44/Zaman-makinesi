/**
 * TCMB API'den güncel EUR/TRY kuru çeker
 */

interface TCMBRate {
  Isim: string;
  CurrencyName: string;
  ForexBuying: string;
  ForexSelling: string;
}

interface TCMBResponse {
  Tarih_Date: string;
  Currency: TCMBRate[];
}

/**
 * TCMB API'den güncel EUR/TRY kuru çeker
 */
export const fetchEURRate = async (): Promise<number> => {
  try {
    console.log('🌐 TCMB API\'ye bağlanılıyor...');
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('📥 TCMB yanıt alındı, XML parse ediliyor...');
    const xml = await response.text();
    
    // XML parse (basit regex kullanıyoruz)
    // Currency içinde Kod="EUR" olan bloğu bul
    const eurMatch = xml.match(/<Currency[^>]*Kod="EUR"[^>]*>([\s\S]*?)<\/Currency>/);
    
    if (!eurMatch) {
      throw new Error('EUR kuru bulunamadı');
    }
    
    const eurBlock = eurMatch[1];
    const forexBuyingMatch = eurBlock.match(/<ForexBuying>([^<]+)<\/ForexBuying>/);
    
    if (!forexBuyingMatch) {
      throw new Error('EUR alış kuru bulunamadı');
    }
    
    const rateStr = forexBuyingMatch[1].replace(',', '.');
    const rate = parseFloat(rateStr);
    
    console.log(`📊 İşlenen EUR alış kuru: ${rateStr} -> ${rate}`);
    
    if (isNaN(rate) || rate <= 0) {
      throw new Error(`Geçersiz EUR kuru: ${rate}`);
    }
    
    console.log(`✅ Güncel EUR/TRY kuru: ${rate}`);
    return rate;
    
  } catch (error: any) {
    console.error('❌ TCMB API hatası:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`TCMB kuru alınamadı: ${error.message}`);
  }
};

/**
 * TRY miktarını EUR'ya çevirir
 */
export const convertTRYtoEUR = async (tryAmount: number): Promise<number> => {
  console.log(`💱 Dönüştürme: ${tryAmount} TRY → EUR`);
  
  const eurTryRate = await fetchEURRate();
  const eurAmount = tryAmount / eurTryRate;
  const roundedEur = Math.round(eurAmount * 100) / 100;
  
  console.log(`💱 Sonuç: ${tryAmount} TRY / ${eurTryRate} = ${eurAmount} EUR → ${roundedEur} EUR`);
  
  return roundedEur;
};
