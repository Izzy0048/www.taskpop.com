import React, { useState } from 'react';
import {
  X,
  Sparkles,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Link as LinkIcon,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
}) => {
  const { currentUser, services, createOrder } = useApp();

  const activeServices = services.filter((s) => s.active);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(activeServices[0]?.id || '');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || activeServices[0];
  const unitPrice = currentService ? currentService.priceEmployerPays : 14;
  const totalCost = quantity * unitPrice;
  const userBalance = currentUser?.balance || 0;
  const hasEnoughBalance = userBalance >= totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('Please log in first.');
      return;
    }

    if (!link.trim()) {
      setErrorMsg('Please enter your TikTok or target video/profile link.');
      return;
    }

    if (quantity < (currentService?.minQuantity || 10)) {
      setErrorMsg(`Minimum quantity for this service is ${currentService?.minQuantity}.`);
      return;
    }

    if (quantity > (currentService?.maxQuantity || 5000)) {
      setErrorMsg(`Maximum quantity for this service is ${currentService?.maxQuantity}.`);
      return;
    }

    if (!hasEnoughBalance) {
      setErrorMsg(`Insufficient wallet balance. You need ₦${totalCost}, but your balance is ₦${userBalance}.`);
      return;
    }

    const res = createOrder(selectedServiceId, link.trim(), quantity);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setLink('');
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Boost Your Social Presence
            </h3>
            <p className="text-xs text-zinc-400">
              Create an SMM booster campaign for TikTok, Instagram, or YouTube
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 font-medium">
              {successMsg}
            </div>
          )}

          {/* Select Service */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">
              1. Select SMM Booster Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              {activeServices.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} — ₦{srv.priceEmployerPays}/unit (Min: {srv.minQuantity})
                </option>
              ))}
            </select>
          </div>

          {/* Service info banner */}
          {currentService && (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <div className="flex justify-between items-center text-white">
                <span className="font-semibold">{currentService.name}</span>
                <span className="font-mono text-cyan-400 font-bold">₦{currentService.priceEmployerPays} per action</span>
              </div>
              <p>{currentService.description}</p>
            </div>
          )}

          {/* Target Link */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Target Link (TikTok video or profile URL)</span>
            </label>
            <input
              type="url"
              required
              placeholder="e.g. https://www.tiktok.com/@youraccount/video/738291..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Ensure your profile or video is public so micro-workers can complete the task.
            </span>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-300 font-semibold">
                3. Quantity Needed
              </label>
              <span className="text-[11px] text-zinc-500">
                Min: {currentService?.minQuantity || 10} | Max: {currentService?.maxQuantity || 5000}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min={currentService?.minQuantity || 10}
                max={currentService?.maxQuantity || 5000}
                step={5}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2 mt-2">
              {[50, 100, 250, 500, 1000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setQuantity(preset)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] font-mono font-semibold"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Live Cost Calculation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Unit Rate:</span>
              <span className="font-mono text-white">₦{unitPrice} each</span>
            </div>
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Quantity:</span>
              <span className="font-mono text-white">{quantity.toLocaleString()} units</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Total Order Cost:</span>
              <span className="text-lg font-black text-pink-400 font-mono">
                ₦{totalCost.toLocaleString()}
              </span>
            </div>

            <div className="pt-1 flex justify-between items-center text-[11px]">
              <span className="text-zinc-400">Your Current Balance:</span>
              <span className={`font-mono font-bold ${hasEnoughBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₦{userBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* If insufficient balance, offer deposit prompt */}
          {!hasEnoughBalance && (
            <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center justify-between text-xs text-rose-300">
              <span>Need ₦{(totalCost - userBalance).toLocaleString()} more to place this order.</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeposit();
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
              >
                Deposit Now
              </button>
            </div>
          )}

          <div className="text-[11px] text-zinc-500 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
            ℹ️ Order goes to Admin as <strong>PENDING</strong>. Once approved, tasks move into the Worker Feed for 100% real human execution!
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!hasEnoughBalance}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                hasEnoughBalance
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Submit Booster Order (₦{totalCost.toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
