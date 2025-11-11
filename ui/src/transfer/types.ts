import type { ReactNode } from 'react';

export type TransferStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';

export type TransferChain = 'P' | 'C' | 'X';

export type TransferError = {
  message: string;
  code?: string | number;
};

export type TransferResult = {
  txHashes: string[];
  fromChain: TransferChain;
  toChain: TransferChain;
  amount: string;
};

export type TransferContextType = {
  /** Current transfer status */
  status: TransferStatus;
  /** Source chain */
  fromChain: TransferChain;
  /** Destination chain */
  toChain: TransferChain;
  /** Transfer amount */
  amount: string;
  /** Destination address */
  toAddress: string;
  /** Current error if any */
  error?: TransferError;
  /** Last successful transfer result */
  result?: TransferResult;
  /** Available chains for transfer */
  availableChains: TransferChain[];
  /** Set the source chain */
  setFromChain: (chain: TransferChain) => void;
  /** Set the destination chain */
  setToChain: (chain: TransferChain) => void;
  /** Set the transfer amount */
  setAmount: (amount: string) => void;
  /** Set the destination address */
  setToAddress: (address: string) => void;
  /** Execute the transfer */
  executeTransfer: () => Promise<void>;
  /** Toggle source and destination chains */
  toggleChains: () => void;
  /** Clear any errors */
  clearError: () => void;
  /** Reset the transfer form */
  reset: () => void;
};

export type TransferProviderProps = {
  children: ReactNode;
  /** Initial source chain */
  initialFromChain?: TransferChain;
  /** Initial destination chain */
  initialToChain?: TransferChain;
  /** Callback when transfer status changes */
  onStatusChange?: (status: TransferStatus) => void;
  /** Callback when an error occurs */
  onError?: (error: TransferError) => void;
  /** Callback when transfer succeeds */
  onSuccess?: (result: TransferResult) => void;
};

export type TransferAmountInputProps = {
  /** Custom class name */
  className?: string;
  /** Input label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Show max button */
  showMax?: boolean;
  /** Disabled state */
  disabled?: boolean;
};

export type TransferChainSelectorProps = {
  /** Custom class name */
  className?: string;
  /** Which chain selector (from or to) */
  type: 'from' | 'to';
  /** Disabled state */
  disabled?: boolean;
};

export type TransferButtonProps = {
  /** Custom class name */
  className?: string;
  /** Custom button text */
  text?: string;
  /** Disabled state */
  disabled?: boolean;
};

export type TransferMessageProps = {
  /** Custom class name */
  className?: string;
  /** Show detailed error messages */
  showDetails?: boolean;
};

export type TransferToastProps = {
  /** Custom class name */
  className?: string;
  /** Auto-hide duration in ms */
  duration?: number;
};

export type TransferToggleButtonProps = {
  /** Custom class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
};
