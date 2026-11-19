import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAvalanche } from '../../AvalancheProvider';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type { Erc20TokenBalance } from '@avalanche-sdk/chainkit/models/components';
import { formatUnits } from 'viem';

export type UseErc20BalancesOptions = {
  /** Wallet address to fetch balances for (defaults to connected wallet address) */
  address?: string;
  /** Block number to fetch balances at */
  blockNumber?: number;
  /** Specific contract addresses to fetch balances for */
  contractAddresses?: string[];
  /** Whether to filter out zero balances (default: true) */
  filterZeroBalances?: boolean;
  /** Whether to sort by USD value (default: true) */
  sortByValue?: boolean;
  /** Whether to auto-fetch on mount and when dependencies change (default: true) */
  autoFetch?: boolean;
};

export type UseErc20BalancesReturn = {
  /** Array of ERC-20 token balances */
  balances: Erc20TokenBalance[];
  /** Whether balances are currently being fetched */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually trigger a refresh of balances */
  refresh: () => Promise<void>;
};

/**
 * Hook to fetch ERC-20 token balances for a wallet address using ChainKit SDK
 * 
 * @example
 * ```tsx
 * const { balances, loading, error, refresh } = useErc20Balances({
 *   blockNumber: 12345678,
 *   contractAddresses: ['0x...'],
 * });
 * ```
 */
export function useErc20Balances(
  options: UseErc20BalancesOptions = {}
): UseErc20BalancesReturn {
  const {
    address: providedAddress,
    blockNumber,
    contractAddresses,
    filterZeroBalances = true,
    sortByValue = true,
    autoFetch = true,
  } = options;

  const { status, address: walletAddress } = useWalletContext();
  const { chain, chainkit } = useAvalanche();
  const [balances, setBalances] = useState<Erc20TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use provided address or fall back to connected wallet address
  const address = providedAddress || walletAddress;
  const isConnected = status === 'connected' && !!address;

  // Memoize contract addresses string for stable dependency comparison
  const contractAddressesStr = useMemo(
    () => contractAddresses?.join(',') || '',
    [contractAddresses]
  );

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected || !chainkit) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await chainkit.data.evm.address.balances.listErc20({
        address: address,
        chainId: chain.id.toString(),
        blockNumber: blockNumber?.toString(),
        contractAddresses: contractAddressesStr || undefined,
        currency: 'usd',
        filterSpamTokens: true,
        pageSize: 100,
      });

      const allBalances: Erc20TokenBalance[] = [];

      // Iterate through pages (result is already unwrapped by SDK)
      for await (const page of result) {
        // Page is ListErc20BalancesResponse after unwrapResultIterator
        // The SDK returns operations.ListErc20BalancesResponse which wraps components.ListErc20BalancesResponse
        const balances = page.result?.erc20TokenBalances || [];
        allBalances.push(...balances);
      }

      // Filter out zero balances and sort by USD value if available
      let processedBalances = allBalances;

      if (filterZeroBalances) {
        processedBalances = processedBalances.filter((b) => {
          const formattedAmount = formatUnits(BigInt(b.balance), b.decimals);
          return parseFloat(formattedAmount) > 0;
        });
      }

      if (sortByValue) {
        processedBalances = processedBalances.sort((a, b) => {
          const aValue = a.balanceValue?.value || 0;
          const bValue = b.balanceValue?.value || 0;
          return bValue - aValue;
        });
      }

      setBalances(processedBalances);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token balances';
      setError(errorMessage);
      console.error('Error fetching ERC-20 balances:', err);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    isConnected,
    chainkit,
    chain.id,
    blockNumber,
    contractAddressesStr,
    filterZeroBalances,
    sortByValue,
  ]);

  useEffect(() => {
    if (autoFetch) {
      if (address && isConnected) {
        fetchBalances();
      } else {
        setBalances([]);
      }
    }
  }, [address, isConnected, autoFetch, fetchBalances, chain.id]);

  return {
    balances,
    loading,
    error,
    refresh: fetchBalances,
  };
}

