import React, { useState } from 'react';
import { X, Shield, Sparkles, UserCheck, ArrowRight, UserPlus, LogIn, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, switchUser, users } = useApp();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPalmpay, setSignupPalmpay] = useState('');
  const [signupRefCode, setSignupRefCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }
    const ok = login(loginEmail);
    if (ok) {
      onClose();
    } else {
      setErrorMsg(`No account found with "${loginEmail}". Please sign up or choose a quick demo account below.`);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupEmail.trim() || !signupName.trim()) {
      setErrorMsg('Please fill in required fields.');
      return;
    }
    const ok = signup(signupEmail, signupName, signupPalmpay, signupRefCode);
    if (ok) {
      onClose();
    }
  };

  const quickLoginAs = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              TaskPop Account
            </h3>
            <p className="text-xs text-zinc-400">Join the micro-task booster community</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-zinc-950/60 border-b border-zinc-800 gap-1">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Forms */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. ajinugraceranti@gmail.com or your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ngozi David"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ngozi@gmail.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  PalmPay Phone Number (For Payouts)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={signupPalmpay}
                  onChange={(e) => setSignupPalmpay(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TP-ISRAEL99"
                  value={signupRefCode}
                  onChange={(e) => setSignupRefCode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Friend earns ₦100 once you activate and do 2 tasks.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                ℹ️ Note: Account activation is <strong>₦{PAYMENT_CONFIG.ACTIVATION_FEE}</strong> to PalmPay: <strong>{PAYMENT_CONFIG.PALMPAY_NUMBER}</strong> ({PAYMENT_CONFIG.PALMPAY_NAME}).
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
              >
                Create Account & Get Started
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-zinc-800">
            <span className="text-[11px] font-semibold text-zinc-400 block mb-2 uppercase tracking-wider">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-1 gap-2">
              {/* Admin */}
              <button
                onClick={() => {
                  const adm = users.find((u) => u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
                  if (adm) quickLoginAs(adm.id);
                }}
                className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-left flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-purple-300">
                      Super Admin (Ajinu Grace Ranti)
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      ajinugraceranti@gmail.com
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  Admin Access
                </span>
              </button>

              {/* Real Registered Users in Database */}
              {users.filter((u) => u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()).map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLoginAs(u.id)}
                  className={`p-2.5 rounded-xl text-left flex items-center justify-between transition group border ${
                    u.status === 'active'
                      ? 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-800/40'
                      : 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-600/30 text-emerald-300'
                          : 'bg-amber-600/30 text-amber-300'
                      }`}
                    >
                      {u.status === 'active' ? (
                        <UserCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {u.email}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      u.status === 'active'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-amber-400 bg-amber-500/10'
                    }`}
                  >
                    {u.status === 'active' ? 'Active' : 'Pending ₦200'}
                  </span>
                </button>
              ))}

              {users.filter((u) => u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()).length === 0 && (
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                  <p className="text-[11px] text-zinc-400">
                    No worker accounts registered yet. Use the <strong>"Create Account"</strong> tab above to sign up a new account.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
