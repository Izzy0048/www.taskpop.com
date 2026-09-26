import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingBag,
  CreditCard,
  Gift,
  Shield,
  Lock,
  Flame,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminServices } from './AdminServices';
import { AdminOrders } from './AdminOrders';
import { AdminWithdrawals } from './AdminWithdrawals';
import { AdminReferrals } from './AdminReferrals';

export const AdminLayout: React.FC = () => {
  const { currentUser, users, isAdmin, switchUser, setActiveView, orders, withdrawals } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'services' | 'orders' | 'withdrawals' | 'referrals'>('dashboard');

  const pendingActivationCount = users.filter((u) => u.status === 'pending').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  // Strict Admin Email Guard:
  // "ADMIN PORTAL IS THE MAIN THING - Admin email: ajinugraceranti@gmail.com - Only this email can access Admin."
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Only authorized administrator <strong className="text-purple-300 font-mono">{PAYMENT_CONFIG.ADMIN_EMAIL}</strong> has access to the TaskPop Admin Management Portal.
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-400 text-left">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Currently Logged In As:</span>
            <span className="text-white font-semibold block">{currentUser?.email || 'Anonymous'}</span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                const adminUser = users.find((u) => u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
                if (adminUser) {
                  switchUser(adminUser.id);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Log in as Super Admin ({PAYMENT_CONFIG.ADMIN_EMAIL})</span>
            </button>

            <button
              onClick={() => setActiveView('user')}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition"
            >
              Return to Worker View
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'users',
      label: 'Admissions & Users',
      icon: Users,
      badge: pendingActivationCount > 0 ? pendingActivationCount : null,
      badgeColor: 'bg-amber-500 text-black',
    },
    {
      id: 'services',
      label: 'Services & Pricing',
      icon: Layers,
      badge: null,
    },
    {
      id: 'orders',
      label: 'Orders Pipeline',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-cyan-500 text-black',
    },
    {
      id: 'withdrawals',
      label: 'PalmPay Withdrawals',
      icon: CreditCard,
      badge: pendingWithdrawalsCount > 0 ? pendingWithdrawalsCount : null,
      badgeColor: 'bg-emerald-500 text-black',
    },
    {
      id: 'referrals',
      label: 'Referral System',
      icon: Gift,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Admin Subheader Navigation Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-white border border-purple-500/40 shadow-lg shadow-purple-950/40'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          item.badgeColor || 'bg-purple-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Switch to User Worker Feed */}
            <button
              onClick={() => setActiveView('user')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl transition flex items-center gap-1 whitespace-nowrap shrink-0 ml-2"
            >
              <span>Worker Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={(t) => setActiveTab(t as any)} />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'withdrawals' && <AdminWithdrawals />}
        {activeTab === 'referrals' && <AdminReferrals />}
      </main>
    </div>
  );
};
