import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    users,
    orders,
    completions,
    withdrawals,
    totalPlatformProfit,
    todayPlatformProfit,
    approveOrder,
    admitUser,
  } = useApp();

  // Calculated Stats (Excluding Admin herself, counting real registered users only)
  const realUsers = users.filter((u) => u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
  const totalUsers = realUsers.length;
  const activeUsers = realUsers.filter((u) => u.status === 'active').length;
  const pendingActivationUsers = realUsers.filter((u) => u.status === 'pending');
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending');

  // Real Profits
  const totalProfit = totalPlatformProfit;
  const todayProfit = todayPlatformProfit;

  // Real Orders per day distribution (Calculated from orders database for past 7 days)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = orders.filter((o) => o.createdAt && o.createdAt.startsWith(dateStr)).length;
    return { dateStr, dayLabel, count, isToday: i === 6 };
  });
  const maxDayCount = Math.max(...past7Days.map((d) => d.count), 1);
  const totalOrdersIn7Days = past7Days.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-indigo-950/60 border border-purple-800/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Flame className="w-6 h-6 text-purple-400 fill-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                TaskPop Admin Control Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configured recipient: <strong className="text-purple-300 font-mono">{PAYMENT_CONFIG.PALMPAY_NUMBER}</strong> ({PAYMENT_CONFIG.PALMPAY_NAME}) | ₦{PAYMENT_CONFIG.ACTIVATION_FEE} Activation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {pendingActivationUsers.length > 0 && (
            <button
              onClick={() => onNavigateTab('users')}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingActivationUsers.length} Pending Activations</span>
            </button>
          )}
          {pendingOrders.length > 0 && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{pendingOrders.length} Orders to Approve</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition relative group">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalUsers}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">{activeUsers} Active</span> | {pendingActivationUsers.length} Pending
          </div>
        </div>

        {/* Active Workers */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Active Workers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{activeUsers}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Paid ₦{PAYMENT_CONFIG.ACTIVATION_FEE} activation fee
          </div>
        </div>

        {/* Pending Activation */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 hover:border-amber-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Pending Activation</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {pendingActivationUsers.length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-0.5">
            <span>Awaiting receipt review</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalOrders}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span>{completions.length} tasks done by workers</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 hover:border-cyan-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-medium">Pending Orders</span>
            <AlertCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-0.5">
            <span>Needs approval to run</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Total Platform Profit */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-800/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Profit</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₦{totalProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            (Admitted × ₦200) + (Withdrawals × ₦50) + Margins
          </div>
        </div>

        {/* Today's Profit */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 transition col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Today's Profit</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            ₦{todayProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/70 mt-1">
            Real-time daily admissions, withdrawal fees & order margins
          </div>
        </div>
      </div>

      {/* Orders per Day Chart & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Orders Per Day Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Orders Volume Per Day
              </h3>
              <p className="text-xs text-zinc-400">Past 7 days micro-task booster demand</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-800 rounded-lg text-zinc-300 font-mono">
              {totalOrdersIn7Days} orders in 7 days
            </span>
          </div>

          {/* Bar Chart Graphic */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {past7Days.map((item) => {
                const heightPct = item.count === 0 ? 0 : Math.max(8, Math.round((item.count / maxDayCount) * 100));

                return (
                  <div key={item.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip on hover */}
                    <span className="text-[10px] text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition -mb-1">
                      {item.count} orders
                    </span>
                    <div className="w-full bg-zinc-800/80 rounded-t-lg overflow-hidden flex items-end h-full max-h-[140px]">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          item.count === 0
                            ? 'bg-zinc-800/40 h-1'
                            : item.isToday
                            ? 'bg-gradient-to-t from-pink-500 to-cyan-400 shadow-lg shadow-cyan-500/20'
                            : 'bg-gradient-to-t from-purple-800 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[11px] font-medium ${item.isToday ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}>
                      {item.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Past Days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-pink-500 to-cyan-400" /> Today
              </span>
            </div>
            <span className="text-[11px] text-zinc-500">Live order database — Zero demo numbers</span>
          </div>
        </div>

        {/* Quick Pending Review Panel */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-400" />
              Immediate Admin Actions
            </h3>
            <p className="text-xs text-zinc-400">Items requiring your 1-click verification</p>

            <div className="mt-4 space-y-3">
              {/* Pending Activation items */}
              {pendingActivationUsers.slice(0, 2).map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-amber-900/30 flex items-center justify-between gap-2"
                >
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-white block truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block truncate font-mono">
                      {user.email}
                    </span>
                    <span className="text-[10px] text-amber-400 block font-semibold mt-0.5">
                      ₦200 PalmPay Proof Uploaded
                    </span>
                  </div>
                  <button
                    onClick={() => admitUser(user.id)}
                    className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold rounded-lg transition shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Admit
                  </button>
                </div>
              ))}

              {/* Pending Orders */}
              {pendingOrders.slice(0, 2).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-cyan-900/30 flex items-center justify-between gap-2"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {ord.serviceName}
                      </span>
                      <span className="text-[9px] px-1 bg-cyan-950 text-cyan-300 rounded font-mono">
                        x{ord.quantity}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate font-mono">
                      By {ord.employerEmail}
                    </span>
                  </div>
                  <button
                    onClick={() => approveOrder(ord.id)}
                    className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold rounded-lg transition shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Approve
                  </button>
                </div>
              ))}

              {pendingActivationUsers.length === 0 && pendingOrders.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-400 bg-zinc-950 rounded-xl border border-zinc-800">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                  All caught up! No pending admissions or orders.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Pending Withdrawals:</span>
            <button
              onClick={() => onNavigateTab('withdrawals')}
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              {withdrawals.filter((w) => w.status === 'pending').length} to pay
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
