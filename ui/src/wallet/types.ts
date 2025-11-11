import type { ReactNode } from 'react';
import type { Chain } from '@avalanche-sdk/client/chains';
import type { Address } from '@avalanche-sdk/client';

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type WalletError = {
  message: string;
  code?: string | number;
};

export type WalletBalance = {
  /** Balance in AVAX (formatted string) */
  avax: string;
  /** Balance in wei (bigint) */
  wei: bigint;
  /** USD value (formatted string) */
  usd?: string;
  /** Loading state */
  loading: boolean;
  /** Last updated timestamp */
  lastUpdated?: Date;
};

export type ChainBalances = {
  /** P-Chain balance */
  pChain: WalletBalance;
  /** C-Chain balance */
  cChain: WalletBalance;
  /** X-Chain balance */
  xChain: WalletBalance;
};

export type WalletContextType = {
  /** Current wallet connection status */
  status: WalletStatus;
  /** Connected wallet address */
  address?: Address;
  /** X-Chain address (derived from wallet) */
  xAddress?: string;
  /** P-Chain address (derived from wallet) */
  pAddress?: string;
  /** Current error if any */
  error?: WalletError;
  /** Available chains for network switching */
  availableChains: Chain[];
  /** Currently selected chain */
  currentChain: Chain;
  /** Wallet client for transactions (null if no wallet) */
  walletClient: ReturnType<typeof import('@avalanche-sdk/client').createAvalancheWalletClient> | null;
  /** Balances across all chains */
  balances: ChainBalances;
  /** Connect to wallet */
  connect: () => Promise<void>;
  /** Disconnect from wallet */
  disconnect: () => void;
  /** Switch to a different chain */
  switchChain: (chain: Chain) => Promise<void>;
  /** Refresh balances */
  refreshBalances: () => Promise<void>;
  /** Clear any errors */
  clearError: () => void;
};

export type WalletProviderProps = {
  children: ReactNode;
  /** Initial chain to connect to */
  initialChain?: Chain;
  /** Callback when connection status changes */
  onStatusChange?: (status: WalletStatus) => void;
  /** Callback when an error occurs */
  onError?: (error: WalletError) => void;
  /** Callback when successfully connected */
  onConnect?: (address: Address) => void;
  /** Callback when disconnected */
  onDisconnect?: () => void;
};

export type WalletConnectProps = {
  /** Custom class name */
  className?: string;
  /** Custom text for the connect button */
  connectText?: string;
  /** Custom text for the connected state */
  connectedText?: string;
  /** Show loading state */
  showLoading?: boolean;
};

export type WalletDropdownProps = {
  /** Custom class name */
  className?: string;
  /** Show balance in dropdown */
  showBalance?: boolean;
  /** Show network info in dropdown */
  showNetwork?: boolean;
  /** Show X-Chain and P-Chain addresses */
  showXPAddresses?: boolean;
};

export type WalletBalanceProps = {
  /** Custom class name */
  className?: string;
  /** Token symbol to display (defaults to AVAX) */
  symbol?: string;
  /** Show USD value */
  showUSD?: boolean;
  /** Number of decimal places to show */
  decimals?: number;
  /** Which chain balance to display */
  chainType?: 'pChain' | 'cChain' | 'xChain';
};

export type NetworkSelectorProps = {
  /** Custom class name */
  className?: string;
  /** Show testnet networks */
  showTestnets?: boolean;
  /** Custom network options */
  networks?: Chain[];
};

export type WalletMessageProps = {
  /** Custom class name */
  className?: string;
  /** Show detailed error messages */
  showDetails?: boolean;
};

export type WalletPortfolioProps = {
  /** Custom class name */
  className?: string;
  /** Show USD values */
  showUSD?: boolean;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Maximum number of tokens to display */
  maxItems?: number;
  /** Number of items per page for pagination */
  itemsPerPage?: number;
  /** Specific contract addresses to fetch balances for */
  contractAddresses?: string[];
  /** Block number to fetch balances at */
  blockNumber?: number;
};

export type WalletTransactionsProps = {
  /** Custom class name */
  className?: string;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Maximum number of transactions to display */
  maxItems?: number;
  /** Number of items per page for pagination */
  itemsPerPage?: number;
  /** Start block number for filtering */
  startBlock?: number;
  /** End block number for filtering */
  endBlock?: number;
  /** Sort order: 'asc' or 'desc' (default: 'desc') */
  sortOrder?: 'asc' | 'desc';
};

export type WalletActivityProps = {
  /** Custom class name */
  className?: string;
  /** Portfolio props */
  portfolioProps?: Omit<WalletPortfolioProps, 'className'>;
  /** Transactions props */
  transactionsProps?: Omit<WalletTransactionsProps, 'className'>;
  /** Default active tab */
  defaultTab?: 'portfolio' | 'transactions';
  /** Show refresh button */
  showRefresh?: boolean;
  /** Number of items per page for pagination */
  itemsPerPage?: number;
};
