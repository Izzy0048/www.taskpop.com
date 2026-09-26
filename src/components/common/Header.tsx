import React, { useState } from 'react';
import {
  Flame,
  Shield,
  User as UserIcon,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Lock,
  Wallet,
  CheckCircle2,
  Clock,
  LogOut,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenDeposit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenDeposit }) => {
  const {
    currentUser,
    users,
    isAdmin,
    activeView,
    setActiveView,
    switchUser,
    logout,
    resetToDefaults,
    totalPlatformProfit,
  } = useApp();

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showAdminDeniedNotice, setShowAdminDeniedNotice] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      setActiveView(activeView === 'admin' ? 'user' : 'admin');
    } else {
      setShowAdminDeniedNotice(true);
      setTimeout(() => setShowAdminDeniedNotice(false), 4000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveView(isAdmin ? 'admin' : 'user')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-cyan-400 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono">
                    Task<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">Pop</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                    SMM Booster
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 hidden sm:block">
                  Micro-task & Viral Social Growth Panel
                </p>
              </div>
            </div>

            {/* View Switcher Badge (Admin vs Worker) */}
            {isAdmin && (
              <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 ml-2">
                <button
                  onClick={() => setActiveView('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeView === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-300" />
                  Admin Portal
                </button>
                <button
                  onClick={() => setActiveView('user')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeView === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  Worker View
                </button>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance / Real Admin Profit Chip */}
            {currentUser && (
              <div
                onClick={onOpenDeposit}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer transition group"
                title={
                  activeView === 'admin'
                    ? 'Total Real Profit = (Admitted Users × ₦200) + (Withdrawal Fees × ₦50) + (Order Margins)'
                    : 'Click to manage wallet / deposit'
                }
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition group-hover:scale-105 ${
                    activeView === 'admin'
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {activeView === 'admin' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-zinc-400 block leading-tight font-medium">
                    {activeView === 'admin' ? 'Total Profit' : 'Balance'}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-extrabold font-mono ${
                      activeView === 'admin' ? 'text-purple-300' : 'text-emerald-400'
                    }`}
                  >
                    ₦
                    {activeView === 'admin'
                      ? totalPlatformProfit.toLocaleString()
                      : currentUser.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Admin Access Button (Mobile or Non-admin feedback) */}
            <button
              onClick={handleAdminClick}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeView === 'admin'
                  ? 'bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-lg shadow-purple-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              )}
            </button>

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-200 transition"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="text-left hidden lg:block max-w-[110px] truncate">
                  <span className="text-[11px] font-semibold text-zinc-200 block truncate">
                    {currentUser?.name || 'Account'}
                  </span>
                  <span className="text-[9px] text-zinc-400 block -mt-0.5 truncate">
                    {currentUser?.role === 'admin' ? 'Super Admin' : currentUser?.status}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Dropdown Menu */}
              {switcherOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSwitcherOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                    <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                        Quick Demo Role Switcher
                      </span>
                      <p className="text-[11px] text-zinc-300 mt-0.5">
                        Test full features across roles:
                      </p>
                    </div>

                    <div className="space-y-1">
                      {users.slice(0, 5).map((u) => {
                        const isThisUser = u.id === currentUser?.id;
                        const isSuperAdmin = u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase();

                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setSwitcherOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition ${
                              isThisUser
                                ? 'bg-zinc-800 text-white font-semibold'
                                : 'hover:bg-zinc-800/60 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSuperAdmin
                                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                                    : u.status === 'active'
                                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                                }`}
                              >
                                {isSuperAdmin ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                              </div>
                              <div className="overflow-hidden">
                                <span className="block truncate text-xs font-medium text-white">
                                  {u.name}
                                </span>
                                <span className="block truncate text-[10px] text-zinc-400 font-mono">
                                  {u.email}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-1">
                              {isSuperAdmin ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                                  Admin
                                </span>
                              ) : u.status === 'active' ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Active
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-zinc-800 mt-2 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setSwitcherOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sign In or Create Account</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Reset TaskPop database back to default seed data?')) {
                            resetToDefaults();
                            setSwitcherOpen(false);
                          }
                        }}
                        className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Seed Data</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setSwitcherOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Switch to Demo Admin</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Access Denied Alert Modal */}
      {showAdminDeniedNotice && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 bg-zinc-900 border border-purple-500/50 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Admin Restricted Portal</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Per requirement: Only <strong className="text-purple-300 font-mono">{PAYMENT_CONFIG.ADMIN_EMAIL}</strong> can access the Admin Portal.
              </p>
              <button
                onClick={() => {
                  const admin = users.find((u) => u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
                  if (admin) {
                    switchUser(admin.id);
                    setActiveView('admin');
                    setShowAdminDeniedNotice(false);
                  }
                }}
                className="mt-2.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Shield className="w-3.5 h-3.5" />
                Log in as Admin (ajinugraceranti@gmail.com)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
