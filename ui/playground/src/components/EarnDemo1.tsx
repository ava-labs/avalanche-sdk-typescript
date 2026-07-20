import React from 'react';
import { EarnSinglePoolCard } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';
import type { ChainConfig } from '@avalanche-sdk/ui';

export function EarnDemo1() {
  const avalancheChain = avalanche as ChainConfig;
  
  return (
    <EarnSinglePoolCard
      provider="aave"
      chain={avalancheChain}
      poolAddress="0x625E7708f30cA75bfd92586e17077590C60eb4cD"
      title="AAVE USDC Pool"
      onSuccess={(result) => {
        console.log('Single pool action successful:', result);
      }}
      onError={(error) => {
        console.error('Single pool error:', error);
      }}
    />
  );
}

