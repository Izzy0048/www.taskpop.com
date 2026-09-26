import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Ban,
  ShieldAlert,
  Eye,
  PlusCircle,
  MinusCircle,
  FileText,
  DollarSign,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, PAYMENT_CONFIG } from '../../types';
import { ProofModal } from '../common/ProofModal';

export const AdminUsers: React.FC = () => {
  const {
    users,
    admitUser,
    suspendUser,
    banUser,
    reactivateUser,
    adjustBalance,
    approveActivation,
    rejectActivation,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending' | 'banned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<number>(500);
  const [balanceNote, setBalanceNote] = useState<string>('Admin manual credit');
  const [inspectProofUser, setInspectProofUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = users.filter((u) => {
    // subtab filter
    if (activeSubTab === 'pending' && u.status !== 'pending') return false;
    if (activeSubTab === 'banned' && u.status !== 'banned' && u.status !== 'suspended') return false;

    // search filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.referralCode.toLowerCase().includes(q)
    );
  });

  const pendingUsersWithProof = users.filter(
    (u) => u.status === 'pending' && u.activationProof && u.activationProof.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Admission & User Management
          </h2>
          <p className="text-xs text-zinc-400">
            Control user access, review ₦{PAYMENT_CONFIG.ACTIVATION_FEE} PalmPay proof of payments, and regulate accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email, name, ref code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'all'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          All Users ({users.length})
        </button>

        <button
          onClick={() => setActiveSubTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'pending'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Pending Activations
          {pendingUsersWithProof.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] font-black rounded-full">
              {pendingUsersWithProof.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('banned')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'banned'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-zinc-400 hover:text-rose-300 hover:bg-zinc-900'
          }`}
        >
          <Ban className="w-3.5 h-3.5 text-rose-400" />
          Banned / Suspended ({users.filter((u) => u.status === 'banned' || u.status === 'suspended').length})
        </button>
      </div>

      {/* Pending Activation Spotlight Banner (if on Pending tab) */}
      {activeSubTab === 'pending' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-800/40 text-xs text-amber-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white text-sm block">
                ₦{PAYMENT_CONFIG.ACTIVATION_FEE} PalmPay Activation Verification
              </span>
              <p className="text-zinc-300 mt-0.5">
                Users must transfer ₦{PAYMENT_CONFIG.ACTIVATION_FEE} to PalmPay{' '}
                <strong className="text-white font-mono">{PAYMENT_CONFIG.PALMPAY_NUMBER}</strong> ({PAYMENT_CONFIG.PALMPAY_NAME}). Review the receipt image and transaction ref below to Admit them into the worker network.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User / Email</th>
                <th className="py-3.5 px-3">Referral Code</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Wallet Bal</th>
                <th className="py-3.5 px-3">Tasks Done</th>
                <th className="py-3.5 px-3">Proof / Receipt</th>
                <th className="py-3.5 px-3">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuperAdmin = user.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-800/30 transition text-zinc-300"
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSuperAdmin
                                ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden max-w-[180px]">
                            <span className="font-semibold text-white block truncate">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono block truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Referral Code */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-[11px] text-zinc-300 font-medium">
                          {user.referralCode}
                        </span>
                        {user.referredBy && (
                          <span className="block text-[10px] text-zinc-500 mt-0.5">
                            ref by: {user.referredBy}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {user.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                        {user.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            Pending (₦200)
                          </span>
                        )}
                        {user.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <ShieldAlert className="w-3 h-3" />
                            Suspended
                          </span>
                        )}
                        {user.status === 'banned' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        )}
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-white text-xs">
                          ₦{user.balance.toLocaleString()}
                        </span>
                      </td>

                      {/* Tasks Done */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-cyan-400 font-bold">
                          {user.tasksDoneCount}
                        </span>
                      </td>

                      {/* Proof / Receipt */}
                      <td className="py-3 px-3">
                        {user.activationProof ? (
                          <button
                            onClick={() => setInspectProofUser(user)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-medium text-[11px] transition border border-zinc-700"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">No proof</span>
                        )}
                      </td>

                      {/* Date Joined */}
                      <td className="py-3 px-3 text-[11px] text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* ADMIT BUTTON */}
                          {user.status === 'pending' && (
                            <button
                              onClick={() => admitUser(user.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] rounded-lg transition shadow-md shadow-emerald-500/20 flex items-center gap-1"
                              title="Admit user for N200 activation"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              ADMIT
                            </button>
                          )}

                          {/* SUSPEND */}
                          {user.status === 'active' && !isSuperAdmin && (
                            <button
                              onClick={() => suspendUser(user.id)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-orange-950/60 text-orange-400 text-[11px] font-semibold rounded-lg transition border border-zinc-700"
                              title="Suspend User"
                            >
                              Suspend
                            </button>
                          )}

                          {/* UNSUSPEND */}
                          {user.status === 'suspended' && (
                            <button
                              onClick={() => reactivateUser(user.id)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-emerald-950/60 text-emerald-400 text-[11px] font-semibold rounded-lg transition border border-zinc-700"
                            >
                              Unsuspend
                            </button>
                          )}

                          {/* BAN */}
                          {user.status !== 'banned' && !isSuperAdmin && (
                            <button
                              onClick={() => banUser(user.id)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-rose-950/60 text-rose-400 text-[11px] font-semibold rounded-lg transition border border-zinc-700"
                              title="Ban User"
                            >
                              Ban
                            </button>
                          )}

                          {/* UNBAN */}
                          {user.status === 'banned' && (
                            <button
                              onClick={() => reactivateUser(user.id)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-emerald-950/60 text-emerald-400 text-[11px] font-semibold rounded-lg transition border border-zinc-700"
                            >
                              Unban
                            </button>
                          )}

                          {/* ADD / REMOVE BALANCE */}
                          <button
                            onClick={() => setSelectedUserForBalance(user)}
                            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            title="Add / Remove Balance"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          </button>

                          {/* VIEW DETAILS */}
                          <button
                            onClick={() => setSelectedUserForDetails(user)}
                            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View User Details */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                User Account Overview
              </h3>
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white">
                  {selectedUserForDetails.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-sm text-white block truncate">
                    {selectedUserForDetails.name}
                  </span>
                  <span className="text-zinc-400 font-mono block truncate">
                    {selectedUserForDetails.email}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Status</span>
                  <span className="font-bold uppercase text-white">
                    {selectedUserForDetails.status}
                  </span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Current Balance</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    ₦{selectedUserForDetails.balance.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Tasks Completed</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">
                    {selectedUserForDetails.tasksDoneCount}
                  </span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Total Earned</span>
                  <span className="font-bold text-white font-mono text-sm">
                    ₦{selectedUserForDetails.totalEarned.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Referral Code:</span>
                  <span className="font-mono text-white font-bold">{selectedUserForDetails.referralCode}</span>
                </div>
                {selectedUserForDetails.referredBy && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Referred By:</span>
                    <span className="font-mono text-purple-300">{selectedUserForDetails.referredBy}</span>
                  </div>
                )}
                {selectedUserForDetails.palmpayNumber && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">PalmPay Number:</span>
                    <span className="font-mono text-white">{selectedUserForDetails.palmpayNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date Joined:</span>
                  <span className="text-zinc-300">{new Date(selectedUserForDetails.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Remove Balance */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Adjust Balance: {selectedUserForBalance.name}
              </h3>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Current Balance:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₦{selectedUserForBalance.balance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="1"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={balanceNote}
                  onChange={(e) => setBalanceNote(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    adjustBalance(selectedUserForBalance.id, balanceAmount, balanceNote);
                    setSelectedUserForBalance(null);
                  }}
                  className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Credit (+₦{balanceAmount})
                </button>
                <button
                  onClick={() => {
                    adjustBalance(selectedUserForBalance.id, -balanceAmount, balanceNote);
                    setSelectedUserForBalance(null);
                  }}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <MinusCircle className="w-4 h-4" />
                  Debit (-₦{balanceAmount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {inspectProofUser && inspectProofUser.activationProof && (
        <ProofModal
          proof={inspectProofUser.activationProof}
          userEmail={inspectProofUser.email}
          userName={inspectProofUser.name}
          onClose={() => setInspectProofUser(null)}
          onApprove={() => approveActivation(inspectProofUser.id)}
          onReject={(reason) => rejectActivation(inspectProofUser.id, reason)}
        />
      )}
    </div>
  );
};
