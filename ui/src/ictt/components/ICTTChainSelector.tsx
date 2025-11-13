'use client';
import { useMemo } from 'react';
import { ChainSelectDropdown, ChainLogo, type ChainOption } from '../../chain';
import { useICTTContext } from './ICTTProvider';
import { useAvalanche } from '../../AvalancheProvider';
import type { Chain as SDKChain } from '@avalanche-sdk/client/chains';

function mapSDKChainToICTTChain(sdkChain: SDKChain): ChainOption {
  // Use chain ID as the ICTT chain identifier
  const chainId = sdkChain.id.toString();
  
  // Generate description based on testnet flag
  const description = sdkChain.testnet ? 'Testnet' : 'Mainnet';
  
  // Generate color based on chain ID (simple hash-based color)
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
    'bg-red-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  const colorIndex = sdkChain.id % colors.length;
  
  // Create chain data with iconUrl for ChainLogo
  const chainData = {
    id: chainId,
    name: sdkChain.name,
    iconUrl: (sdkChain as any).iconUrl, // SDK Chain type might not have iconUrl in types but could exist at runtime
    testnet: sdkChain.testnet || false
  };
  
  return {
    id: chainId,
    name: sdkChain.name,
    description,
    color: colors[colorIndex],
    icon: <ChainLogo chain={chainData} size={32} showLabel={false} />
  };
}

export interface ICTTChainSelectorProps {
  className?: string;
  type: 'from' | 'to';
}

export function ICTTChainSelector({ className, type }: ICTTChainSelectorProps) {
  const {
    fromChain,
    toChain,
    setFromChain,
    setToChain,
  } = useICTTContext();

  const { availableChains } = useAvalanche();

  // Convert all SDK chains to ICTT-compatible chains
  const icttChains = useMemo(() => {
    return availableChains.map(mapSDKChainToICTTChain);
  }, [availableChains]);

  const currentChain = type === 'from' ? fromChain : toChain;
  const setChain = type === 'from' ? setFromChain : setToChain;
  const otherChain = type === 'from' ? toChain : fromChain;

  const handleChainChange = (chainId: string) => {
    setChain(chainId);
  };

  return (
    <ChainSelectDropdown
      options={icttChains}
      value={currentChain}
      onValueChange={(chainId) => handleChainChange(chainId)}
      label={type === 'from' ? 'Source Chain' : 'Destination Chain'}
      disabledOptions={[otherChain]}
      className={className}
      data-testid={`ictt-chain-selector-${type}`}
    />
  );
}