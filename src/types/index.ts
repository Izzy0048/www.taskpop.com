export type UserStatus = 'pending' | 'active' | 'suspended' | 'banned';

export interface ActivationProof {
  id: string;
  senderName: string;
  senderPhone?: string;
  reference: string;
  amount: number;
  imageUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: UserStatus;
  referralCode: string;
  referredBy?: string; // code of referrer
  balance: number; // in Naira (₦)
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
  tasksDoneCount: number;
  createdAt: string;
  palmpayNumber?: string;
  palmpayName?: string;
  activationProof?: ActivationProof;
}

export type ServiceType = 'Follow' | 'Like' | 'Comment' | 'Share' | 'Sub';
export type PlatformType = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'other';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  platform: PlatformType;
  priceEmployerPays: number; // in Naira (₦)
  priceWorkerGets: number;   // in Naira (₦)
  profitMargin: number;      // priceEmployerPays - priceWorkerGets
  minQuantity: number;
  maxQuantity: number;
  description: string;
  iconName?: string;
  active: boolean;
}

export type OrderStatus = 'Pending' | 'Running' | 'Completed' | 'Paused' | 'Cancelled';

export interface Order {
  id: string;
  employerId: string;
  employerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  platform: PlatformType;
  link: string;
  quantity: number;
  completedCount: number;
  costPerUnit: number;
  workerPayPerUnit: number;
  totalCost: number;
  status: OrderStatus;
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface TaskCompletion {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  workerId: string;
  workerEmail: string;
  rewardAmount: number;
  completedAt: string;
  link: string;
  status: 'verified' | 'flagged';
}

export type WithdrawalStatus = 'pending' | 'paid' | 'rejected';

export interface Withdrawal {
  id: string;
  userId: string;
  userEmail: string;
  amountRequested: number;
  fee: number;
  netAmount: number;
  palmpayNumber: string;
  palmpayName: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerEmail: string;
  referredUserId: string;
  referredUserEmail: string;
  referredUserTasksCount: number;
  bonusAmount: number;
  status: 'pending' | 'qualified' | 'paid';
  createdAt: string;
  qualifiedAt?: string;
}

export const PAYMENT_CONFIG = {
  ADMIN_EMAIL: 'ajinugraceranti@gmail.com',
  PALMPAY_NUMBER: '7045465017',
  PALMPAY_NAME: 'Ajinu Grace Ranti',
  ACTIVATION_FEE: 200,    // ₦200
  MIN_WITHDRAWAL: 300,    // ₦300
  WITHDRAWAL_FEE: 50,     // ₦50
  REFERRAL_BONUS: 100,    // ₦100
  REFERRAL_REQUIRED_TASKS: 2,
};
