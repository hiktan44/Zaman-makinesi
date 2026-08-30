/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemLog {
    id: string;
    timestamp: string;
    userEmail: string;
    action: 'IMAGE_GENERATE' | 'NEWSPAPER_EXPORT' | 'PASSPORT_EXPORT' | 'VIDEO_MORPH' | 'CREDIT_PURCHASE' | 'LOGIN';
    eraTitle?: string;
    creditsUsed: number;
    latencyMs?: number;
    status: 'SUCCESS' | 'ERROR';
    details?: string;
}

export interface ManagedUser {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    credits: number;
    role: 'admin' | 'user';
    totalGenerations: number;
    totalSpentTl: number;
}

export interface PurchaseOrder {
    id: string;
    orderNumber: string;
    userEmail: string;
    packageName: string;
    creditsAmount: number;
    amountTl: number;
    date: string;
    status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
    paymentMethod: string;
}

const LOGS_STORAGE_KEY = 'zm_admin_logs';
const USERS_STORAGE_KEY = 'zm_admin_users';
const PURCHASES_STORAGE_KEY = 'zm_admin_purchases';

export const ADMIN_EMAILS = [
    'hikmet044@gmail.com',
    'hikmet44@gmail.com',
    'admin@zamanmakinesi.app',
];

export function checkIsAdmin(email?: string | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase());
}

// Initial Sample Data for rich out-of-the-box demonstration
const INITIAL_USERS: ManagedUser[] = [
    {
        id: 'usr_admin_1',
        email: 'hikmet044@gmail.com',
        name: 'Hikmet (Admin)',
        createdAt: '2026-08-15 10:30',
        credits: 1000,
        role: 'admin',
        totalGenerations: 142,
        totalSpentTl: 0
    },
    {
        id: 'usr_2',
        email: 'ayse.kaya@gmail.com',
        name: 'Ayşe Kaya',
        createdAt: '2026-08-28 14:15',
        credits: 45,
        role: 'user',
        totalGenerations: 30,
        totalSpentTl: 99
    },
    {
        id: 'usr_3',
        email: 'mehmet.demir@hotmail.com',
        name: 'Mehmet Demir',
        createdAt: '2026-08-29 09:20',
        credits: 120,
        role: 'user',
        totalGenerations: 85,
        totalSpentTl: 199
    },
    {
        id: 'usr_4',
        email: 'can.ozturk@gmail.com',
        name: 'Can Öztürk',
        createdAt: '2026-08-30 08:45',
        credits: 4,
        role: 'user',
        totalGenerations: 6,
        totalSpentTl: 0
    },
    {
        id: 'usr_5',
        email: 'elif.yilmaz@outlook.com',
        name: 'Elif Yılmaz',
        createdAt: '2026-08-30 11:10',
        credits: 22,
        role: 'user',
        totalGenerations: 18,
        totalSpentTl: 49
    }
];

const INITIAL_PURCHASES: PurchaseOrder[] = [
    {
        id: 'ord_101',
        orderNumber: 'ZM-2026-8812',
        userEmail: 'mehmet.demir@hotmail.com',
        packageName: 'Zaman Lordu (250 Kredi)',
        creditsAmount: 250,
        amountTl: 199,
        date: '2026-08-29 16:40',
        status: 'COMPLETED',
        paymentMethod: 'Stripe / Kredi Kartı'
    },
    {
        id: 'ord_102',
        orderNumber: 'ZM-2026-8813',
        userEmail: 'ayse.kaya@gmail.com',
        packageName: 'Zaman Gezgini (75 Kredi)',
        creditsAmount: 75,
        amountTl: 99,
        date: '2026-08-29 18:22',
        status: 'COMPLETED',
        paymentMethod: 'Stripe / Google Pay'
    },
    {
        id: 'ord_103',
        orderNumber: 'ZM-2026-8814',
        userEmail: 'elif.yilmaz@outlook.com',
        packageName: 'Zaman Kapsülü (25 Kredi)',
        creditsAmount: 25,
        amountTl: 49,
        date: '2026-08-30 11:15',
        status: 'COMPLETED',
        paymentMethod: 'Stripe / Apple Pay'
    }
];

const INITIAL_LOGS: SystemLog[] = [
    {
        id: 'log_1',
        timestamp: '2026-08-30 13:18:22',
        userEmail: 'hikmet044@gmail.com',
        action: 'IMAGE_GENERATE',
        eraTitle: '1550 — Osmanlı Saray İhtişamı',
        creditsUsed: 1,
        latencyMs: 1420,
        status: 'SUCCESS',
        details: 'Kie.ai Seedance 5 — 8k Portre Tamamlandı'
    },
    {
        id: 'log_2',
        timestamp: '2026-08-30 13:17:40',
        userEmail: 'hikmet044@gmail.com',
        action: 'IMAGE_GENERATE',
        eraTitle: '1920’ler — Great Gatsby',
        creditsUsed: 1,
        latencyMs: 1280,
        status: 'SUCCESS',
        details: 'Kie.ai Seedance 5 — Flapper Portrait Tamamlandı'
    },
    {
        id: 'log_3',
        timestamp: '2026-08-30 13:15:10',
        userEmail: 'hikmet044@gmail.com',
        action: 'VIDEO_MORPH',
        eraTitle: '9:16 Video Morph Reels (5 Çağ)',
        creditsUsed: 5,
        latencyMs: 3100,
        status: 'SUCCESS',
        details: 'WebM Video Render ve İndirme'
    },
    {
        id: 'log_4',
        timestamp: '2026-08-30 12:45:00',
        userEmail: 'mehmet.demir@hotmail.com',
        action: 'NEWSPAPER_EXPORT',
        eraTitle: '1969 — Ay’a İniş Gazetesi',
        creditsUsed: 1,
        latencyMs: 450,
        status: 'SUCCESS',
        details: 'The Time Traveler Post PNG Çıktısı'
    },
    {
        id: 'log_5',
        timestamp: '2026-08-30 12:30:15',
        userEmail: 'elif.yilmaz@outlook.com',
        action: 'CREDIT_PURCHASE',
        eraTitle: 'Zaman Kapsülü Paketi',
        creditsUsed: 0,
        status: 'SUCCESS',
        details: '+25 Plütonyum Kredisi Eklendi (₺49)'
    }
];

export function getAdminUsers(): ManagedUser[] {
    try {
        const data = localStorage.getItem(USERS_STORAGE_KEY);
        return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
        return INITIAL_USERS;
    }
}

export function saveAdminUsers(users: ManagedUser[]) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getAdminPurchases(): PurchaseOrder[] {
    try {
        const data = localStorage.getItem(PURCHASES_STORAGE_KEY);
        return data ? JSON.parse(data) : INITIAL_PURCHASES;
    } catch {
        return INITIAL_PURCHASES;
    }
}

export function addAdminPurchase(purchase: Omit<PurchaseOrder, 'id'>) {
    const purchases = getAdminPurchases();
    const newPurchase: PurchaseOrder = {
        ...purchase,
        id: 'ord_' + Date.now().toString(36)
    };
    purchases.unshift(newPurchase);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
}

export function getAdminLogs(): SystemLog[] {
    try {
        const data = localStorage.getItem(LOGS_STORAGE_KEY);
        return data ? JSON.parse(data) : INITIAL_LOGS;
    } catch {
        return INITIAL_LOGS;
    }
}

export function addAdminLog(log: Omit<SystemLog, 'id' | 'timestamp'>) {
    const logs = getAdminLogs();
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: SystemLog = {
        ...log,
        id: 'log_' + Date.now().toString(36),
        timestamp: dateStr,
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}

export function updateUserCredits(userEmail: string, newCredits: number) {
    const users = getAdminUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (index !== -1) {
        users[index].credits = newCredits;
        saveAdminUsers(users);
    }
}
