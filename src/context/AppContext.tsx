import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Service,
  Order,
  TaskCompletion,
  Withdrawal,
  ReferralRecord,
  PAYMENT_CONFIG,
  ActivationProof,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_COMPLETIONS,
  INITIAL_WITHDRAWALS,
  INITIAL_REFERRALS,
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  services: Service[];
  orders: Order[];
  completions: TaskCompletion[];
  withdrawals: Withdrawal[];
  referrals: ReferralRecord[];
  isAdmin: boolean;
  activeView: 'user' | 'admin';
  setActiveView: (view: 'user' | 'admin') => void;
  // Computed Real Profit: (Admitted Users * 200) + (Paid Withdrawals * 50) + (Order Margins)
  totalPlatformProfit: number;
  todayPlatformProfit: number;
  // Auth
  login: (email: string) => boolean;
  signup: (email: string, name: string, palmpayNumber?: string, referralCode?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  // User & Activation Admin actions
  admitUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  banUser: (userId: string) => void;
  reactivateUser: (userId: string) => void;
  adjustBalance: (userId: string, amount: number, note: string) => void;
  submitActivationProof: (userId: string, senderName: string, reference: string, imageUrl: string) => void;
  approveActivation: (userId: string) => void;
  rejectActivation: (userId: string, reason: string) => void;
  // Services
  createService: (data: Omit<Service, 'id' | 'profitMargin'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  // Orders
  createOrder: (serviceId: string, link: string, quantity: number) => { success: boolean; message: string };
  approveOrder: (orderId: string) => void;
  pauseOrder: (orderId: string) => void;
  resumeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  // Worker Task
  completeTask: (orderId: string) => { success: boolean; message: string; earned?: number };
  hasCompletedTask: (orderId: string, userId?: string) => boolean;
  // Wallet & Withdrawals
  requestWithdrawal: (amount: number, palmpayNumber: string, palmpayName: string) => { success: boolean; message: string };
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;
  depositFunds: (amount: number, reference: string) => void;
  // Misc
  resetToDefaults: () => void;
  triggerConfetti: () => void;
}

// Clean storage keys for real data
const STORAGE_KEYS = {
  CURRENT_USER_ID: 'taskpop_current_user_id_v2',
  USERS: 'taskpop_users_clean_v2',
  SERVICES: 'taskpop_services_clean_v2',
  ORDERS: 'taskpop_orders_clean_v2',
  COMPLETIONS: 'taskpop_completions_clean_v2',
  WITHDRAWALS: 'taskpop_withdrawals_clean_v2',
  REFERRALS: 'taskpop_referrals_clean_v2',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-admin';
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [completions, setCompletions] = useState<TaskCompletion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLETIONS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [activeView, setActiveView] = useState<'user' | 'admin'>('admin');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAdmin = currentUser?.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase();

  // If user is not admin and is on admin view, fallback to user view
  useEffect(() => {
    if (!isAdmin && activeView === 'admin') {
      setActiveView('user');
    }
  }, [isAdmin, activeView]);

  // Clean up any legacy mock data from older versions in browser localStorage
  useEffect(() => {
    try {
      const legacyKeys = [
        'taskpop_users',
        'taskpop_orders',
        'taskpop_completions',
        'taskpop_withdrawals',
        'taskpop_referrals',
        'taskpop_current_user_id',
        'taskpop_users_clean_v2',
        'taskpop_orders_clean_v2',
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }, []);

  /* -------------------------------------------------------------
   * REAL PROFIT CALCULATION (Per User Specification):
   * Total Profit = (Number of Admitted Users x ₦200)
   *              + (Total Withdrawal Fees x ₦50)
   *              + (Order margins: (Employer price - Worker price) x quantity)
   *
   * Rules:
   * 1. Starts strictly at ₦0 if database has no admitted users, paid withdrawals or approved orders.
   * 2. Increases by ₦200 when Admin clicks ADMIT on a user.
   * 3. Increases by ₦50 when Admin approves a withdrawal.
   * 4. Increases by (Employer price - Worker price) x quantity for approved/active orders.
   * ------------------------------------------------------------- */
  // 1. Number of Admitted Users x ₦200 (real registered workers with active status)
  const admittedWorkersCount = users.filter(
    (u) => u.status === 'active' && u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()
  ).length;
  const admissionProfit = admittedWorkersCount * PAYMENT_CONFIG.ACTIVATION_FEE; // ₦200 each

  // 2. Total Withdrawal Fees x ₦50 (real approved/paid withdrawals)
  const paidWithdrawalsCount = withdrawals.filter((w) => w.status === 'paid').length;
  const withdrawalFeeProfit = paidWithdrawalsCount * PAYMENT_CONFIG.WITHDRAWAL_FEE; // ₦50 each

  // 3. Order margins: (Employer price - Worker price) x quantity for approved / running / completed orders
  const orderMarginProfit = orders.reduce((acc, o) => {
    // If order was cancelled, only count completed units before cancellation
    if (o.status === 'Cancelled') {
      const marginPerUnit = Math.max(0, o.costPerUnit - o.workerPayPerUnit);
      return acc + (marginPerUnit * (o.completedCount || 0));
    }
    // If order is Running, Completed, or Paused, margin is locked from employer order budget
    if (o.status === 'Running' || o.status === 'Completed' || o.status === 'Paused') {
      const marginPerUnit = Math.max(0, o.costPerUnit - o.workerPayPerUnit);
      return acc + (marginPerUnit * o.quantity);
    }
    return acc;
  }, 0);

  // Total Real Platform Profit (starts at ₦0 if database is empty)
  const totalPlatformProfit = admissionProfit + withdrawalFeeProfit + orderMarginProfit;

  // Today's real profit calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAdmittedWorkers = users.filter(
    (u) =>
      u.status === 'active' &&
      u.email.toLowerCase() !== PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase() &&
      u.createdAt.startsWith(todayStr)
  ).length;
  const todayWithdrawalFees = withdrawals.filter(
    (w) => w.status === 'paid' && (w.processedAt?.startsWith(todayStr) || w.requestedAt.startsWith(todayStr))
  ).length * PAYMENT_CONFIG.WITHDRAWAL_FEE;
  const todayOrders = orders.filter(
    (o) =>
      o.createdAt.startsWith(todayStr) &&
      (o.status === 'Running' || o.status === 'Completed' || o.status === 'Paused')
  );
  const todayOrderMargins = todayOrders.reduce((acc, o) => {
    const marginPerUnit = Math.max(0, o.costPerUnit - o.workerPayPerUnit);
    return acc + (marginPerUnit * o.quantity);
  }, 0);

  const todayPlatformProfit =
    (todayAdmittedWorkers * PAYMENT_CONFIG.ACTIVATION_FEE) +
    todayWithdrawalFees +
    todayOrderMargins;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const login = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      if (user.status === 'banned') {
        alert('This account has been banned. Please contact admin.');
        return false;
      }
      setCurrentUserId(user.id);
      if (user.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()) {
        setActiveView('admin');
      } else {
        setActiveView('user');
      }
      return true;
    }
    return false;
  };

  const signup = (email: string, name: string, palmpayNumber?: string, referralCode?: string): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      alert('An account with this email already exists.');
      return false;
    }

    const newCode = 'TP-' + Math.floor(10000 + Math.random() * 90000);
    const trimmedReferral = referralCode?.trim();
    const referrer = trimmedReferral ? users.find((u) => u.referralCode.toLowerCase() === trimmedReferral.toLowerCase()) : undefined;

    const newUser: User = {
      id: 'user-' + Date.now(),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: 'user',
      status: 'pending', // Starts at pending until ₦200 activation
      referralCode: newCode,
      referredBy: referrer?.referralCode,
      balance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalSpent: 0,
      tasksDoneCount: 0,
      createdAt: new Date().toISOString(),
      palmpayNumber: palmpayNumber?.trim() || '',
      palmpayName: name.trim(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setActiveView('user');

    if (referrer) {
      const newRefRecord: ReferralRecord = {
        id: 'ref-' + Date.now(),
        referrerId: referrer.id,
        referrerEmail: referrer.email,
        referredUserId: newUser.id,
        referredUserEmail: newUser.email,
        referredUserTasksCount: 0,
        bonusAmount: PAYMENT_CONFIG.REFERRAL_BONUS,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setReferrals((prev) => [newRefRecord, ...prev]);
    }

    return true;
  };

  const logout = () => {
    const adminUser = users.find((u) => u.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase());
    if (adminUser) {
      setCurrentUserId(adminUser.id);
    }
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      if (user.email.toLowerCase() === PAYMENT_CONFIG.ADMIN_EMAIL.toLowerCase()) {
        setActiveView('admin');
      } else {
        setActiveView('user');
      }
    }
  };

  // User Administration
  const admitUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedProof: ActivationProof | undefined = u.activationProof
            ? { ...u.activationProof, status: 'approved' }
            : undefined;
          return {
            ...u,
            status: 'active',
            activationProof: updatedProof,
          };
        }
        return u;
      })
    );
    triggerConfetti();
  };

  const suspendUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' } : u)));
  };

  const banUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u)));
  };

  const reactivateUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u)));
  };

  const adjustBalance = (userId: string, amount: number, _note: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBal = Math.max(0, u.balance + amount);
          return { ...u, balance: newBal };
        }
        return u;
      })
    );
  };

  const submitActivationProof = (
    userId: string,
    senderName: string,
    reference: string,
    imageUrl: string
  ) => {
    const proof: ActivationProof = {
      id: 'proof-' + Date.now(),
      senderName,
      reference,
      amount: PAYMENT_CONFIG.ACTIVATION_FEE,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            activationProof: proof,
          };
        }
        return u;
      })
    );
  };

  const approveActivation = (userId: string) => {
    admitUser(userId);
  };

  const rejectActivation = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId && u.activationProof) {
          return {
            ...u,
            activationProof: {
              ...u.activationProof,
              status: 'rejected',
              rejectReason: reason,
            },
          };
        }
        return u;
      })
    );
  };

  // Services Management
  const createService = (data: Omit<Service, 'id' | 'profitMargin'>) => {
    const profitMargin = data.priceEmployerPays - data.priceWorkerGets;
    const newService: Service = {
      ...data,
      id: 'srv-' + Date.now(),
      profitMargin,
    };
    setServices((prev) => [newService, ...prev]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id === id) {
          const updated = { ...srv, ...data };
          updated.profitMargin = updated.priceEmployerPays - updated.priceWorkerGets;
          return updated;
        }
        return srv;
      })
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Order Management
  const createOrder = (serviceId: string, link: string, quantity: number) => {
    if (!currentUser) return { success: false, message: 'Please log in to place an order.' };
    const service = services.find((s) => s.id === serviceId);
    if (!service) return { success: false, message: 'Selected service does not exist.' };
    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return {
        success: false,
        message: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}`,
      };
    }

    const totalCost = quantity * service.priceEmployerPays;
    if (currentUser.balance < totalCost) {
      return {
        success: false,
        message: `Insufficient balance (₦${currentUser.balance}). Total cost is ₦${totalCost}. Please fund your wallet.`,
      };
    }

    // Deduct employer balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balance: u.balance - totalCost,
            totalSpent: u.totalSpent + totalCost,
          };
        }
        return u;
      })
    );

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      employerId: currentUser.id,
      employerEmail: currentUser.email,
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      platform: service.platform,
      link: link.trim(),
      quantity,
      completedCount: 0,
      costPerUnit: service.priceEmployerPays,
      workerPayPerUnit: service.priceWorkerGets,
      totalCost,
      status: 'Pending', // Sent to admin as PENDING
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return {
      success: true,
      message: `Order #${newOrder.id} submitted successfully! It is now PENDING admin approval.`,
    };
  };

  const approveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Running', approvedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const pauseOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Paused' } : o)));
  };

  const resumeOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Running' } : o)));
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const remainingUnits = Math.max(0, order.quantity - order.completedCount);
    const refundAmount = remainingUnits * order.costPerUnit;

    // Refund employer
    if (refundAmount > 0) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === order.employerId) {
            return {
              ...u,
              balance: u.balance + refundAmount,
              totalSpent: Math.max(0, u.totalSpent - refundAmount),
            };
          }
          return u;
        })
      );
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o)));
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Completed' } : o)));
  };

  // Task Completion by Worker
  const hasCompletedTask = (orderId: string, userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return false;
    return completions.some((c) => c.orderId === orderId && c.workerId === targetUserId);
  };

  const completeTask = (orderId: string) => {
    if (!currentUser) return { success: false, message: 'Please log in to complete tasks.' };
    if (currentUser.status !== 'active') {
      return {
        success: false,
        message: 'Account not active. Pay ₦200 activation fee to start doing tasks.',
      };
    }

    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };
    if (order.status !== 'Running') {
      return { success: false, message: 'This task is not currently running.' };
    }
    if (order.completedCount >= order.quantity) {
      return { success: false, message: 'All slots for this task have already been filled!' };
    }
    if (hasCompletedTask(orderId, currentUser.id)) {
      return { success: false, message: 'You have already completed this task!' };
    }

    const reward = order.workerPayPerUnit;
    const newCompletedCount = order.completedCount + 1;
    const isNowCompleted = newCompletedCount >= order.quantity;

    // Update order progress
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            completedCount: newCompletedCount,
            status: isNowCompleted ? 'Completed' : 'Running',
          };
        }
        return o;
      })
    );

    // Record completion
    const newCompletion: TaskCompletion = {
      id: 'cmp-' + Date.now(),
      orderId,
      serviceId: order.serviceId,
      serviceName: order.serviceName,
      workerId: currentUser.id,
      workerEmail: currentUser.email,
      rewardAmount: reward,
      completedAt: new Date().toISOString(),
      link: order.link,
      status: 'verified',
    };
    setCompletions((prev) => [newCompletion, ...prev]);

    // Update worker stats and check referral trigger
    const updatedTasksDone = currentUser.tasksDoneCount + 1;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balance: u.balance + reward,
            totalEarned: u.totalEarned + reward,
            tasksDoneCount: updatedTasksDone,
          };
        }
        return u;
      })
    );

    // Referral Rule: Referral bonus ₦100 after referred user completes 2 approved tasks
    if (currentUser.referredBy && updatedTasksDone === PAYMENT_CONFIG.REFERRAL_REQUIRED_TASKS) {
      const referrerUser = users.find(
        (u) => u.referralCode.toLowerCase() === currentUser.referredBy?.toLowerCase()
      );
      if (referrerUser) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === referrerUser.id) {
              return {
                ...u,
                balance: u.balance + PAYMENT_CONFIG.REFERRAL_BONUS,
                totalEarned: u.totalEarned + PAYMENT_CONFIG.REFERRAL_BONUS,
              };
            }
            return u;
          })
        );

        setReferrals((prev) =>
          prev.map((r) => {
            if (r.referredUserId === currentUser.id) {
              return {
                ...r,
                referredUserTasksCount: updatedTasksDone,
                status: 'paid',
                qualifiedAt: new Date().toISOString(),
              };
            }
            return r;
          })
        );
      }
    } else if (currentUser.referredBy) {
      setReferrals((prev) =>
        prev.map((r) => {
          if (r.referredUserId === currentUser.id) {
            return {
              ...r,
              referredUserTasksCount: updatedTasksDone,
            };
          }
          return r;
        })
      );
    }

    triggerConfetti();
    return {
      success: true,
      message: `Task completed! ₦${reward} credited to your wallet balance.`,
      earned: reward,
    };
  };

  // Wallet & Withdrawals
  const requestWithdrawal = (amount: number, palmpayNumber: string, palmpayName: string) => {
    if (!currentUser) return { success: false, message: 'Please log in.' };
    if (amount < PAYMENT_CONFIG.MIN_WITHDRAWAL) {
      return {
        success: false,
        message: `Minimum withdrawal amount is ₦${PAYMENT_CONFIG.MIN_WITHDRAWAL}.`,
      };
    }
    if (currentUser.balance < amount) {
      return {
        success: false,
        message: `Insufficient balance (₦${currentUser.balance}) for withdrawal request.`,
      };
    }
    if (!palmpayNumber.trim()) {
      return { success: false, message: 'Please provide a valid PalmPay phone number.' };
    }

    const fee = PAYMENT_CONFIG.WITHDRAWAL_FEE;
    const netAmount = amount - fee;

    // Deduct user balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balance: u.balance - amount,
            palmpayNumber: palmpayNumber.trim(),
            palmpayName: palmpayName.trim() || u.name,
          };
        }
        return u;
      })
    );

    const withdrawal: Withdrawal = {
      id: 'WTH-' + Math.floor(100 + Math.random() * 900),
      userId: currentUser.id,
      userEmail: currentUser.email,
      amountRequested: amount,
      fee,
      netAmount,
      palmpayNumber: palmpayNumber.trim(),
      palmpayName: palmpayName.trim() || currentUser.name,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [withdrawal, ...prev]);
    return {
      success: true,
      message: `Withdrawal request for ₦${amount} submitted! (Fee: ₦${fee} | Payout: ₦${netAmount} to ${palmpayNumber})`,
    };
  };

  const approveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? { ...w, status: 'paid', processedAt: new Date().toISOString() }
          : w
      )
    );
    triggerConfetti();
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const w = withdrawals.find((x) => x.id === withdrawalId);
    if (!w) return;

    // Refund amount back to user
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === w.userId) {
          return {
            ...u,
            balance: u.balance + w.amountRequested,
          };
        }
        return u;
      })
    );

    setWithdrawals((prev) =>
      prev.map((item) =>
        item.id === withdrawalId
          ? {
              ...item,
              status: 'rejected',
              processedAt: new Date().toISOString(),
              adminNote: reason,
            }
          : item
      )
    );
  };

  const depositFunds = (amount: number, _reference: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balance: u.balance + amount,
          };
        }
        return u;
      })
    );
    triggerConfetti();
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('user-admin');
    setServices(INITIAL_SERVICES);
    setOrders(INITIAL_ORDERS);
    setCompletions(INITIAL_COMPLETIONS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setReferrals(INITIAL_REFERRALS);
    setActiveView('admin');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        services,
        orders,
        completions,
        withdrawals,
        referrals,
        isAdmin,
        activeView,
        setActiveView,
        totalPlatformProfit,
        todayPlatformProfit,
        login,
        signup,
        logout,
        switchUser,
        admitUser,
        suspendUser,
        banUser,
        reactivateUser,
        adjustBalance,
        submitActivationProof,
        approveActivation,
        rejectActivation,
        createService,
        updateService,
        deleteService,
        createOrder,
        approveOrder,
        pauseOrder,
        resumeOrder,
        cancelOrder,
        completeOrder,
        completeTask,
        hasCompletedTask,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        depositFunds,
        resetToDefaults,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
