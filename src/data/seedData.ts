import { User, Service, Order, TaskCompletion, Withdrawal, ReferralRecord, PAYMENT_CONFIG } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-tiktok-followers',
    name: 'TikTok Real Followers',
    type: 'Follow',
    platform: 'tiktok',
    priceEmployerPays: 14, // ₦14
    priceWorkerGets: 8,   // ₦8
    profitMargin: 6,      // ₦6 profit per follower
    minQuantity: 20,
    maxQuantity: 5000,
    description: 'Real active Nigerian & African TikTok users follow your account permanently.',
    active: true,
  },
  {
    id: 'srv-tiktok-likes',
    name: 'TikTok Video Likes',
    type: 'Like',
    platform: 'tiktok',
    priceEmployerPays: 8, // ₦8
    priceWorkerGets: 5,   // ₦5
    profitMargin: 3,      // ₦3 profit per like
    minQuantity: 25,
    maxQuantity: 10000,
    description: 'Instant genuine likes to push your video to TikTok For You Page (FYP) algorithm.',
    active: true,
  },
  {
    id: 'srv-tiktok-comments',
    name: 'TikTok Custom Comments',
    type: 'Comment',
    platform: 'tiktok',
    priceEmployerPays: 20, // ₦20
    priceWorkerGets: 12,  // ₦12
    profitMargin: 8,      // ₦8 profit per comment
    minQuantity: 10,
    maxQuantity: 2000,
    description: 'Relevant high-engagement comments boosting your TikTok watch-time and virality.',
    active: true,
  },
  {
    id: 'srv-tiktok-shares',
    name: 'TikTok Video Shares & Reposts',
    type: 'Share',
    platform: 'tiktok',
    priceEmployerPays: 10, // ₦10
    priceWorkerGets: 6,   // ₦6
    profitMargin: 4,      // ₦4 profit
    minQuantity: 20,
    maxQuantity: 5000,
    description: 'Users share and copy link of your video to boost algorithmic distribution.',
    active: true,
  },
  {
    id: 'srv-youtube-sub',
    name: 'YouTube Channel Subscribers',
    type: 'Sub',
    platform: 'youtube',
    priceEmployerPays: 25, // ₦25
    priceWorkerGets: 15,  // ₦15
    profitMargin: 10,     // ₦10 profit
    minQuantity: 20,
    maxQuantity: 3000,
    description: 'Organic channel subscriptions from real active accounts.',
    active: true,
  },
  {
    id: 'srv-instagram-followers',
    name: 'Instagram Profile Followers',
    type: 'Follow',
    platform: 'instagram',
    priceEmployerPays: 16,
    priceWorkerGets: 9,
    profitMargin: 7,
    minQuantity: 25,
    maxQuantity: 5000,
    description: 'Targeted Nigerian Instagram followers to enhance personal or business social proof.',
    active: true,
  }
];

// Pure initial database: Only the designated Admin user exists, starting strictly at ₦0.
// Zero fake users, zero fake orders, zero fake withdrawals, zero fake profit.
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    email: PAYMENT_CONFIG.ADMIN_EMAIL, // ajinugraceranti@gmail.com
    name: 'Ajinu Grace Ranti (Super Admin)',
    role: 'admin',
    status: 'active',
    referralCode: 'TP-ADMIN',
    balance: 0, // Starts at ₦0
    pendingBalance: 0,
    totalEarned: 0,
    totalSpent: 0,
    tasksDoneCount: 0,
    createdAt: new Date().toISOString(),
    palmpayNumber: PAYMENT_CONFIG.PALMPAY_NUMBER,
    palmpayName: PAYMENT_CONFIG.PALMPAY_NAME,
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_COMPLETIONS: TaskCompletion[] = [];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [];

export const INITIAL_REFERRALS: ReferralRecord[] = [];
