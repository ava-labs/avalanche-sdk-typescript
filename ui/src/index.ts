// 🏔️❄️🏔️ Avalanche UI Kit
// Import styles
import './styles/index.css';

// Main Provider
export { AvalancheProvider, useAvalanche, useAvailableChains } from './AvalancheProvider';

// Theme Provider
export { ThemeProvider, useTheme } from './theme';
export type { Theme, Mode } from './theme';

// Wallet Module
export * from './wallet';

// Transfer Module  
export * from './transfer';

// ICTT Module
export * from './ictt';
export type { ICTTToken, ICTTTokenMirror } from './ictt/types';

// Stake Module
export * from './stake';

// Earn Module
export * from './earn';
export type { EarnPool, EarnProviderType, EarnStatus, EarnAction } from './earn/types';

// Chain Module
export * from './chain';

// Token Module
export * from './token';

// Hooks
export * from './hooks';

// Utils
export * from './utils';

// shadcn/ui Components
export * from './components/ui';

// Theme
export { cn, text, pressable, border } from './styles/theme';

// Types
export type { AvalancheConfig, AvalancheProviderProps, AvalancheContextType } from './AvalancheProvider';
export type { ChainConfig } from './types/chainConfig';
export { isChainConfig } from './types/chainConfig';
