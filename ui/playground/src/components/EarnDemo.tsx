import React from 'react';
import { Earn, EarnSinglePoolCard } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';
import type { ChainConfig } from '@avalanche-sdk/ui';

export function EarnDemo() {
  const avalancheChain = avalanche as ChainConfig;
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Earn Component</h3>
        <p className="text-muted-foreground text-sm">
          Earn yield on your assets by depositing them into AAVE liquidity pools on Avalanche.
          View available pools, deposit assets, withdraw, and claim rewards.
        </p>
        
        <Earn
          initialProvider="aave"
          initialChainId="43114"
          onSuccess={(result) => {
            console.log('Earn action successful:', result);
          }}
          onError={(error) => {
            console.error('Earn error:', error);
          }}
          onStatusChange={(status) => {
            console.log('Earn status:', status);
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Single Pool Card</h3>
        <p className="text-muted-foreground text-sm">
          Display a specific pool by providing the provider, chain, and pool address.
        </p>
        
        <div className="flex gap-4">
        <div className="w-1/2">
          <EarnSinglePoolCard
            provider="aave"
            chain={avalancheChain}
            poolAddress="0x625E7708f30cA75bfd92586e17077590C60eb4cD" // Example aToken address
            title="AAVE USDC Pool"
            onSuccess={(result) => {
              console.log('Single pool action successful:', result);
            }}
            onError={(error) => {
              console.error('Single pool error:', error);
            }}
          />
        </div>
        
        <div className="w-1/2">
          <EarnSinglePoolCard
            provider="benqi"
            chain={avalancheChain}
            poolAddress="0xF362feA9659cf036792c9cb02f8ff8198E21B4cB" // Example aToken address
            title="Benqi sAVAX Pool"
            onSuccess={(result) => {
              console.log('Single pool action successful:', result);
            }}
            onError={(error) => {
              console.error('Single pool error:', error);
            }}
          />
        </div>
        </div>

      </div>
    </div>
  );
}

