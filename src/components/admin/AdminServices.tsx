import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  CheckCircle,
  X,
  Sparkles,
  DollarSign,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Service, ServiceType, PlatformType } from '../../types';

export const AdminServices: React.FC = () => {
  const { services, createService, updateService, deleteService } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<ServiceType>('Follow');
  const [platform, setPlatform] = useState<PlatformType>('tiktok');
  const [priceEmployerPays, setPriceEmployerPays] = useState<number>(15);
  const [priceWorkerGets, setPriceWorkerGets] = useState<number>(8);
  const [minQuantity, setMinQuantity] = useState<number>(20);
  const [maxQuantity, setMaxQuantity] = useState<number>(5000);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  // Live profit calculation
  const calculatedProfit = Math.max(0, priceEmployerPays - priceWorkerGets);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setType('Follow');
    setPlatform('tiktok');
    setPriceEmployerPays(14);
    setPriceWorkerGets(8);
    setMinQuantity(20);
    setMaxQuantity(5000);
    setDescription('High retention real Nigerian active social booster.');
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setType(srv.type);
    setPlatform(srv.platform);
    setPriceEmployerPays(srv.priceEmployerPays);
    setPriceWorkerGets(srv.priceWorkerGets);
    setMinQuantity(srv.minQuantity);
    setMaxQuantity(srv.maxQuantity);
    setDescription(srv.description);
    setActive(srv.active);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        type,
        platform,
        priceEmployerPays,
        priceWorkerGets,
        minQuantity,
        maxQuantity,
        description: description.trim(),
        active,
      });
    } else {
      createService({
        name: name.trim(),
        type,
        platform,
        priceEmployerPays,
        priceWorkerGets,
        minQuantity,
        maxQuantity,
        description: description.trim(),
        active,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Services & Pricing Management
          </h2>
          <p className="text-xs text-zinc-400">
            Define SMM booster catalog, unit pricing, worker payouts, and calculate admin margin spreads.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => {
          const profit = srv.priceEmployerPays - srv.priceWorkerGets;
          const profitPct = Math.round((profit / srv.priceEmployerPays) * 100);

          return (
            <div
              key={srv.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                srv.active
                  ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-xl'
                  : 'bg-zinc-950/60 border-zinc-900 opacity-60'
              }`}
            >
              <div>
                {/* Platform & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {srv.platform}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {srv.type}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      srv.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {srv.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{srv.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Pricing & Profit breakdown */}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Employer Pays:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ₦{srv.priceEmployerPays} / unit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Worker Gets:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    ₦{srv.priceWorkerGets} / unit
                  </span>
                </div>
                <div className="pt-1.5 border-t border-zinc-800 flex justify-between items-center text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Your Profit:
                  </span>
                  <span className="font-mono text-sm">
                    ₦{profit} <span className="text-[10px] text-zinc-400">({profitPct}%)</span>
                  </span>
                </div>
              </div>

              {/* Quantity constraints */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Min: {srv.minQuantity.toLocaleString()}</span>
                <span>Max: {srv.maxQuantity.toLocaleString()}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => updateService(srv.id, { active: !srv.active })}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition"
                >
                  {srv.active ? 'Disable' : 'Enable'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${srv.name}"?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create or Edit Service */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {editingService ? 'Edit Service' : 'Create New SMM Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Service Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TikTok Followers, TikTok Likes, YouTube Subscribers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ServiceType)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Follow">Follow</option>
                    <option value="Like">Like</option>
                    <option value="Comment">Comment</option>
                    <option value="Share">Share</option>
                    <option value="Sub">Sub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as PlatformType)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Profit Engine */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Pricing & Margin Configurator
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">
                      Price Employer Pays (₦)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={priceEmployerPays}
                      onChange={(e) => setPriceEmployerPays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">
                      Price Worker Gets (₦)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={priceWorkerGets}
                      onChange={(e) => setPriceWorkerGets(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Profit Live Box */}
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Your Profit (Difference):</span>
                  </div>
                  <span className="font-mono font-black text-sm text-emerald-400">
                    ₦{calculatedProfit} per unit
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-cyan-500"
                />
                <label htmlFor="activeCheck" className="text-zinc-300 font-medium cursor-pointer">
                  Activate this service immediately for employers & workers
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
