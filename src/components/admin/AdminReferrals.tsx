import React, { useState } from 'react';
import {
  Gift,
  CheckCircle2,
  Clock,
  Search,
  Users,
  Award,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

export const AdminReferrals: React.FC = () => {
  const { referrals, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  const filtered = referrals.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.referrerEmail.toLowerCase().includes(q) ||
      r.referredUserEmail.toLowerCase().includes(q)
    );
  });

  const totalBonusesPaid = referrals
    .filter((r) => r.status === 'paid')
    .reduce((acc, r) => acc + r.bonusAmount, 0);

  const qualifiedCount = referrals.filter((r) => r.referredUserTasksCount >= PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-400" />
            Referral & Affiliate Commission System
          </h2>
          <p className="text-xs text-zinc-400">
            Rules: Referrer receives ₦{PAYMENT_CONFIG.REFERRAL_BONUS} bonus <strong className="text-white">only after</strong> the invited user completes {PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS} approved tasks.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search referrer or invited friend..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <span className="text-xs text-zinc-400 block mb-1">Total Referrals Initiated</span>
          <span className="text-2xl font-black text-white font-mono">{referrals.length}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Invited via unique referral codes</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <span className="text-xs text-zinc-400 block mb-1">Qualified (Completed ≥ 2 Tasks)</span>
          <span className="text-2xl font-black text-cyan-400 font-mono">{qualifiedCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Unlocked ₦{PAYMENT_CONFIG.REFERRAL_BONUS} reward</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-emerald-800/40 rounded-2xl">
          <span className="text-xs text-zinc-400 block mb-1">Total Referral Bonuses Paid</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            ₦{totalBonusesPaid.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-500/80 block mt-1">
            Auto-credited to referrers' balances
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            filterStatus === 'all'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All ({referrals.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'pending'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-amber-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Pending Completion
        </button>
        <button
          onClick={() => setFilterStatus('paid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'paid'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-emerald-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Qualified & Paid (₦100)
        </button>
      </div>

      {/* Referrals Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Referrer User</th>
                <th className="py-3.5 px-3">Referred User (Friend)</th>
                <th className="py-3.5 px-3">Friend's Tasks Done</th>
                <th className="py-3.5 px-3">Qualification Criteria</th>
                <th className="py-3.5 px-3">Bonus Amount</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Invited Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    No referral records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const tasksDone = item.referredUserTasksCount;
                  const isQualified = tasksDone >= PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-800/30 transition text-zinc-300"
                    >
                      {/* Referrer */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block truncate max-w-[150px]">
                          {item.referrerEmail}
                        </span>
                        <span className="text-[10px] text-purple-400 font-mono">
                          Referrer
                        </span>
                      </td>

                      {/* Referred User */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-zinc-200 block truncate max-w-[150px]">
                          {item.referredUserEmail}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Referred User
                        </span>
                      </td>

                      {/* Tasks Done */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              isQualified ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {tasksDone}
                          </span>
                          <span className="text-zinc-500">/ {PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS} tasks</span>
                        </div>
                      </td>

                      {/* Qualification Criteria */}
                      <td className="py-3.5 px-3">
                        {isQualified ? (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Goal Reached (2/2)
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Needs {PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS - tasksDone} more task
                          </span>
                        )}
                      </td>

                      {/* Bonus Amount */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        ₦{item.bonusAmount}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {item.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Paid (₦100)
                          </span>
                        ) : isQualified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">
                            Pending Tasks
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-right text-[11px] text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
