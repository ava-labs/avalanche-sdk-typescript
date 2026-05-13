'use client';
import { useMemo } from 'react';
import { useAvalanche, useAvailableChains } from '../../AvalancheProvider';
import { useSwitchChain } from '../../hooks/useSwitchChain';
import { ChainSelectDropdown, ChainLogo, type ChainOption } from '../../chain';
import type { NetworkSelectorProps } from '../types';

export function NetworkSelector({
  className,
  showTestnets = true,
  networks,
}: NetworkSelectorProps) {
  const { chain: currentChain } = useAvalanche();
  const availableChains = useAvailableChains();
  const { switchChain, isLoading } = useSwitchChain({
    onSuccess: (chain) => {
      console.log('Successfully switched to:', chain.name);
    },
    onError: (error) => {
      console.error('Failed to switch chain:', error);
    },
  });

  const chains = networks || availableChains;
  const filteredChains = showTestnets 
    ? chains 
    : chains.filter(chain => !chain.testnet);

  // Transform Avalanche SDK chains to ChainSelector format
  const chainSelectorChains: ChainOption[] = useMemo(() => {
    return filteredChains.map((chain) => {
      return {
        id: chain.id.toString(),
        name: chain.name,
        description: chain.testnet ? 'Testnet' : 'Mainnet',
        color: chain.testnet ? 'bg-yellow-500' : 'bg-primary',
        icon: (
          <ChainLogo 
            chain={chain}
            size={32}
            badge={chain.testnet ? 'T' : undefined}
            showLabel={false}
          />
        )
      };
    });
  }, [filteredChains]);

  const handleChainChange = async (chainId: string) => {
    const selectedChain = filteredChains.find(chain => chain.id.toString() === chainId);
    if (selectedChain && selectedChain.id !== currentChain.id) {
      await switchChain(selectedChain);
    }
  };

  return (
    <ChainSelectDropdown
      options={chainSelectorChains}
      value={currentChain.id.toString()}
      onValueChange={(chainId) => handleChainChange(chainId)}
      placeholder="Select Network"
      disabled={isLoading}
      className={className}
      label="Network"
    />
  );
}
