import type { Token } from '../token/types';

export interface ICTTTokenMirror {
  chainId: string;
  address: string;
}

/**
 * ICTT Token extends the base Token type with cross-chain functionality
 */
export interface ICTTToken extends Token {
  /** Chain ID as string for ICTT compatibility */
  chainId: string;
  /** ICTT-specific home and mirror configuration (optional for manual mode) */
  ictt?: {
    home: string;
    mirrors: ICTTTokenMirror[];
  };
  /** Optional logo URL (maps to Token.image) */
  logoUrl?: string;
}

export interface ICTTTransferParams {
  fromChain: string;
  toChain: string;
  token: ICTTToken;
  amount: string;
  recipientAddress: string;
}

export type ICTTStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ICTTProviderProps {
  children: React.ReactNode;
  initialFromChain?: string;
  initialToChain?: string;
  onStatusChange?: (status: ICTTStatus) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export interface ICTTContextType {
  // Chain selection
  fromChain: string;
  toChain: string;
  setFromChain: (chain: string) => void;
  setToChain: (chain: string) => void;
  swapChains: () => void;
  
  // Token selection
  selectedToken: ICTTToken | null;
  setSelectedToken: (token: ICTTToken | null) => void;
  availableTokens: ICTTToken[];
  
  // Contract addresses for Home mode
  tokenHomeContract: string | null;
  setTokenHomeContract: (contract: string | null) => void;
  tokenRemoteContract: string | null;
  setTokenRemoteContract: (contract: string | null) => void;
  
  // Transfer details
  amount: string;
  setAmount: (amount: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  
  // Chain switching
  isOnCorrectChain: boolean;
  isSwitchingChain: boolean;
  switchToSourceChain: () => Promise<void>;
  
  // Allowance and approval
  allowance: string | null;
  isApproved: boolean;
  isCheckingAllowance: boolean;
  checkAllowance: () => Promise<void>;
  
  // Status and actions
  status: ICTTStatus;
  isApproving: boolean;
  isSending: boolean;
  error: string | null;
  approveToken: () => Promise<void>;
  sendToken: () => Promise<void>;
  
  // Token validation
  areTokensValid: boolean;
  
  // Validation
  isValidForApproval: boolean;
  isValidForSending: boolean;
  validationErrors: string[];
}
