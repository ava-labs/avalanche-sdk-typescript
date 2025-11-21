import type { Token } from '../token/types';

/**
 * Earn provider type (AAVE, Benqi, etc.)
 */
export type EarnProviderType = 'aave' | 'benqi';

/**
 * Pool status
 */
export type PoolStatus = 'active' | 'inactive' | 'deprecated';

/**
 * Earn pool data structure
 */
export interface EarnPool {
  /** Unique pool identifier */
  id: string;
  /** Pool name */
  name: string;
  /** Underlying token */
  token: Token;
  /** Total supply of tokens in the pool */
  totalSupply: string;
  /** Pool status */
  status: PoolStatus;
  /** Provider (AAVE, Benqi, etc.) */
  provider: EarnProviderType;
  /** User's deposited amount */
  userDeposited?: string;
  /** User's pending rewards */
  userRewards?: string;
  /** Pool contract address */
  poolAddress: string;
  /** Reward token */
  rewardToken?: Token;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Earn action type
 */
export type EarnAction = 'deposit' | 'withdraw' | 'claim';

/**
 * Earn status
 */
export type EarnStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Earn provider props
 */
export interface EarnProviderProps {
  children: React.ReactNode;
  /** Initial provider selection */
  initialProvider?: EarnProviderType;
  /** Initial chain ID */
  initialChainId?: string;
  /** Callback when status changes */
  onStatusChange?: (status: EarnStatus) => void;
  /** Callback on successful action */
  onSuccess?: (result: any) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Earn context type
 */
export interface EarnContextType {
  // Provider selection
  provider: EarnProviderType;
  setProvider: (provider: EarnProviderType) => void;
  
  // Chain selection
  chainId: string;
  setChainId: (chainId: string) => void;
  
  // Pool selection
  selectedPool: EarnPool | null;
  setSelectedPool: (pool: EarnPool | null) => void;
  pools: EarnPool[];
  isLoadingPools: boolean;
  refreshPools: () => Promise<void>;
  
  // View mode
  viewMode: 'card' | 'list';
  setViewMode: (mode: 'card' | 'list') => void;
  
  // Action state
  action: EarnAction | null;
  setAction: (action: EarnAction | null) => void;
  
  // Deposit state
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  isDepositing: boolean;
  deposit: () => Promise<void>;
  
  // Approval state
  needsApproval: boolean;
  isApproving: boolean;
  approveToken: () => Promise<void>;
  checkApproval: () => Promise<void>;
  
  // Withdraw state
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  isWithdrawing: boolean;
  withdraw: () => Promise<void>;
  
  // Claim rewards state
  isClaiming: boolean;
  claimRewards: () => Promise<void>;
  
  // Status and errors
  status: EarnStatus;
  error: string | null;
  
  // Validation
  isValidForDeposit: boolean;
  isValidForWithdraw: boolean;
  validationErrors: string[];
  
  // Chain switching
  isOnCorrectChain: boolean;
  isSwitchingChain: boolean;
  switchToChain: () => Promise<void>;
}

