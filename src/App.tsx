/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AdminLayout } from './components/admin/AdminLayout';
import { UserLayout } from './components/user/UserLayout';
import { AuthModal } from './components/common/AuthModal';
import { CreateOrderModal } from './components/user/CreateOrderModal';
import { Shield, Sparkles, Clock, CheckCircle2, UserCheck, Flame } from 'lucide-react';
import { PAYMENT_CONFIG } from './types';

function MainAppContent() {
  const { activeView, currentUser, users, switchUser, setActiveView } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  const isAdminUser = currentUser?.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDeposit={() => {
          setActiveView('user');
        }}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'admin' ? (
          <AdminLayout />
        ) : (
          <UserLayout onOpenAuth={() => setAuthModalOpen(true)} />
        )}
      </div>

      {/* Global Bottom-Right Role Switcher Dock */}
      <div className="hidden sm:flex fixed bottom-4 right-4 z-40 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-1.5 shadow-2xl items-center gap-1.5 text-xs">
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-2">
          Mode:
        </span>

        {/* Admin ajinugraceranti@gmail.com */}
        <button
          onClick={() => {
            const admin = users.find((u) => u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
            if (admin) {
              switchUser(admin.id);
              setActiveView('admin');
            }
          }}
          className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
            isAdminUser && activeView === 'admin'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-purple-300 hover:bg-purple-950/60'
          }`}
          title="Switch to ajinugraceranti@gmail.com (Super Admin)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>

        {/* Active Worker (if any exists) */}
        {users.some((u) => u.status === 'active' && u.role === 'user') && (
          <button
            onClick={() => {
              const activeUser = users.find((u) => u.status === 'active' && u.role === 'user');
              if (activeUser) {
                switchUser(activeUser.id);
                setActiveView('user');
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              currentUser?.status === 'active' && !isAdminUser
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-300 hover:bg-emerald-950/60'
            }`}
            title="Switch to Active Worker"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Worker</span>
          </button>
        )}

        {/* Pending Worker (if any exists) */}
        {users.some((u) => u.status === 'pending') && (
          <button
            onClick={() => {
              const pendingUser = users.find((u) => u.status === 'pending');
              if (pendingUser) {
                switchUser(pendingUser.id);
                setActiveView('user');
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              currentUser?.status === 'pending'
                ? 'bg-amber-600 text-black shadow-md'
                : 'text-amber-300 hover:bg-amber-950/60'
            }`}
            title="Switch to Pending User"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ₦200</span>
          </button>
        )}

        {/* If no other users registered, show Register button */}
        {!users.some((u) => u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()) && (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-1"
            title="Register a new user"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Register Worker</span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onOpenDeposit={() => setActiveView('user')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
