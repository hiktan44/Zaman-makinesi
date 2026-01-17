import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

const PaymentSuccessPage: React.FC = () => {
  const { refreshCredits, user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde kredileri yenile
    const refresh = async () => {
      try {
        await refreshCredits();
        setIsRefreshing(false);
      } catch (error) {
        console.error('Kredi yenileme hatası:', error);
        setIsRefreshing(false);
      }
    };

    refresh();
  }, [refreshCredits]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-xl border border-stone-200 dark:border-border-dark">
          <div className="text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
              Ödeme Başarılı!
            </h1>

            <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-6">
              Kredileriniz başarıyla hesabınıza yüklendi.
            </p>

            {isRefreshing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-text-muted-light dark:text-text-muted-dark">
                  Bakiye güncelleniyor...
                </span>
              </div>
            ) : user && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                <p className="text-text-light dark:text-text-dark">
                  Güncel Bakiyeniz: <span className="font-bold text-green-600 dark:text-green-400">{user.credits} kredi</span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="py-3 px-8 bg-primary text-background-dark rounded-xl font-bold hover:bg-yellow-500 transition-colors"
              >
                Görsel Üretmeye Başla
              </button>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="py-3 px-8 bg-stone-200 dark:bg-surface-dark text-text-light dark:text-text-dark rounded-xl font-bold hover:bg-stone-300 dark:hover:bg-surface-dark-light transition-colors"
              >
                Daha Fazla Kredi Satın Al
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-bold text-text-light dark:text-text-dark mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Bilgi
            </h3>
            <ul className="text-sm text-text-muted-light dark:text-text-muted-dark space-y-1">
              <li>• Kredileriniz anında hesabınıza yüklenmiştir</li>
              <li>• Kredileriniz hiçbir surette zaman aşımına uğramaz</li>
              <li>• Her görsel üretimi 1 kredi harcar</li>
              <li>• Ödeme detaylarınızı profilinizden görüntüleyebilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
