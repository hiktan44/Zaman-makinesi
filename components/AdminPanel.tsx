import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import { useLang } from '../lib/use-lang';
import { t, tn, serverError, localeFor } from '../lib/i18n';
import { 
  LayoutDashboard, Users, Activity, CreditCard, Settings, Search, Trash2, Plus 
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  is_admin: boolean;
  credits: number;
  created_at: string;
}

interface Activity {
  id: number;
  user_id: number;
  action_type: string;
  credits_used: number;
  description: string;
  created_at: string;
}

interface Payment {
  id: number;
  user_id: number;
  email: string;
  package_credits: number;
  price_try: number;
  amount_eur: number;
  amount_try: number;
  status: string;
  created_at: string;
}

interface CreditPackage {
  id: number;
  credits: number;
  price_try: number;
  is_active: boolean;
}

type Tab = 'dashboard' | 'users' | 'activities' | 'payments' | 'settings';

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Dashboard stats
  const [stats, setStats] = useState<any>(null);
  
  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  
  // Activities
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  
  // Payments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsStatus, setPaymentsStatus] = useState<string>('');
  
  // Settings
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [packages, setPackages] = useState<CreditPackage[]>([]);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboard();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'activities') fetchActivities();
    if (activeTab === 'payments') fetchPayments();
    if (activeTab === 'settings') fetchSettings();
  }, [activeTab, usersPage, usersSearch, activitiesPage, paymentsPage, paymentsStatus]);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(serverError(error.error, 'admin.apiError'));
    }
    return response.json();
  };

  const fetchDashboard = async () => {
    const data = await apiCall('/admin/dashboard');
    setStats(data);
  };

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    params.append('page', usersPage.toString());
    if (usersSearch) params.append('search', usersSearch);
    
    const data = await apiCall(`/admin/users?${params.toString()}`, { method: 'GET' });
    setUsers(data.users);
    setUsersTotal(data.pagination?.total || 0);
  };

  const fetchActivities = async () => {
    const data = await apiCall('/admin/activities', { method: 'GET' });
    setActivities(data.activities);
  };

  const fetchPayments = async () => {
    try {
      let url = `/admin/payments?page=${paymentsPage}`;
      if (paymentsStatus) url += `&status=${paymentsStatus}`;
      const data = await apiCall(url, { method: 'GET' });
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Ödemeler çekme hatası:', error);
      setPayments([]);
    }
  };

  const fetchSettings = async () => {
    const data = await apiCall('/admin/settings', { method: 'GET' });
    setSettings(data.settings || {});
  };

  const fetchPackages = async () => {
    const data = await apiCall('/admin/packages', { method: 'GET' });
    setPackages(data.packages || []);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(tn('admin.confirmDelete'))) return;
    
    try {
      await apiCall(`/admin/users/${userId}`, { method: 'DELETE' });
      alert(tn('admin.userDeleted'));
      fetchUsers();
    } catch (error: any) {
      alert(error.message || tn('admin.deleteError'));
    }
  };

  const handleAddCredits = async (userId: number) => {
    const amount = prompt(tn('admin.promptAmount'));
    const reason = prompt(tn('admin.promptReason'));
    if (!amount || !reason) return;
    
    try {
      // Doğrudan /api/credits/add endpoint'ini çağr
      const response = await fetch(`${API_URL}/credits/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount: parseInt(amount), reason }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(serverError(data.error, 'admin.addError'));
      }
      
      alert(tn('admin.creditsAdded'));
      fetchUsers();
    } catch (error: any) {
      alert(error.message || tn('admin.addError'));
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await apiCall('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      });
      alert(tn('admin.settingsUpdated'));
    } catch (error: any) {
      alert(error.message || tn('admin.updateError'));
    }
  };

  const handleUpdatePackagePrice = async (packageId: number, pkg: CreditPackage) => {
    try {
      await apiCall(`/admin/packages/${packageId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          credits: pkg.credits, 
          price_try: pkg.price_try,
          is_active: pkg.is_active 
        }),
      });
      alert(tn('admin.packageUpdated'));
      fetchPackages();
    } catch (error: any) {
      alert(error.message || tn('admin.updateError'));
    }
  };

  const TabButton: React.FC<{ tab: Tab; label: string; icon: React.ReactNode }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? 'bg-primary text-background-dark'
          : 'text-text-light dark:text-text-dark hover:bg-stone-100 dark:hover:bg-surface-dark'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
      fetchPackages();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-light dark:text-white mb-4">
              {t('admin.title', lang)}
            </h1>
            <div className="flex gap-2 flex-wrap">
              <TabButton tab="dashboard" label={t('admin.tab.dashboard', lang)} icon={<LayoutDashboard size={18} />} />
              <TabButton tab="users" label={t('admin.tab.users', lang)} icon={<Users size={18} />} />
              <TabButton tab="activities" label={t('admin.tab.activities', lang)} icon={<Activity size={18} />} />
              <TabButton tab="payments" label={t('admin.tab.payments', lang)} icon={<CreditCard size={18} />} />
              <TabButton tab="settings" label={t('admin.tab.settings', lang)} icon={<Settings size={18} />} />
            </div>
          </div>

        {activeTab === 'dashboard' && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg">
                <div className="text-sm text-text-muted-light dark:text-gray-400">{t('admin.stat.users', lang)}</div>
                <div className="text-3xl font-bold text-primary mt-2">{stats.totalUsers}</div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg">
                <div className="text-sm text-text-muted-light dark:text-gray-400">{t('admin.stat.credits', lang)}</div>
                <div className="text-3xl font-bold text-green-600 mt-2">{stats.totalCreditsGenerated}</div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg">
                <div className="text-sm text-text-muted-light dark:text-gray-400">{t('admin.stat.revenue', lang)}</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">₺{stats.totalRevenue?.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg">
                <div className="text-sm text-text-muted-light dark:text-gray-400">{t('admin.stat.payments', lang)}</div>
                <div className="text-3xl font-bold text-orange-600 mt-2">{stats.activePayments}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-text-light dark:text-white mb-4">{t('admin.recent', lang)}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.user', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.action', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.description', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.date', lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivities?.map((activity: any) => (
                      <tr key={activity.id} className="border-b border-stone-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">{activity.email}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">
                          <span className={`px-2 py-1 rounded text-xs ${
                            activity.action_type === 'credit_purchase' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            activity.action_type === 'image_generation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                          }`}>
                            {activity.action_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{activity.description}</td>
                        <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{new Date(activity.created_at).toLocaleString(localeFor(lang))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-stone-200 dark:border-gray-700">
              <div className="flex justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-text-light dark:text-white">{t('admin.usersTitle', lang, { n: usersTotal })}</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder={t('admin.search', lang)}
                      value={usersSearch}
                      onChange={(e) => {
                        setUsersSearch(e.target.value);
                        setUsersPage(1);
                      }}
                      className="pl-10 pr-4 py-2 border border-stone-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark text-text-light dark:text-gray-300 w-64"
                    />
                  </div>
                  <button
                    onClick={() => fetchUsers()}
                    className="text-primary hover:underline"
                  >
                    {t('admin.refresh', lang)}
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">ID</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.email', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">Admin</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.credit', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.registered', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.actions', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-stone-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{user.id}</td>
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">
                        {user.is_admin ? (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">Admin</span>
                        ) : (
                          <span className="text-text-muted-light dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">{user.credits}</td>
                      <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{new Date(user.created_at).toLocaleDateString(localeFor(lang))}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddCredits(user.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            <Plus size={14} />
                            {t('admin.addCredits', lang)}
                          </button>
                          {!user.is_admin && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                              {t('admin.delete', lang)}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usersTotal > 10 && (
              <div className="p-4 flex justify-center gap-2">
                <button
                  onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                  disabled={usersPage === 1}
                  className="px-4 py-2 bg-stone-100 dark:bg-surface-dark rounded disabled:opacity-50"
                >
                  {t('admin.prev', lang)}
                </button>
                <span className="px-4 py-2 text-text-light dark:text-gray-300">{t('admin.page', lang, { n: usersPage })}</span>
                <button
                  onClick={() => setUsersPage(p => p + 1)}
                  className="px-4 py-2 bg-stone-100 dark:bg-surface-dark rounded"
                >
                  {t('admin.next', lang)}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-stone-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-text-light dark:text-white">{t('admin.activitiesTitle', lang)}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">ID</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.user', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.action', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.credit', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.description', lang)}</th>
                    <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.date', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-stone-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{activity.id}</td>
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{activity.user_id}</td>
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{activity.action_type}</td>
                      <td className="py-3 px-4 text-text-light dark:text-gray-300">{activity.credits_used}</td>
                      <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{activity.description}</td>
                      <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{new Date(activity.created_at).toLocaleString(localeFor(lang))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg p-4 mb-4">
              <select
                value={paymentsStatus}
                onChange={(e) => setPaymentsStatus(e.target.value)}
                className="px-4 py-2 border border-stone-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark text-text-light dark:text-gray-300"
              >
                <option value="">{t('admin.filter.all', lang)}</option>
                <option value="pending">{t('admin.filter.pending', lang)}</option>
                <option value="completed">{t('admin.filter.completed', lang)}</option>
                <option value="failed">{t('admin.filter.failed', lang)}</option>
              </select>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">ID</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.user', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.credit', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">TRY</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">EUR</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.status', lang)}</th>
                      <th className="text-left py-3 px-4 text-text-light dark:text-white">{t('admin.col.date', lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-stone-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">{payment.id}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">{payment.email}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">{payment.package_credits}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">₺{parseFloat(payment.amount_try as string).toFixed(2)}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">€{parseFloat(payment.amount_eur as string).toFixed(2)}</td>
                        <td className="py-3 px-4 text-text-light dark:text-gray-300">
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            payment.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-light dark:text-gray-300">{new Date(payment.created_at).toLocaleString(localeFor(lang))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-text-light dark:text-white mb-6">{t('admin.settingsTitle', lang)}</h2>
            
            <div className="space-y-8">
              {/* Ücretsiz Kredi Ayarı */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                  {t('admin.freeCredits', lang)}
                </label>
                <input
                  type="number"
                  value={settings.free_credits_on_signup || '10'}
                  onChange={(e) => setSettings({ ...settings, free_credits_on_signup: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark text-text-light dark:text-gray-300"
                />
              </div>

              {/* Paket Fiyatları */}
              <div>
                <h3 className="text-lg font-bold text-text-light dark:text-white mb-4">{t('admin.packagePrices', lang)}</h3>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="text-xl font-bold text-primary">{t('admin.pkgCredits', lang, { n: pkg.credits })}</div>
                        <div className="text-sm text-text-muted-light dark:text-gray-400">
                          ID: {pkg.id} {pkg.is_active ? t('admin.active', lang) : t('admin.inactive', lang)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                          {t('admin.priceTry', lang)}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={pkg.price_try}
                          onChange={(e) => {
                            const newPackages = packages.map(p => 
                              p.id === pkg.id ? { ...p, price_try: parseFloat(e.target.value) } : p
                            );
                            setPackages(newPackages);
                          }}
                          className="w-full px-4 py-2 border border-stone-300 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark text-text-light dark:text-gray-300"
                        />
                      </div>
                      <button
                        onClick={() => handleUpdatePackagePrice(pkg.id, pkg)}
                        className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-yellow-500"
                      >
                        {t('admin.update', lang)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdateSettings}
                className="px-6 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-yellow-500"
              >
                {t('admin.saveSettings', lang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
