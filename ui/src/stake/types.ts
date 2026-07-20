import type { ReactNode } from 'react';

export type StakeStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';

export type StakeError = {
  message: string;
  code?: string | number;
};

export type StakeResult = {
  txHash: string;
  nodeId: string;
  stakeAmount: string;
  endTime: number;
};

export type ValidatorCredentials = {
  nodeID: string;
  nodePOP: {
    publicKey: string;
    proofOfPossession: string;
  };
};

export type NetworkConfig = {
  minStakeAvax: number;
  minEndSeconds: number;
  defaultDays: number;
  presets: Array<{ label: string; days: number }>;
};

export type StakeContextType = {
  /** Current stake status */
  status: StakeStatus;
  /** Validator credentials */
  validator: ValidatorCredentials | null;
  /** Stake amount in AVAX */
  stakeAmount: string;
  /** End time as ISO string */
  endTime: string;
  /** Delegator reward percentage */
  delegatorRewardPercentage: string;
  /** Current error if any */
  error?: StakeError;
  /** Last successful stake result */
  result?: StakeResult;
  /** Network configuration */
  networkConfig: NetworkConfig;
  /** Whether on testnet */
  isTestnet: boolean;
  /** Whether all form inputs are valid */
  isFormValid: boolean;
  /** Set validator credentials */
  setValidator: (validator: ValidatorCredentials | null) => void;
  /** Set stake amount */
  setStakeAmount: (amount: string) => void;
  /** Set end time */
  setEndTime: (endTime: string) => void;
  /** Set delegator reward percentage */
  setDelegatorRewardPercentage: (percentage: string) => void;
  /** Set end time in days from now */
  setEndInDays: (days: number) => void;
  /** Submit stake transaction */
  submitStake: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
  /** Reset form */
  reset: () => void;
};

export type StakeProviderProps = {
  children: ReactNode;
  /** Callback when stake is successful */
  onSuccess?: (result: StakeResult) => void;
  /** Callback when stake fails */
  onError?: (error: StakeError) => void;
  /** Custom network configuration */
  networkConfig?: Partial<NetworkConfig>;
};

export type StakeValidatorInputProps = {
  className?: string;
  label?: string;
  disabled?: boolean;
  /** Default input mode */
  defaultMode?: 'fetch' | 'manual';
  /** Whether to allow manual entry mode */
  allowManualEntry?: boolean;
};

export type StakeAmountInputProps = {
  className?: string;
  label?: string;
  disabled?: boolean;
};

export type StakeDurationInputProps = {
  className?: string;
  label?: string;
  disabled?: boolean;
  showPresets?: boolean;
};

export type StakeButtonProps = {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  loadingText?: string;
};

export type StakeMessageProps = {
  className?: string;
};

export type StakeToastProps = {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};
