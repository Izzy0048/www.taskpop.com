import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { ActivationProof, PAYMENT_CONFIG } from '../../types';

interface ProofModalProps {
  proof: ActivationProof | null;
  userEmail: string;
  userName: string;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  proof,
  userEmail,
  userName,
  onClose,
  onApprove,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  if (!proof) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              PalmPay Payment Proof (₦{proof.amount})
            </h3>
            <p className="text-xs text-zinc-400">
              User: <span className="text-zinc-200 font-medium">{userName}</span> ({userEmail})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Target Account Info */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
            <span className="font-semibold block text-emerald-200 mb-0.5">Required Payment Destination:</span>
            PalmPay: <strong className="text-white tracking-wider">{PAYMENT_CONFIG.PALMPAY_NUMBER}</strong> ({PAYMENT_CONFIG.PALMPAY_NAME})
          </div>

          {/* Submitted details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Sender Name</span>
              <span className="text-white font-semibold text-sm">{proof.senderName || 'Not specified'}</span>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Transaction Ref</span>
              <span className="text-cyan-400 font-mono font-medium">{proof.reference || 'N/A'}</span>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Amount Sent</span>
              <span className="text-emerald-400 font-bold text-sm">₦{proof.amount}</span>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block mb-1">Submitted Date</span>
              <span className="text-zinc-300">{new Date(proof.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Receipt Image */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Receipt Screenshot Preview:</span>
              <a
                href={proof.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Open full <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative rounded-xl border border-zinc-800 bg-black overflow-hidden group flex items-center justify-center min-h-[220px] max-h-[320px]">
              <img
                src={proof.imageUrl}
                alt="PalmPay Receipt"
                className="w-full h-full object-contain max-h-[320px] rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-zinc-300 flex items-center justify-between">
                <span>Receipt for ₦{proof.amount} to {PAYMENT_CONFIG.PALMPAY_NAME}</span>
                <span className="text-emerald-400 font-mono">Ref: {proof.reference}</span>
              </div>
            </div>
          </div>

          {proof.status === 'rejected' && proof.rejectReason && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Previously rejected: {proof.rejectReason}</span>
            </div>
          )}

          {/* Reject Input */}
          {showRejectInput && (
            <div className="space-y-2 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl">
              <label className="text-xs text-rose-300 font-medium">State reason for rejection:</label>
              <input
                type="text"
                placeholder="e.g. Reference code not found on PalmPay app"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
          >
            Close
          </button>

          {onApprove && onReject && proof.status === 'pending' && (
            <div className="flex items-center gap-2">
              {!showRejectInput ? (
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-800/50 rounded-xl transition"
                >
                  Reject Proof
                </button>
              ) : (
                <button
                  onClick={() => {
                    onReject(rejectReason || 'Invalid proof details');
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition"
                >
                  Confirm Reject
                </button>
              )}

              <button
                onClick={() => {
                  onApprove();
                  onClose();
                }}
                className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Approve & Activate (₦200)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
