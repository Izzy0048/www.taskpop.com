import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  CheckCircle,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Check,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, PAYMENT_CONFIG } from '../../types';

interface WorkerFeedProps {
  onOpenActivation: () => void;
  onOpenCreateOrder: () => void;
}

export const WorkerFeed: React.FC<WorkerFeedProps> = ({
  onOpenActivation,
  onOpenCreateOrder,
}) => {
  const { currentUser, orders, completeTask, hasCompletedTask } = useApp();
  const [activeTaskOrderId, setActiveTaskOrderId] = useState<string | null>(null);
  const [taskStep, setTaskStep] = useState<'idle' | 'opened' | 'confirming'>('idle');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Workers see available jobs from APPROVED ORDERS ONLY (status === 'Running' and completedCount < quantity)
  const availableOrders = orders.filter(
    (o) => o.status === 'Running' && o.completedCount < o.quantity
  );

  const filteredOrders = availableOrders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.serviceType.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleStartTask = (order: Order) => {
    if (!currentUser) return;
    if (currentUser.status !== 'active') {
      onOpenActivation();
      return;
    }

    if (hasCompletedTask(order.id, currentUser.id)) {
      setFeedbackMsg({ text: 'You have already done this task!', success: false });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    setActiveTaskOrderId(order.id);
    setTaskStep('opened');

    // Open target link in new tab
    window.open(order.link, '_blank');
  };

  const handleConfirmDone = (orderId: string) => {
    const res = completeTask(orderId);
    if (res.success) {
      setFeedbackMsg({ text: res.message, success: true });
    } else {
      setFeedbackMsg({ text: res.message, success: false });
    }
    setActiveTaskOrderId(null);
    setTaskStep('idle');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner for Workers */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-500/20 border border-pink-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>High Payout SMM Tasks Live Now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Perform Quick Social Tasks & Earn Real Cash
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Follow TikTok accounts, like videos, and subscribe to channels. Instant balance credit on completion. No screenshots needed!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          {currentUser?.status !== 'active' ? (
            <button
              onClick={onOpenActivation}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold rounded-2xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Activate Account (₦{PAYMENT_CONFIG.ACTIVATION_FEE})</span>
            </button>
          ) : (
            <button
              onClick={onOpenCreateOrder}
              className="px-4 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-400 text-white font-extrabold rounded-2xl text-xs transition shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Boost Your Own TikTok</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Activation Warning Banner if Pending */}
      {currentUser && currentUser.status === 'pending' && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                Account Activation Pending (₦{PAYMENT_CONFIG.ACTIVATION_FEE})
              </span>
              <p className="text-zinc-300">
                You must pay ₦{PAYMENT_CONFIG.ACTIVATION_FEE} to PalmPay{' '}
                <strong className="text-amber-300 font-mono">{PAYMENT_CONFIG.PALMPAY_NUMBER}</strong> ({PAYMENT_CONFIG.PALMPAY_NAME}) to unlock task earnings.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenActivation}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl transition text-xs shrink-0 self-stretch sm:self-auto"
          >
            Submit Proof / Pay Now
          </button>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-fadeIn shadow-2xl ${
            feedbackMsg.success
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500 text-rose-300'
          }`}
        >
          {feedbackMsg.success ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Task Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'follow', 'like', 'comment', 'share', 'sub'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
              activeFilter === filter
                ? 'bg-white text-black shadow-md'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {filter === 'all' ? 'All Tasks' : filter}
          </button>
        ))}
        <span className="text-xs text-zinc-500 ml-auto whitespace-nowrap font-mono">
          {availableOrders.length} Available Jobs
        </span>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-3">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No active tasks in this category right now</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Employers post new TikTok and social booster orders regularly. Check back shortly or create your own booster order.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const alreadyDone = hasCompletedTask(order.id, currentUser?.id);
            const remainingSlots = Math.max(0, order.quantity - order.completedCount);
            const progressPct = Math.round((order.completedCount / order.quantity) * 100);
            const isCurrentlyDoing = activeTaskOrderId === order.id;

            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                  alreadyDone
                    ? 'bg-zinc-900/40 border-zinc-800/60 opacity-70'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-pink-500/50 shadow-xl'
                }`}
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition" />

                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-extrabold uppercase">
                        {order.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-bold">
                        {order.serviceType}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block font-medium">Payout</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        +₦{order.workerPayPerUnit.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition">
                    {order.serviceName}
                  </h3>

                  <p className="text-[11px] text-zinc-400 line-clamp-1 font-mono">
                    Target: {order.link}
                  </p>
                </div>

                {/* Progress bar & slots left */}
                <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Available Slots</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {remainingSlots} left <span className="text-zinc-500 font-normal">({order.completedCount}/{order.quantity})</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressPct}%` }}
                      className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-1">
                  {alreadyDone ? (
                    <div className="w-full py-2.5 px-4 bg-zinc-800/60 text-zinc-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Completed by You</span>
                    </div>
                  ) : isCurrentlyDoing ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-[11px] text-cyan-300 text-center">
                        Task opened in new tab! After completing the action, click <strong>Done</strong> below.
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => window.open(order.link, '_blank')}
                          className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Reopen Link
                        </button>
                        <button
                          onClick={() => handleConfirmDone(order.id)}
                          className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-black font-black rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          Done (+₦{order.workerPayPerUnit})
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartTask(order)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-90 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Do Task (+₦{order.workerPayPerUnit.toFixed(2)})</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 transition" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
