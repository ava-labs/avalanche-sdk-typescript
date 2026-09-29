'use client';
import { useCallback, useState } from 'react';
import { useAvalanche } from '../AvalancheProvider';
import type { Chain } from '@avalanche-sdk/client/chains';

export interface SwitchChainOptions {
  onSuccess?: (chain: Chain) => void;
  onError?: (error: Error) => void;
}

export function useSwitchChain(options: SwitchChainOptions = {}) {
  const { chain: currentChain, switchChain: switchChainFromProvider } = useAvalanche();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const switchChain = useCallback(async (targetChain: Chain) => {
    if (!targetChain) {
      const error = new Error('Target chain is required');
      setError(error);
      options.onError?.(error);
      return;
    }

    if (currentChain.id === targetChain.id) {
      // Already on the target chain
      options.onSuccess?.(targetChain);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the centralized switch chain function from AvalancheProvider
      await switchChainFromProvider(targetChain);
      options.onSuccess?.(targetChain);
    } catch (switchError: any) {
      const error = new Error(switchError.message || 'Failed to switch chain');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentChain, switchChainFromProvider, options]);

  return {
    switchChain,
    isLoading,
    error,
    currentChain,
  };
}
