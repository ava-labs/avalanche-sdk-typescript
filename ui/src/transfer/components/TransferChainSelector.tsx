'use client';
import { useTransferContext } from '../hooks/useTransferContext';
import { useAvailableChains } from '../../AvalancheProvider';
import { ChainSelectDropdown, ChainLogo, type ChainOption } from '../../chain';
import type { TransferChainSelectorProps, TransferChain } from '../types';

export function TransferChainSelector({
  className,
  type,
  disabled = false,
}: TransferChainSelectorProps) {
  const { 
    fromChain, 
    toChain, 
    setFromChain, 
    setToChain, 
    availableChains, 
    status 
  } = useTransferContext();
  
  const avalancheChains = useAvailableChains();

  const currentChain = type === 'from' ? fromChain : toChain;
  const setChain = type === 'from' ? setFromChain : setToChain;
  const isDisabled = disabled || status === 'preparing' || status === 'pending';
  const otherChain = type === 'from' ? toChain : fromChain;

  // Convert TransferChain to Chain format for ChainSelector
  const chains: ChainOption[] = availableChains.map((chain: TransferChain) => {
    // Find the Avalanche chain from available chains (usually the first mainnet or testnet chain)
    const avalancheChain = avalancheChains.find(c => !c.testnet) || avalancheChains[0];
    
    // X-P-C specific information to overlay on the Avalanche chain
    const chainSpecificData = {
      P: { 
        name: 'P-Chain', 
        description: 'Platform Chain for staking & validators',
        badge: 'P'
      },
      C: { 
        name: 'C-Chain', 
        description: 'EVM-compatible chain for smart contracts',
        badge: 'C'
      },
      X: { 
        name: 'X-Chain', 
        description: 'Exchange Chain for asset transfers',
        badge: 'X'
      },
    };
    
    const chainInfo = chainSpecificData[chain];
    
    // Create chain data combining Avalanche chain info with X-P-C specifics
    const chainData = {
      id: avalancheChain?.id?.toString() || chain,
      name: avalancheChain?.name || 'Avalanche',
      iconUrl: (avalancheChain as any)?.iconUrl,
      testnet: avalancheChain?.testnet || false
    };
    
    return {
      id: chain,
      name: chainInfo.name,
      description: chainInfo.description,
      color: '', // Not needed since we're using custom icons
      icon: <ChainLogo chain={chainData} size={32} badge={chainInfo.badge} />,
    };
  });

  const handleChainChange = (chainId: string) => {
    setChain(chainId as TransferChain);
  };

  return (
    <ChainSelectDropdown
      options={chains}
      value={currentChain}
      onValueChange={(chainId) => handleChainChange(chainId)}
      label={type === 'from' ? 'Source Chain' : 'Destination Chain'}
      disabled={isDisabled}
      disabledOptions={[otherChain]}
      className={className}
      data-testid={`transfer-chain-selector-${type}`}
    />
  );
}
