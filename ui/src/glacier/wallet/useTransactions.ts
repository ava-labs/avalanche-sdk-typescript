import { useState, useEffect, useCallback } from 'react';
import { useAvalanche } from '../../AvalancheProvider';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type { TransactionDetails } from '@avalanche-sdk/chainkit/models/components';

export type UseTransactionsOptions = {
  /** Wallet address to fetch transactions for (defaults to connected wallet address) */
  address?: string;
  /** Start block number for filtering */
  startBlock?: number;
  /** End block number for filtering */
  endBlock?: number;
  /** Sort order: 'asc' or 'desc' (default: 'desc') */
  sortOrder?: 'asc' | 'desc';
  /** Maximum number of transactions to fetch (default: 50) */
  maxItems?: number;
  /** Whether to auto-fetch on mount and when dependencies change (default: true) */
  autoFetch?: boolean;
};

export type UseTransactionsReturn = {
  /** Array of transaction details */
  transactions: TransactionDetails[];
  /** Whether transactions are currently being fetched */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually trigger a refresh of transactions */
  refresh: () => Promise<void>;
};

/**
 * Hook to fetch transaction history for a wallet address using ChainKit SDK
 * 
 * @example
 * ```tsx
 * const { transactions, loading, error, refresh } = useTransactions({
 *   startBlock: 12345678,
 *   endBlock: 12345900,
 *   sortOrder: 'desc',
 * });
 * ```
 */
export function useTransactions(
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const {
    address: providedAddress,
    startBlock,
    endBlock,
    sortOrder = 'desc',
    maxItems = 50,
    autoFetch = true,
  } = options;

  const { status, address: walletAddress } = useWalletContext();
  const { chain, chainkit } = useAvalanche();
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided address or fall back to connected wallet address
  const address = providedAddress || walletAddress;
  const isConnected = status === 'connected' && !!address;

  const fetchTransactions = useCallback(async () => {
    if (!address || !isConnected || !chainkit) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await chainkit.data.evm.address.transactions.list({
        address: address,
        chainId: chain.id.toString(),
        startBlock: startBlock,
        endBlock: endBlock,
        sortOrder: sortOrder,
        pageSize: 100,
      });

      const allTransactions: TransactionDetails[] = [];

      // Iterate through pages (result is already unwrapped by SDK)
      for await (const page of result) {
        // Page is ListTransactionsResponse after unwrapResultIterator
        const pageTransactions = page.result?.transactions || [];
        allTransactions.push(...pageTransactions);
        
        // Stop if we've reached maxItems
        if (maxItems && allTransactions.length >= maxItems) {
          break;
        }
      }

      // Limit to maxItems if specified
      const limitedTransactions = maxItems 
        ? allTransactions.slice(0, maxItems)
        : allTransactions;

      setTransactions(limitedTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    isConnected,
    chainkit,
    chain.id,
    startBlock,
    endBlock,
    sortOrder,
    maxItems,
  ]);

  useEffect(() => {
    if (autoFetch) {
      if (address && isConnected) {
        fetchTransactions();
      } else {
        setTransactions([]);
      }
    }
  }, [address, isConnected, autoFetch, fetchTransactions, chain.id]);

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions,
  };
}

