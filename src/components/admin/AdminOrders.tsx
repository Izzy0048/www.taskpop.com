import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle,
  Play,
  Pause,
  XCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  Users,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    completions,
    approveOrder,
    pauseOrder,
    resumeOrder,
    cancelOrder,
    completeOrder,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForWorkers, setSelectedOrderForWorkers] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.employerEmail.toLowerCase().includes(q) ||
      o.serviceName.toLowerCase().includes(q) ||
      o.link.toLowerCase().includes(q)
    );
  });

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const runningCount = orders.filter((o) => o.status === 'Running').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  const orderCompletions = selectedOrderForWorkers
    ? completions.filter((c) => c.orderId === selectedOrderForWorkers.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            Order Management (TikTok Booster Pipeline)
          </h2>
          <p className="text-xs text-zinc-400">
            Incoming orders require Admin approval before slots appear on the Worker Feed.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, link, employer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filterStatus === 'all'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setFilterStatus('Pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            filterStatus === 'Pending'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-cyan-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Pending Approval ({pendingCount})
        </button>

        <button
          onClick={() => setFilterStatus('Running')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            filterStatus === 'Running'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-emerald-300'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          Running ({runningCount})
        </button>

        <button
          onClick={() => setFilterStatus('Completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filterStatus === 'Completed'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-zinc-400 hover:text-purple-300'
          }`}
        >
          Completed ({completedCount})
        </button>

        <button
          onClick={() => setFilterStatus('Paused')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filterStatus === 'Paused'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Paused
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-3">Employer</th>
                <th className="py-3.5 px-3">Service</th>
                <th className="py-3.5 px-3">Target Link</th>
                <th className="py-3.5 px-3">Quantity</th>
                <th className="py-3.5 px-3">Progress (Done)</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const progressPct = Math.min(
                    100,
                    Math.round((ord.completedCount / ord.quantity) * 100)
                  );

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-zinc-800/30 transition text-zinc-300"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white text-xs block">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Employer */}
                      <td className="py-3.5 px-3">
                        <span className="text-zinc-200 font-medium block truncate max-w-[140px]">
                          {ord.employerEmail}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Paid: ₦{ord.totalCost}
                        </span>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-bold text-[10px] text-zinc-300 uppercase">
                            {ord.platform}
                          </span>
                          <span className="font-semibold text-white truncate max-w-[130px]">
                            {ord.serviceName}
                          </span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          Worker Pay: ₦{ord.workerPayPerUnit}
                        </span>
                      </td>

                      {/* Target Link */}
                      <td className="py-3.5 px-3">
                        <a
                          href={ord.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] truncate max-w-[150px] hover:underline"
                        >
                          <span className="truncate">{ord.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {ord.quantity.toLocaleString()}
                      </td>

                      {/* Progress (Done) */}
                      <td className="py-3.5 px-3 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-cyan-400">
                            {ord.completedCount}
                          </span>
                          <span className="text-zinc-500">/ {ord.quantity}</span>
                          <span className="text-zinc-400 text-[10px]">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPct >= 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-pink-500 to-cyan-400'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {ord.status === 'Pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1 w-fit">
                            <Clock className="w-2.5 h-2.5" />
                            Pending
                          </span>
                        )}
                        {ord.status === 'Running' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                            <Play className="w-2.5 h-2.5" />
                            Running
                          </span>
                        )}
                        {ord.status === 'Completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Completed
                          </span>
                        )}
                        {ord.status === 'Paused' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                            <Pause className="w-2.5 h-2.5" />
                            Paused
                          </span>
                        )}
                        {ord.status === 'Cancelled' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 flex items-center gap-1 w-fit">
                            <XCircle className="w-2.5 h-2.5" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Approve (moves to worker feed) */}
                          {ord.status === 'Pending' && (
                            <button
                              onClick={() => approveOrder(ord.id)}
                              className="px-2.5 py-1 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-extrabold text-[11px] rounded-lg transition shadow-md shadow-cyan-500/20 flex items-center gap-1"
                              title="Approve Order to push to Worker Feed"
                            >
                              <Play className="w-3 h-3 fill-black" />
                              Approve
                            </button>
                          )}

                          {/* Pause */}
                          {ord.status === 'Running' && (
                            <button
                              onClick={() => pauseOrder(ord.id)}
                              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg transition border border-zinc-700"
                              title="Pause task delivery"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Resume */}
                          {ord.status === 'Paused' && (
                            <button
                              onClick={() => resumeOrder(ord.id)}
                              className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded-lg transition border border-emerald-500/30"
                              title="Resume order"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Mark Completed */}
                          {ord.status === 'Running' && (
                            <button
                              onClick={() => completeOrder(ord.id)}
                              className="p-1.5 bg-zinc-800 hover:bg-emerald-950/60 text-emerald-400 rounded-lg transition border border-zinc-700"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancel with Refund */}
                          {(ord.status === 'Pending' || ord.status === 'Running' || ord.status === 'Paused') && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Cancel order #${ord.id}? Remaining uncompleted slots will be refunded back to employer.`
                                  )
                                ) {
                                  cancelOrder(ord.id);
                                }
                              }}
                              className="p-1.5 bg-zinc-800 hover:bg-rose-950/60 text-rose-400 rounded-lg transition border border-zinc-700"
                              title="Cancel & Refund employer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* View Workers who did this task */}
                          <button
                            onClick={() => setSelectedOrderForWorkers(ord)}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition"
                            title="View Worker Completions"
                          >
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
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

      {/* Modal: View Worker Completions */}
      {selectedOrderForWorkers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Worker Completions for Order #{selectedOrderForWorkers.id}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedOrderForWorkers.serviceName} ({selectedOrderForWorkers.completedCount} / {selectedOrderForWorkers.quantity} completed)
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForWorkers(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs flex justify-between items-center">
              <div>
                <span className="text-zinc-400 block">Target Link:</span>
                <a
                  href={selectedOrderForWorkers.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate max-w-xs"
                >
                  {selectedOrderForWorkers.link}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <span className="font-mono text-emerald-400 font-bold">
                ₦{selectedOrderForWorkers.workerPayPerUnit} per completion
              </span>
            </div>

            <div className="overflow-y-auto max-h-60 space-y-2">
              {orderCompletions.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs">
                  No workers have submitted completions yet.
                </div>
              ) : (
                orderCompletions.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-white font-semibold block">{comp.workerEmail}</span>
                      <span className="text-zinc-500 text-[10px]">
                        Done at: {new Date(comp.completedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold block">
                        +₦{comp.rewardAmount}
                      </span>
                      <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderForWorkers(null)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
