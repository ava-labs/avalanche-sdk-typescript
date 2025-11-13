import { useContext } from 'react';
import { WalletContext } from '../components/WalletProvider';

/**
 * Hook to access the wallet context.
 * Must be used within a WalletProvider.
 */
export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}
