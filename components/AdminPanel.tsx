/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
    getAdminUsers,
    getAdminPurchases,
    getAdminLogs,
    saveAdminUsers,
    updateUserCredits,
    ManagedUser,
    PurchaseOrder,
    SystemLog
} from '../lib/adminStore';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { getCustomApiKeys, saveCustomApiKeys } from '../services/geminiService';
import { playTick, playSuccess, playWarp } from '../lib/sfxUtils';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
    const { user, isAdmin } = useAuth();
    const { credits, addCredits } = usePayment();

    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'purchases' | 'logs' | 'settings'>('overview');
    const [usersList, setUsersList] = useState<ManagedUser[]>([]);
    const [purchasesList, setPurchasesList] = useState<PurchaseOrder[]>([]);
    const [logsList, setLogsList] = useState<SystemLog[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [logFilter, setLogFilter] = useState<string>('ALL');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // API Keys state
    const [geminiKeyInput, setGeminiKeyInput] = useState<string>('');
    const [kieKeyInput, setKieKeyInput] = useState<string>('');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        if (isOpen) {
            setUsersList(getAdminUsers());
            setPurchasesList(getAdminPurchases());
            setLogsList(getAdminLogs());
            const keys = getCustomApiKeys();
            setGeminiKeyInput(keys.geminiKey);
            setKieKeyInput(keys.kieKey);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Quick Action: Add 1000 credits to admin
    const handleAddAdminCredits = (amount: number = 1000) => {
        playWarp();
        addCredits(amount);
        if (user?.email) {
            updateUserCredits(user.email, credits + amount);
            setUsersList(getAdminUsers());
        }
        showToast(`⚡ Hesabınıza +${amount} Plütonyum Kredisi yüklendi!`);
    };

    // User credit adjustment
    const handleAdjustUserCredits = (email: string, delta: number) => {
        playTick();
        const updated = usersList.map(u => {
            if (u.email.toLowerCase() === email.toLowerCase()) {
                const newCreds = Math.max(0, u.credits + delta);
                return { ...u, credits: newCreds };
            }
            return u;
        });
        setUsersList(updated);
        saveAdminUsers(updated);
        showToast(`${email} kullanıcısına ${delta > 0 ? '+' : ''}${delta} kredi güncellendi.`);
    };

    const handleSaveApiKeys = () => {
        playSuccess();
        saveCustomApiKeys(geminiKeyInput, kieKeyInput);
        showToast('API Anahtarları başarıyla kaydedildi!');
    };

    // Filtered users
    const filteredUsers = usersList.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtered logs
    const filteredLogs = logsList.filter(l => {
        if (logFilter === 'ALL') return true;
        return l.action === logFilter;
    });

    const totalRevenue = purchasesList.reduce((acc, p) => acc + (p.status === 'COMPLETED' ? p.amountTl : 0), 0);
    const totalGenerationsCount = usersList.reduce((acc, u) => acc + u.totalGenerations, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Main Admin Panel Modal Window */}
            <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-100">
                
                {/* Top Notification Toast */}
                {toastMessage && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl border-2 border-white animate-bounce">
                        {toastMessage}
                    </div>
                )}

                {/* Admin Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                            🛡️
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                                    ZAMAN MAKİNESİ — YÖNETİM PANELİ
                                </h2>
                                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    SUPER ADMIN
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                                Giriş: <span className="text-amber-300 font-bold">{user?.email || 'hikmet044@gmail.com'}</span> | Sistem Durumu: <span className="text-emerald-400 font-bold">● Çevrimiçi</span>
                            </p>
                        </div>
                    </div>

                    {/* Admin Quick Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleAddAdminCredits(1000)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <span>⚡</span>
                            <span>Kendime +1000 Kredi Yükle</span>
                            <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                ({credits})
                            </span>
                        </button>

                        <button
                            onClick={() => { playTick(); onClose(); }}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50 overflow-x-auto">
                    <button
                        onClick={() => { playTick(); setActiveTab('overview'); }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'overview'
                                ? 'border-amber-400 text-amber-300 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>📊</span>
                        <span>Genel Bakış</span>
                    </button>
                    <button
                        onClick={() => { playTick(); setActiveTab('users'); }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'users'
                                ? 'border-amber-400 text-amber-300 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>👥</span>
                        <span>Kullanıcılar ({usersList.length})</span>
                    </button>
                    <button
                        onClick={() => { playTick(); setActiveTab('purchases'); }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'purchases'
                                ? 'border-amber-400 text-amber-300 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>💳</span>
                        <span>Satın Alımlar & Gelir (₺{totalRevenue})</span>
                    </button>
                    <button
                        onClick={() => { playTick(); setActiveTab('logs'); }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'logs'
                                ? 'border-amber-400 text-amber-300 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>📜</span>
                        <span>Canlı Sistem Logları ({logsList.length})</span>
                    </button>
                    <button
                        onClick={() => { playTick(); setActiveTab('settings'); }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'settings'
                                ? 'border-amber-400 text-amber-300 font-black'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>⚙️</span>
                        <span>API & Model Ayarları</span>
                    </button>
                </div>

                {/* Tab Contents Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* KPI Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                                    <div className="text-xs font-bold text-slate-400">Toplam Kullanıcı</div>
                                    <div className="text-3xl font-black text-white font-mono">{usersList.length}</div>
                                    <div className="text-[11px] text-emerald-400">● 5 Aktif Üye</div>
                                </div>
                                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                                    <div className="text-xs font-bold text-slate-400">Toplam Zaman Sıçraması</div>
                                    <div className="text-3xl font-black text-amber-400 font-mono">{totalGenerationsCount}</div>
                                    <div className="text-[11px] text-slate-400">Üretilen Fotoğraf / Klip</div>
                                </div>
                                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                                    <div className="text-xs font-bold text-slate-400">Toplam Paket Satış Geliri</div>
                                    <div className="text-3xl font-black text-emerald-400 font-mono">₺{totalRevenue},00</div>
                                    <div className="text-[11px] text-slate-400">Stripe & Apple Pay</div>
                                </div>
                                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
                                    <div className="text-xs font-bold text-slate-400">Admin Kredi Bakiyesi</div>
                                    <div className="text-3xl font-black text-cyan-400 font-mono">{credits} ⚡</div>
                                    <div className="text-[11px] text-amber-300 font-bold">Sınırsız Yenileme Yetkisi</div>
                                </div>
                            </div>

                            {/* Recent Activity Table Preview */}
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                        <span>⚡</span> Son Canlı Üretimler ve Sıçramalar
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab('logs')}
                                        className="text-xs font-bold text-amber-400 hover:underline"
                                    >
                                        Tüm Logları Gör →
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-slate-400 font-mono">
                                                <th className="pb-3">Zaman</th>
                                                <th className="pb-3">Kullanıcı</th>
                                                <th className="pb-3">İşlem & Çağ</th>
                                                <th className="pb-3">Kredi</th>
                                                <th className="pb-3">Durum</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 font-mono">
                                            {logsList.slice(0, 5).map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-800/40">
                                                    <td className="py-3 text-slate-400">{log.timestamp.substring(11)}</td>
                                                    <td className="py-3 font-sans font-medium text-slate-200">{log.userEmail}</td>
                                                    <td className="py-3 font-sans font-bold text-amber-300">{log.eraTitle || log.action}</td>
                                                    <td className="py-3 text-amber-400">-{log.creditsUsed} ⚡</td>
                                                    <td className="py-3">
                                                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: USERS DIRECTORY */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <input
                                    type="text"
                                    placeholder="Kullanıcı ara (email veya isim)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 w-72"
                                />
                                <div className="text-xs text-slate-400">
                                    Toplam: <strong className="text-white">{filteredUsers.length}</strong> Kullanıcı
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                                            <th className="p-3.5">Kullanıcı / E-posta</th>
                                            <th className="p-3.5">Rol</th>
                                            <th className="p-3.5">Kayıt Tarihi</th>
                                            <th className="p-3.5">Kalan Kredi</th>
                                            <th className="p-3.5">Üretim</th>
                                            <th className="p-3.5">Harcama</th>
                                            <th className="p-3.5 text-right">Kredi Yönetimi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-800/40">
                                                <td className="p-3.5">
                                                    <div className="font-bold text-white">{u.name}</div>
                                                    <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                                                </td>
                                                <td className="p-3.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        u.role === 'admin'
                                                            ? 'bg-amber-400 text-slate-950 font-black'
                                                            : 'bg-slate-800 text-slate-300'
                                                    }`}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-400">{u.createdAt}</td>
                                                <td className="p-3.5 font-mono font-black text-amber-400 text-sm">
                                                    {u.credits} ⚡
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-300">{u.totalGenerations} adet</td>
                                                <td className="p-3.5 font-mono text-emerald-400">₺{u.totalSpentTl}</td>
                                                <td className="p-3.5 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleAdjustUserCredits(u.email, 50)}
                                                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-mono font-bold text-[10px] transition cursor-pointer"
                                                        >
                                                            +50
                                                        </button>
                                                        <button
                                                            onClick={() => handleAdjustUserCredits(u.email, 250)}
                                                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-mono font-bold text-[10px] transition cursor-pointer"
                                                        >
                                                            +250
                                                        </button>
                                                        <button
                                                            onClick={() => handleAdjustUserCredits(u.email, 1000)}
                                                            className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded font-mono font-black text-[10px] transition cursor-pointer"
                                                        >
                                                            +1000
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: PURCHASES & ORDERS */}
                    {activeTab === 'purchases' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-slate-400">
                                    Tamamlanan Siparişler: <strong className="text-white">{purchasesList.length}</strong>
                                </div>
                                <div className="text-sm font-bold text-emerald-400">
                                    Toplam Gelir: ₺{totalRevenue},00
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                                            <th className="p-3.5">Sipariş No</th>
                                            <th className="p-3.5">Müşteri</th>
                                            <th className="p-3.5">Paket</th>
                                            <th className="p-3.5">Kredi</th>
                                            <th className="p-3.5">Tutar</th>
                                            <th className="p-3.5">Ödeme Yöntemi</th>
                                            <th className="p-3.5">Tarih</th>
                                            <th className="p-3.5">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {purchasesList.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-800/40 font-mono">
                                                <td className="p-3.5 text-amber-400 font-bold">{p.orderNumber}</td>
                                                <td className="p-3.5 font-sans text-slate-200">{p.userEmail}</td>
                                                <td className="p-3.5 font-sans font-bold text-white">{p.packageName}</td>
                                                <td className="p-3.5 text-amber-300">+{p.creditsAmount} ⚡</td>
                                                <td className="p-3.5 font-black text-emerald-400 text-sm">₺{p.amountTl}</td>
                                                <td className="p-3.5 font-sans text-slate-400">{p.paymentMethod}</td>
                                                <td className="p-3.5 text-slate-400">{p.date}</td>
                                                <td className="p-3.5">
                                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: SYSTEM & GENERATION LOGS */}
                    {activeTab === 'logs' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {['ALL', 'IMAGE_GENERATE', 'VIDEO_MORPH', 'NEWSPAPER_EXPORT', 'CREDIT_PURCHASE'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => { playTick(); setLogFilter(type); }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            logFilter === type
                                                ? 'bg-amber-400 text-slate-950 font-black'
                                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                                            <th className="p-3.5">Zaman Damgası</th>
                                            <th className="p-3.5">Kullanıcı</th>
                                            <th className="p-3.5">İşlem Türü</th>
                                            <th className="p-3.5">Çağ / Başlık</th>
                                            <th className="p-3.5">Harcanan</th>
                                            <th className="p-3.5">Gecikme</th>
                                            <th className="p-3.5">Teknik Detay</th>
                                            <th className="p-3.5">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filteredLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-800/40">
                                                <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                                                <td className="p-3.5 font-sans text-slate-200">{log.userEmail}</td>
                                                <td className="p-3.5 font-bold text-cyan-300">{log.action}</td>
                                                <td className="p-3.5 font-sans font-medium text-white">{log.eraTitle || '-'}</td>
                                                <td className="p-3.5 text-amber-400">-{log.creditsUsed} ⚡</td>
                                                <td className="p-3.5 text-slate-400">{log.latencyMs ? `${log.latencyMs}ms` : '-'}</td>
                                                <td className="p-3.5 font-sans text-[11px] text-slate-400">{log.details}</td>
                                                <td className="p-3.5">
                                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: SETTINGS & API KEYS */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 max-w-2xl">
                            {/* API Keys Configuration Box */}
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                                <h3 className="text-sm font-black text-white flex items-center gap-2">
                                    <span>🔑</span> Özel API Anahtarları (Admin Canlı Yapılandırma)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Sunucu ortam değişkenlerini değiştirmeden tarayıcınızdan doğrudan kendi API anahtarınızı tanımlayabilirsiniz.
                                </p>

                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1">
                                            Kie.ai API Key (Seedance 5 — 10:1 Maliyet Avantajı)
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="kie_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                            value={kieKeyInput}
                                            onChange={(e) => setKieKeyInput(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1">
                                            Google Gemini API Key (Gemini 2.0 Flash / Imagen)
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx"
                                            value={geminiKeyInput}
                                            onChange={(e) => setGeminiKeyInput(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSaveApiKeys}
                                        className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                                    >
                                        <span>💾</span>
                                        <span>API Anahtarlarını Kaydet</span>
                                    </button>
                                </div>
                            </div>

                            {/* Credit Rates */}
                            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                                <h3 className="text-sm font-black text-white flex items-center gap-2">
                                    <span>⚡</span> Kredi & Harcama Maliyetleri
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                        <span>Tek Fotoğraf Zaman Sıçraması:</span>
                                        <strong className="font-mono text-amber-400">1 Kredi</strong>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                        <span>Tarihi Gazete & Pasaport Çıktısı:</span>
                                        <strong className="font-mono text-amber-400">1 Kredi</strong>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                        <span>9:16 Video Morph Timelapse Klip:</span>
                                        <strong className="font-mono text-amber-400">5 Kredi</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
