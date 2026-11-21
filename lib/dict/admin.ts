/**
 * Yönetim paneli metinleri.
 * `tr` metinleri koddaki orijinal Türkçe ile birebir aynıdır.
 */
import type { Entry } from '../i18n';

export const ADMIN_DICT: Record<string, Entry> = {
  // --- admin ---
  'ad.toastAdd': {
    tr: '⚡ Hesabınıza +{n} Plütonyum Kredisi yüklendi!',
    en: '⚡ +{n} Plutonium Credits added to your account!',
  },
  'ad.toastUser': {
    tr: '{email} kullanıcısına {d} kredi güncellendi.',
    en: 'Updated {d} credits for {email}.',
  },
  'ad.tabUsers': {
    tr: 'Kullanıcılar ({n})',
    en: 'Users ({n})',
  },
  'ad.tabPurchases': {
    tr: 'Satın Alımlar & Gelir (₺{n})',
    en: 'Purchases & Revenue (₺{n})',
  },
  'ad.tabLogs': {
    tr: 'Canlı Sistem Logları ({n})',
    en: 'Live System Logs ({n})',
  },
  'ad.total': {
    tr: 'Toplam: ',
    en: 'Total: ',
  },
  'ad.totalUsersTail': {
    tr: ' Kullanıcı',
    en: ' Users',
  },
  'ad.gen': {
    tr: '{n} adet',
    en: '{n} items',
  },
  'ad.revenue': {
    tr: 'Toplam Gelir: ₺{n},00',
    en: 'Total Revenue: ₺{n}.00',
  },
  'ad.loginLabel': {
    tr: 'Giriş: ',
    en: 'Signed in: ',
  },
  'ad.sysStatus': {
    tr: ' | Sistem Durumu: ',
    en: ' | System Status: ',
  },
  'ad.online': {
    tr: '● Çevrimiçi',
    en: '● Online',
  },
  'ad.orders': {
    tr: 'Tamamlanan Siparişler: ',
    en: 'Completed Orders: ',
  },
  'ad.toastKeys': {
    tr: 'API Anahtarları başarıyla kaydedildi!',
    en: 'API keys saved successfully!',
  },
  'ad.title': {
    tr: 'ZAMAN MAKİNESİ — YÖNETİM PANELİ',
    en: 'ZAMAN MAKİNESİ — ADMIN PANEL',
  },
  'ad.selfCredit': {
    tr: 'Kendime +1000 Kredi Yükle',
    en: 'Add +1000 Credits to Myself',
  },
  'ad.tabOverview': {
    tr: 'Genel Bakış',
    en: 'Overview',
  },
  'ad.tabSettings': {
    tr: 'API & Model Ayarları',
    en: 'API & Model Settings',
  },
  'ad.kpiUsers': {
    tr: 'Toplam Kullanıcı',
    en: 'Total Users',
  },
  'ad.kpiActive': {
    tr: '● 5 Aktif Üye',
    en: '● 5 Active Members',
  },
  'ad.kpiJumps': {
    tr: 'Toplam Zaman Sıçraması',
    en: 'Total Time Jumps',
  },
  'ad.kpiJumpsSub': {
    tr: 'Üretilen Fotoğraf / Klip',
    en: 'Photos / Clips Generated',
  },
  'ad.kpiRevenue': {
    tr: 'Toplam Paket Satış Geliri',
    en: 'Total Pack Sales Revenue',
  },
  'ad.kpiBalance': {
    tr: 'Admin Kredi Bakiyesi',
    en: 'Admin Credit Balance',
  },
  'ad.kpiRenew': {
    tr: 'Sınırsız Yenileme Yetkisi',
    en: 'Unlimited Top-Up Authority',
  },
  'ad.recent': {
    tr: ' Son Canlı Üretimler ve Sıçramalar',
    en: ' Latest Live Generations and Jumps',
  },
  'ad.allLogs': {
    tr: 'Tüm Logları Gör →',
    en: 'View All Logs →',
  },
  'ad.thTime': {
    tr: 'Zaman',
    en: 'Time',
  },
  'ad.thUser': {
    tr: 'Kullanıcı',
    en: 'User',
  },
  'ad.thAction': {
    tr: 'İşlem & Çağ',
    en: 'Action & Era',
  },
  'ad.thCredit': {
    tr: 'Kredi',
    en: 'Credits',
  },
  'ad.thStatus': {
    tr: 'Durum',
    en: 'Status',
  },
  'ad.searchPh': {
    tr: 'Kullanıcı ara (email veya isim)...',
    en: 'Search users (email or name)...',
  },
  'ad.thUserEmail': {
    tr: 'Kullanıcı / E-posta',
    en: 'User / Email',
  },
  'ad.thRole': {
    tr: 'Rol',
    en: 'Role',
  },
  'ad.thJoined': {
    tr: 'Kayıt Tarihi',
    en: 'Joined',
  },
  'ad.thRemaining': {
    tr: 'Kalan Kredi',
    en: 'Credits Left',
  },
  'ad.thGenerated': {
    tr: 'Üretim',
    en: 'Generated',
  },
  'ad.thSpent': {
    tr: 'Harcama',
    en: 'Spent',
  },
  'ad.thManage': {
    tr: 'Kredi Yönetimi',
    en: 'Credit Management',
  },
  'ad.thOrderNo': {
    tr: 'Sipariş No',
    en: 'Order No.',
  },
  'ad.thCustomer': {
    tr: 'Müşteri',
    en: 'Customer',
  },
  'ad.thPackage': {
    tr: 'Paket',
    en: 'Package',
  },
  'ad.thAmount': {
    tr: 'Tutar',
    en: 'Amount',
  },
  'ad.thPayment': {
    tr: 'Ödeme Yöntemi',
    en: 'Payment Method',
  },
  'ad.thDate': {
    tr: 'Tarih',
    en: 'Date',
  },
  'ad.thTimestamp': {
    tr: 'Zaman Damgası',
    en: 'Timestamp',
  },
  'ad.thType': {
    tr: 'İşlem Türü',
    en: 'Action Type',
  },
  'ad.thEra': {
    tr: 'Çağ / Başlık',
    en: 'Era / Title',
  },
  'ad.thSpentCr': {
    tr: 'Harcanan',
    en: 'Spent',
  },
  'ad.thLatency': {
    tr: 'Gecikme',
    en: 'Latency',
  },
  'ad.thDetail': {
    tr: 'Teknik Detay',
    en: 'Technical Detail',
  },
  'ad.keysTitle': {
    tr: ' Özel API Anahtarları (Admin Canlı Yapılandırma)',
    en: ' Custom API Keys (Admin Live Configuration)',
  },
  'ad.keysDesc': {
    tr: 'Sunucu ortam değişkenlerini değiştirmeden tarayıcınızdan doğrudan kendi API anahtarınızı tanımlayabilirsiniz.',
    en: 'You can define your own API key directly from your browser without changing the server environment variables.',
  },
  'ad.kie': {
    tr: 'Kie.ai API Key (Seedance 5 — 10:1 Maliyet Avantajı)',
    en: 'Kie.ai API Key (Seedance 5 — 10:1 Cost Advantage)',
  },
  'ad.saveKeys': {
    tr: 'API Anahtarlarını Kaydet',
    en: 'Save API Keys',
  },
  'ad.ratesTitle': {
    tr: ' Kredi & Harcama Maliyetleri',
    en: ' Credit & Spending Costs',
  },
  'ad.rate1': {
    tr: 'Tek Fotoğraf Zaman Sıçraması:',
    en: 'Single Photo Time Jump:',
  },
  'ad.rate2': {
    tr: 'Tarihi Gazete & Pasaport Çıktısı:',
    en: 'Historic Newspaper & Passport Output:',
  },
  'ad.rate3': {
    tr: '9:16 Video Morph Timelapse Klip:',
    en: '9:16 Video Morph Timelapse Clip:',
  },
  'ad.oneCr': {
    tr: '1 Kredi',
    en: '1 Credit',
  },
  'ad.fiveCr': {
    tr: '5 Kredi',
    en: '5 Credits',
  },
  'ad.kpiRevenueVal': {
    tr: '₺{n},00',
    en: '₺{n}.00',
  },
};
