import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

export const ReferralView: React.FC = () => {
  const { currentUser, referrals, users } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const refCode = currentUser?.referralCode || 'TP-INVITE';
  const referralLink = `https://taskpop.ng/join?ref=${refCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Friends invited by current user
  const myReferrals = currentUser
    ? referrals.filter((r) => r.referrerId === currentUser.id)
    : [];

  const qualifiedCount = myReferrals.filter(
    (r) => r.referredUserTasksCount >= PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS
  ).length;

  const totalBonusEarned = myReferrals
    .filter((r) => r.status === 'paid')
    .reduce((acc, r) => acc + r.bonusAmount, 0);

  return (
    <div className="space-y-6">
      {/* Referral Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-cyan-900/30 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden space-y-4">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            <span>₦{PAYMENT_CONFIG.REFERRAL_BONUS} Per Qualified Friend</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Invite Friends & Earn ₦{PAYMENT_CONFIG.REFERRAL_BONUS} Referral Commission
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Share your exclusive link or referral code. Once your referred friend activates their account and completes at least{' '}
            <strong className="text-cyan-300">{PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS} approved tasks</strong>, ₦{PAYMENT_CONFIG.REFERRAL_BONUS} is immediately deposited into your balance!
          </p>
        </div>

        {/* Share Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Referral Code Box */}
          <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Your Referral Code</span>
              <span className="text-base font-black text-cyan-400 font-mono tracking-wider">
                {refCode}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Referral Link Box */}
          <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div className="overflow-hidden mr-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Your Invite Link</span>
              <span className="text-xs font-mono text-zinc-300 truncate block">
                {referralLink}
              </span>
            </div>
            <button
              onClick={copyLink}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-lg shadow-pink-500/20"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center sm:text-left">
          <span className="text-[11px] text-zinc-400 block mb-1">Invited Friends</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">{myReferrals.length}</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center sm:text-left">
          <span className="text-[11px] text-zinc-400 block mb-1">Qualified (≥ 2 Tasks)</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{qualifiedCount}</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-emerald-800/40 rounded-2xl text-center sm:text-left">
          <span className="text-[11px] text-zinc-400 block mb-1">Bonus Earned</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            ₦{totalBonusEarned.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Referral Tracking List */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Friends You Have Referred
        </h3>

        {myReferrals.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 space-y-2">
            <Gift className="w-8 h-8 mx-auto text-zinc-700" />
            <p>You haven't referred any friends yet. Share your code to start receiving ₦100 bonuses!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myReferrals.map((r) => {
              const tasksDone = r.referredUserTasksCount;
              const isQualified = tasksDone >= PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS;

              return (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{r.referredUserEmail}</span>
                    <span className="text-[10px] text-zinc-500">
                      Joined: {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] font-mono block text-zinc-300">
                        {tasksDone} / {PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS} tasks
                      </span>
                      {isQualified ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 justify-end">
                          <CheckCircle2 className="w-3 h-3" />
                          Bonus Credited (+₦{r.bonusAmount})
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 justify-end">
                          <Clock className="w-3 h-3" />
                          Pending {PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS - tasksDone} task(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
