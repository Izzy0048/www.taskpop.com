import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Wallet,
  Gift,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkerFeed } from './WorkerFeed';
import { CreateOrderModal } from './CreateOrderModal';
import { WalletView } from './WalletView';
import { ReferralView } from './ReferralView';
import { PAYMENT_CONFIG } from '../../types';

interface UserLayoutProps {
  onOpenAuth: () => void;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ onOpenAuth }) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'earn' | 'wallet' | 'referrals'>('earn');
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [walletTabPreselect, setWalletTabPreselect] = useState<'deposit' | 'activation' | undefined>(undefined);

  const openDeposit = () => {
    setActiveTab('wallet');
    setWalletTabPreselect('deposit');
  };

  const openActivation = () => {
    setActiveTab('wallet');
    setWalletTabPreselect('activation');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-20 md:pb-10">
      {/* User Portal Top Tabs Navigation */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between py-2.5">
            {/* Desktop / Tablet Nav Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('earn')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'earn'
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg shadow-pink-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Earn (Worker Feed)</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'wallet'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wallet & PalmPay</span>
              </button>

              <button
                onClick={() => setActiveTab('referrals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'referrals'
                    ? 'bg-purple-900/50 text-purple-200 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-pink-400" />
                <span>Refer & Earn (₦{PAYMENT_CONFIG.REFERRAL_BONUS})</span>
              </button>
            </div>

            {/* Launch Booster Order Button */}
            <button
              onClick={() => setCreateOrderOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-400 hover:opacity-95 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-pink-500/20 flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Boost My TikTok</span>
              <span className="sm:hidden">Boost</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'earn' && (
          <WorkerFeed
            onOpenActivation={openActivation}
            onOpenCreateOrder={() => setCreateOrderOpen(true)}
          />
        )}
        {activeTab === 'wallet' && (
          <WalletView onOpenActivation={openActivation} />
        )}
        {activeTab === 'referrals' && <ReferralView />}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('earn')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'earn' ? 'text-pink-400' : 'text-zinc-400'
          }`}
        >
          <Flame className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-bold">Earn Tasks</span>
        </button>

        <button
          onClick={() => setCreateOrderOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-cyan-400"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center text-white -mt-3 shadow-lg shadow-pink-500/40">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold">Boost</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'wallet' ? 'text-emerald-400' : 'text-zinc-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold">Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'referrals' ? 'text-purple-400' : 'text-zinc-400'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-bold">Referrals</span>
        </button>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onOpenDeposit={openDeposit}
      />
    </div>
  );
};
