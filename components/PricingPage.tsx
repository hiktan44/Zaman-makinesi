import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

interface CreditPackage {
  id: number;
  credits: number;
  price_try: number;
  is_active: boolean;
}

const PricingPage: React.FC = () => {
  const { token, refreshCredits } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/packages`);
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Paketler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (packageId: number) => {
    if (!token) {
      alert('Satın almak için giriş yapmalısınız');
      return;
    }

    setIsRedirecting(packageId);

    try {
      const response = await fetch(`${API_URL}/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ödeme oluşturulamadı');
      }

      // Stripe checkout sayfasına yönlendir
      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
      setIsRedirecting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            Kredi Paketleri
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
            Görsel üretmeye devam etmek için kredi satın alın. Her görsel üretimi 1 kredi harcar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => {
            const isPopular = pkg.credits === 100;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white dark:bg-surface-dark rounded-2xl p-8 border-2 ${
                  isPopular
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-stone-200 dark:border-border-dark shadow-lg'
                } transition-transform hover:scale-[1.02]`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-sm font-bold px-4 py-1 rounded-full">
                    En Popüler
                  </div>
                )}

                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {pkg.credits}
                  </div>
                  <div className="text-lg text-text-muted-light dark:text-text-muted-dark mb-6">
                    Kredi
                  </div>

                  <div className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">
                    ₺{pkg.price_try.toLocaleString('tr-TR')}
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isRedirecting === pkg.id}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all bg-primary text-background-dark hover:bg-yellow-500 ${
                      isRedirecting === pkg.id
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isRedirecting === pkg.id ? 'Yönlendiriliyor...' : 'Satın Al'}
                  </button>

                  <p className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                    Güvenli ödeme ile Stripe
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-bold text-text-light dark:text-text-dark mb-2">
              💡 Ödeme Bilgileri
            </h3>
            <ul className="text-sm text-text-muted-light dark:text-text-muted-dark text-left space-y-1">
              <li>• Ödemeler EUR cinsinden yapılmaktadır</li>
              <li>• Güncel TCMB kuru kullanılarak TRY fiyatlara çevrilir</li>
              <li>• Ödeme başarılı olduğunda krediler otomatik yüklenir</li>
              <li>• Krediler süresiz kullanılabilir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
