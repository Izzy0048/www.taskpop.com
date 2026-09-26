import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Clock,
  ArrowDownRight,
  Search,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const copyNumber = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.id.toLowerCase().includes(q) ||
      w.userEmail.toLowerCase().includes(q) ||
      w.palmpayNumber.includes(q) ||
      w.palmpayName.toLowerCase().includes(q)
    );
  });

  const pendingList = withdrawals.filter((w) => w.status === 'pending');
  const totalPendingPayout = pendingList.reduce((acc, w) => acc + w.netAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            PalmPay Withdrawal Payouts
          </h2>
          <p className="text-xs text-zinc-400">
            Min withdrawal: ₦{PAYMENT_CONFIG.MIN_WITHDRAWAL} | Fixed fee: ₦{PAYMENT_CONFIG.WITHDRAWAL_FEE} | User receives (Requested - ₦50).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Palmpay phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Pending Payout Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 block">Total Pending PalmPay Payouts:</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ₦{totalPendingPayout.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-xs text-zinc-400 sm:text-right">
          <span className="text-white font-semibold block">
            {pendingList.length} user requests waiting
          </span>
          <span>Send exact net amount via your PalmPay app, then click "Mark as Paid".</span>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-3">User Email</th>
                <th className="py-3.5 px-3">PalmPay Account</th>
                <th className="py-3.5 px-3">Requested</th>
                <th className="py-3.5 px-3">Fee (₦50)</th>
                <th className="py-3.5 px-3">Net Amount to Send</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-800/30 transition text-zinc-300"
                  >
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      #{item.id}
                      <span className="block text-[10px] text-zinc-500 font-normal">
                        {new Date(item.requestedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* User Email */}
                    <td className="py-3.5 px-3">
                      <span className="text-zinc-200 block truncate max-w-[150px]">
                        {item.userEmail}
                      </span>
                    </td>

                    {/* PalmPay Account details & Copy button */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-cyan-400 text-xs">
                          {item.palmpayNumber}
                        </span>
                        <button
                          onClick={() => copyNumber(item.palmpayNumber, item.id)}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                          title="Copy phone number"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-400 block truncate max-w-[130px]">
                        {item.palmpayName}
                      </span>
                    </td>

                    {/* Amount Requested */}
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      ₦{item.amountRequested.toLocaleString()}
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-3 font-mono text-zinc-400">
                      ₦{item.fee}
                    </td>

                    {/* Net Amount to Send */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-extrabold text-sm text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/40 inline-block">
                        ₦{item.netAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-2.5 h-2.5" />
                          Pending Payout
                        </span>
                      )}
                      {item.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Paid
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-2.5 h-2.5" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectingId(item.id)}
                            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-rose-950 text-rose-400 rounded-xl text-[11px] font-bold transition border border-zinc-700"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveWithdrawal(item.id)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-black rounded-xl text-[11px] font-black transition shadow-lg shadow-emerald-500/20 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Mark as Paid
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">
                          {item.processedAt ? new Date(item.processedAt).toLocaleDateString() : 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Reject Withdrawal & Refund User
            </h3>
            <p className="text-xs text-zinc-400">
              The requested amount will be immediately credited back to the user's wallet balance.
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Reason for rejection
              </label>
              <input
                type="text"
                placeholder="e.g. Invalid PalmPay account number"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason('');
                }}
                className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectWithdrawal(rejectingId, rejectReason || 'Rejected by admin');
                  setRejectingId(null);
                  setRejectReason('');
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
              >
                Confirm Rejection & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
