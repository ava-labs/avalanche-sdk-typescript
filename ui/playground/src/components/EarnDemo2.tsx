import React from 'react';
import { EarnSinglePoolCard } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';
import type { ChainConfig } from '@avalanche-sdk/ui';

export function EarnDemo2() {
  const avalancheChain = avalanche as ChainConfig;
  
  return (
    <EarnSinglePoolCard
      provider="benqi"
      chain={avalancheChain}
      poolAddress="0xF362feA9659cf036792c9cb02f8ff8198E21B4cB"
      title="Benqi sAVAX Pool"
      onSuccess={(result) => {
        console.log('Single pool action successful:', result);
      }}
      onError={(error) => {
        console.error('Single pool error:', error);
      }}
    />
  );
}

