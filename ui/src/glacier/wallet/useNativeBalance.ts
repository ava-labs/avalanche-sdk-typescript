import { useState, useEffect, useCallback } from 'react';
import { useAvalanche } from '../../AvalancheProvider';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type { NativeTokenBalance } from '@avalanche-sdk/chainkit/models/components';

export type UseNativeBalanceOptions = {
  /** Wallet address to fetch balance for (defaults to connected wallet address) */
  address?: string;
  /** Block number to fetch balance at */
  blockNumber?: number;
  /** Whether to auto-fetch on mount and when dependencies change (default: true) */
  autoFetch?: boolean;
};

export type UseNativeBalanceReturn = {
  /** Native token balance data */
  balance: NativeTokenBalance | null;
  /** Whether balance is currently being fetched */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually trigger a refresh of balance */
  refresh: () => Promise<void>;
};

/**
 * Hook to fetch native token balance for a wallet address using ChainKit SDK
 * 
 * @example
 * ```tsx
 * const { balance, loading, error, refresh } = useNativeBalance({
 *   blockNumber: 12345678,
 * });
 * ```
 */
export function useNativeBalance(
  options: UseNativeBalanceOptions = {}
): UseNativeBalanceReturn {
  const {
    address: providedAddress,
    blockNumber,
    autoFetch = true,
  } = options;

  const { status, address: walletAddress } = useWalletContext();
  const { chain, chainkit } = useAvalanche();
  const [balance, setBalance] = useState<NativeTokenBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided address or fall back to connected wallet address
  const address = providedAddress || walletAddress;
  const isConnected = status === 'connected' && !!address;

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected || !chainkit) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await chainkit.data.evm.address.balances.getNative({
        address: address,
        chainId: chain.id.toString(),
        blockNumber: blockNumber?.toString(),
        currency: 'usd',
      });

      setBalance(result.nativeTokenBalance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch native balance';
      setError(errorMessage);
      console.error('Error fetching native balance:', err);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    isConnected,
    chainkit,
    chain.id,
    blockNumber,
  ]);

  useEffect(() => {
    if (autoFetch) {
      if (address && isConnected) {
        fetchBalance();
      } else {
        setBalance(null);
      }
    }
  }, [address, isConnected, autoFetch, fetchBalance, chain.id]);

  return {
    balance,
    loading,
    error,
    refresh: fetchBalance,
  };
}

