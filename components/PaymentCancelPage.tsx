import React from 'react';
import Header from './Header';

const PaymentCancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-xl border border-stone-200 dark:border-border-dark">
          <div className="text-center">
            {/* Cancel Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
              Ödeme İptal Edildi
            </h1>

            <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-6">
              Ödeme işleminiz iptal edildi. Herhangi bir ücret alınmadı.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
              <p className="text-text-light dark:text-text-dark">
                Endişelenmeyin! Kredi satın almayı isterseniz, tekrar deneyebilirsiniz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/pricing'}
                className="py-3 px-8 bg-primary text-background-dark rounded-xl font-bold hover:bg-yellow-500 transition-colors"
              >
                Kredi Satın Almaya Dön
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="py-3 px-8 bg-stone-200 dark:bg-surface-dark text-text-light dark:text-text-dark rounded-xl font-bold hover:bg-stone-300 dark:hover:bg-surface-dark-light transition-colors"
              >
                Ana Sayfaya Dön
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
              <li>• İptal edilen ödemelerden herhangi bir ücret alınmaz</li>
              <li>• Kredi satın almayı isterseniz tekrar deneyebilirsiniz</li>
              <li>• Ödeme ile ilgili herhangi bir sorun yaşarsanız destek ekibimizle iletişime geçin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
