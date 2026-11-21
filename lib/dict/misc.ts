/**
 * Hata/servis mesajları, meta ve yasal bağlantı metinleri.
 * `tr` metinleri koddaki orijinal Türkçe ile birebir aynıdır.
 */
import type { Entry } from '../i18n';

export const MISC_DICT: Record<string, Entry> = {
  // --- errors ---
  'auth.err.invalid': {
    tr: 'E-posta adresi veya şifre hatalı.',
    en: 'Incorrect email address or password.',
  },
  'auth.err.exists': {
    tr: 'Bu e-posta adresi ile zaten bir hesap mevcut.',
    en: 'An account with this email address already exists.',
  },
  'auth.err.short': {
    tr: 'Şifre en az 6 karakter olmalıdır.',
    en: 'Password must be at least 6 characters.',
  },
  'auth.err.rate': {
    tr: 'Çok fazla istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.',
    en: 'Too many requests were sent. Please try again in a few minutes.',
  },
  'stripe.loadError': {
    tr: 'Stripe yüklenemedi. Lütfen sayfayı yenileyin.',
    en: 'Stripe could not be loaded. Please refresh the page.',
  },
  'fal.p1': {
    tr: '[1/3] Fotoğraf hazırlanıyor ve Fal.ai modeline gönderiliyor...',
    en: '[1/3] Preparing the photo and sending it to the Fal.ai model...',
  },
  'fal.p2': {
    tr: '[2/3] Model çalışıyor (Kuyruk ID: {id}...)...',
    en: '[2/3] The model is running (Queue ID: {id}...)...',
  },
  'fal.queue': {
    tr: '[2/3] Sırada bekleniyor (Sıra pozisyonu: {pos})...',
    en: '[2/3] Waiting in the queue (Queue position: {pos})...',
  },
  'fal.priority': {
    tr: 'Öncelikli',
    en: 'Priority',
  },
  'fal.working': {
    tr: '[2/3] AI Canlı Kareleri ve Kıyafet Dönüşümünü İşliyor ({s}s)...',
    en: '[2/3] AI is processing the live frames and outfit transformation ({s}s)...',
  },
  'fal.done': {
    tr: '[3/3] Video tamamlandı, indiriliyor...',
    en: '[3/3] Video complete, downloading...',
  },
  'fal.queueErr': {
    tr: 'Fal.ai Kuyruk Hatası ({status}): {text}',
    en: 'Fal.ai Queue Error ({status}): {text}',
  },
  'fal.failedWith': {
    tr: 'Fal.ai işlemi başarısız oldu: {reason}',
    en: 'The Fal.ai operation failed: {reason}',
  },
  'fal.unknown': {
    tr: 'Bilinmeyen hata',
    en: 'Unknown error',
  },
  'fal.noKey': {
    tr: 'Fal.ai API Anahtarı (FAL_KEY) bulunamadı. Lütfen anahtarınızı girin.',
    en: 'Fal.ai API key (FAL_KEY) not found. Please enter your key.',
  },
  'fal.timeout': {
    tr: 'Fal.ai işlemi zaman aşımına uğradı veya devam ediyor.',
    en: 'The Fal.ai operation timed out or is still in progress.',
  },
  'fal.callErr': {
    tr: 'Fal.ai API çağrısı sırasında bir hata oluştu.',
    en: 'An error occurred during the Fal.ai API call.',
  },
  'kie.err': {
    tr: 'Kie.ai API Hatası: {text}',
    en: 'Kie.ai API Error: {text}',
  },
  'kie.noKey': {
    tr: 'Kie.ai API Anahtarı bulunamadı. Lütfen anahtarınızı girin.',
    en: 'Kie.ai API key not found. Please enter your key.',
  },
  'kie.incomplete': {
    tr: 'Kie.ai Google Omni video oluşturma tamamlanamadı.',
    en: 'Kie.ai Google Omni video generation could not be completed.',
  },
  'album.title': {
    tr: 'Past Forward ile oluşturuldu',
    en: 'Created with Past Forward',
  },
  'album.sub': {
    tr: 'Google AI Studio üzerinde',
    en: 'Built on Google AI Studio',
  },
  'album.credit': {
    tr: 'Hikmet Tanrıverdi tarafından oluşturuldu',
    en: 'Created by Hikmet Tanrıverdi',
  },
  // --- misc ---
  'meta.title': {
    tr: 'Zaman Makinesi Fotoğrafları',
    en: 'Time Machine Photos',
  },
  'meta.description': {
    tr: 'Fotoğraflarınızı farklı dönemlerin estetiğiyle yeniden yorumlayan yapay zekâ destekli Zaman Makinesi deneyimi.',
    en: 'An AI-powered Time Machine experience that reimagines your photos in the aesthetics of different eras.',
  },
  'meta.ogDescription': {
    tr: 'Fotoğraflarınızı farklı dönemlerin estetiğiyle yeniden yorumlayın.',
    en: 'Reimagine your photos in the aesthetics of different eras.',
  },
  'meta.siteDescription': {
    tr: 'Fotoğraflarınızı farklı dönemlerin estetiğiyle yeniden yorumlayan yapay zekâ destekli deneyim.',
    en: 'An AI-powered experience that reimagines your photos in the aesthetics of different eras.',
  },
  'meta.ogLocale': {
    tr: 'tr_TR',
    en: 'en_US',
  },
  'legal.privacy': {
    tr: 'Gizlilik ve KVKK',
    en: 'Privacy and KVKK',
  },
  'legal.terms': {
    tr: 'Kullanım Koşulları',
    en: 'Terms of Use',
  },
  'legal.cookies': {
    tr: 'Çerez Politikası',
    en: 'Cookie Policy',
  },
  'legal.contact': {
    tr: 'İletişim',
    en: 'Contact',
  },
  'common.toggleTheme': {
    tr: 'Toggle theme',
    en: 'Toggle theme',
  },
  'common.langTitle': {
    tr: 'Language / Dil',
    en: 'Language / Dil',
  },
};
