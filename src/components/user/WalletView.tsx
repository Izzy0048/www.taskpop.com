import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  AlertCircle,
  CreditCard,
  Upload,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

interface WalletViewProps {
  onOpenActivation?: () => void;
}

export const WalletView: React.FC<WalletViewProps> = () => {
  const {
    currentUser,
    withdrawals,
    requestWithdrawal,
    submitActivationProof,
    depositFunds,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'deposit' | 'activation'>('overview');
  const [copiedPalmpay, setCopiedPalmpay] = useState(false);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawPhone, setWithdrawPhone] = useState(currentUser?.palmpayNumber || '');
  const [withdrawName, setWithdrawName] = useState(currentUser?.palmpayName || currentUser?.name || '');
  const [withdrawMsg, setWithdrawMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Activation / Deposit Proof form
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [proofSubmittedSuccess, setProofSubmittedSuccess] = useState(false);

  // Quick Deposit form
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositRef, setDepositRef] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState('');

  const copyPalmpayNumber = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.PALMPAY_NUMBER);
    setCopiedPalmpay(true);
    setTimeout(() => setCopiedPalmpay(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg(null);

    const res = requestWithdrawal(withdrawAmount, withdrawPhone, withdrawName);
    if (res.success) {
      setWithdrawMsg({ text: res.message, success: true });
    } else {
      setWithdrawMsg({ text: res.message, success: false });
    }
  };

  const handleActivationProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!senderName.trim() || !transactionRef.trim()) {
      alert('Please fill in sender name and transaction reference.');
      return;
    }

    submitActivationProof(
      currentUser.id,
      senderName.trim(),
      transactionRef.trim(),
      receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80'
    );
    setProofSubmittedSuccess(true);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!depositRef.trim()) {
      alert('Please enter your PalmPay transfer transaction reference.');
      return;
    }

    depositFunds(depositAmount, depositRef.trim());
    setDepositSuccessMsg(`₦${depositAmount} deposited into your wallet balance!`);
    setDepositRef('');
    setTimeout(() => setDepositSuccessMsg(''), 4000);
  };

  const userWithdrawals = currentUser
    ? withdrawals.filter((w) => w.userId === currentUser.id)
    : [];

  const fee = PAYMENT_CONFIG.WITHDRAWAL_FEE;
  const netWithdraw = Math.max(0, withdrawAmount - fee);

  return (
    <div className="space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Available Wallet Balance</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                ₦{currentUser ? currentUser.balance.toLocaleString() : 0}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Total Earned: ₦{currentUser?.totalEarned.toLocaleString() || 0} | Total Spent: ₦{currentUser?.totalSpent.toLocaleString() || 0}
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('deposit')}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-500/20 flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit Funds</span>
            </button>

            <button
              onClick={() => setActiveTab('withdraw')}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition border border-zinc-700 flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Wallet Overview
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'withdraw'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-emerald-300'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Withdraw to PalmPay (Min ₦{PAYMENT_CONFIG.MIN_WITHDRAWAL})
        </button>

        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'deposit'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-cyan-300'
          }`}
        >
          Deposit Funds
        </button>

        {currentUser?.status === 'pending' && (
          <button
            onClick={() => setActiveTab('activation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'activation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Activate Account (₦{PAYMENT_CONFIG.ACTIVATION_FEE})
          </button>
        )}
      </div>

      {/* Activation Tab Content */}
      {(activeTab === 'activation' || (activeTab === 'overview' && currentUser?.status === 'pending')) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/40 space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Required Step for New Workers
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Unlock Worker Micro-Tasks (₦{PAYMENT_CONFIG.ACTIVATION_FEE} Activation)
              </h3>
              <p className="text-xs text-zinc-300">
                To prevent spam bots and ensure genuine human engagement for TikTok creators, all workers pay a one-time lifetime activation fee of ₦{PAYMENT_CONFIG.ACTIVATION_FEE}.
              </p>
            </div>

            {currentUser?.activationProof?.status === 'pending' ? (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs shrink-0 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Proof Under Review
              </span>
            ) : currentUser?.activationProof?.status === 'approved' ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            ) : null}
          </div>

          {/* Payment Credentials Box */}
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Bank / Network</span>
              <span className="text-sm font-bold text-white">PalmPay</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-cyan-400 font-mono">
                  {PAYMENT_CONFIG.PALMPAY_NUMBER}
                </span>
                <button
                  onClick={copyPalmpayNumber}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  title="Copy PalmPay number"
                >
                  {copiedPalmpay ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Account Name</span>
              <span className="text-sm font-bold text-white truncate block">
                {PAYMENT_CONFIG.PALMPAY_NAME}
              </span>
            </div>
          </div>

          {/* Proof Submission Form */}
          {currentUser?.activationProof?.status === 'pending' ? (
            <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-2xl text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock className="w-4 h-4" />
                <span>Proof submitted & awaiting Admin verification</span>
              </div>
              <p className="text-zinc-300">
                Reference: <strong className="text-white font-mono">{currentUser.activationProof.reference}</strong> | Sender: <strong className="text-white">{currentUser.activationProof.senderName}</strong>
              </p>
              <p className="text-[11px] text-zinc-400">
                Admin checks PalmPay app and approves within minutes. You can also switch to Admin view to instantly admit yourself.
              </p>
            </div>
          ) : (
            <form onSubmit={handleActivationProofSubmit} className="space-y-3 pt-2 text-xs">
              <span className="text-xs font-bold text-white block">
                Submit Your Transfer Receipt Details:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">
                    Your Name on PalmPay App
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Ajinu"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">
                    Transaction Reference / Session ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PALM-TRX-8492049"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  Receipt Screenshot Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (or leave blank to use default verified receipt preview)"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-black font-extrabold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Submit ₦200 Activation Proof</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Withdraw Tab Content */}
      {activeTab === 'withdraw' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 max-w-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Request PalmPay Payout
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Minimum withdrawal is ₦{PAYMENT_CONFIG.MIN_WITHDRAWAL}. Payout fee is ₦{PAYMENT_CONFIG.WITHDRAWAL_FEE}. You receive Requested - ₦50.
            </p>
          </div>

          {withdrawMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold ${
                withdrawMsg.success
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
              }`}
            >
              {withdrawMsg.text}
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Amount to Withdraw (₦)
              </label>
              <input
                type="number"
                min={PAYMENT_CONFIG.MIN_WITHDRAWAL}
                max={currentUser?.balance || 0}
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Available balance: ₦{currentUser?.balance.toLocaleString() || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  PalmPay Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Account Name on PalmPay
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Israel Ajinu"
                  value={withdrawName}
                  onChange={(e) => setWithdrawName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payout Breakdown Card */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Requested Amount:</span>
                <span className="font-mono text-white font-bold">₦{withdrawAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Processing Fee:</span>
                <span className="font-mono text-rose-400 font-bold">-₦{fee}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Net You Receive:</span>
                <span className="font-mono font-black text-emerald-400 text-base">
                  ₦{netWithdraw.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={(currentUser?.balance || 0) < PAYMENT_CONFIG.MIN_WITHDRAWAL}
              className={`w-full py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                (currentUser?.balance || 0) >= PAYMENT_CONFIG.MIN_WITHDRAWAL
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Submit Withdrawal (Receive ₦{netWithdraw.toLocaleString()})</span>
            </button>
          </form>
        </div>
      )}

      {/* Deposit Tab Content */}
      {activeTab === 'deposit' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 max-w-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Fund Wallet via PalmPay
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Deposit funds to launch TikTok followers, likes, comments, and views booster campaigns.
            </p>
          </div>

          {depositSuccessMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs font-semibold">
              {depositSuccessMsg}
            </div>
          )}

          {/* Payment Destination */}
          <div className="p-4 bg-zinc-950 rounded-2xl border border-cyan-800/40 space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              Send PalmPay Transfer To:
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-black text-lg text-white block">
                  {PAYMENT_CONFIG.PALMPAY_NUMBER}
                </span>
                <span className="text-xs text-zinc-400">{PAYMENT_CONFIG.PALMPAY_NAME} (PalmPay)</span>
              </div>
              <button
                onClick={copyPalmpayNumber}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedPalmpay ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Deposit Amount (₦)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                PalmPay Transaction ID / Session Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PALM-DEP-938210"
                value={depositRef}
                onChange={(e) => setDepositRef(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-pink-500/20"
            >
              Confirm Deposit (₦{depositAmount.toLocaleString()})
            </button>
          </form>
        </div>
      )}

      {/* Past Withdrawal History */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Your Recent PalmPay Withdrawals
        </h3>

        {userWithdrawals.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500">
            No withdrawal history yet.
          </div>
        ) : (
          <div className="space-y-2">
            {userWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">#{w.id}</span>
                    <span className="text-zinc-400 font-mono">PalmPay: {w.palmpayNumber}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(w.requestedAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 block">
                    ₦{w.netAmount.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      w.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : w.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {w.status === 'paid' ? 'Paid' : w.status === 'pending' ? 'Pending Payout' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
