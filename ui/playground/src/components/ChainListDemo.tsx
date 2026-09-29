import React from 'react';
import { useAvalanche, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@avalanche-sdk/ui';

export function ChainListDemo() {
  const { availableChains, chain: currentChain } = useAvalanche();

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="space-y-1.5">
          <CardTitle>Available Chains</CardTitle>
          <CardDescription>
            Chains available from AvalancheProvider when constructed
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Current Chain:</h4>
            <Badge variant="default" className="text-sm">
              {currentChain.name} (ID: {currentChain.id})
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">All Available Chains:</h4>
            <div className="flex flex-wrap gap-2">
              {availableChains.map((chain) => (
                <Badge 
                  key={chain.id} 
                  variant={chain.id === currentChain.id ? "default" : "secondary"}
                  className="text-sm"
                >
                  {chain.name} (ID: {chain.id})
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              The <code>availableChains</code> list is provided by the user when constructing the AvalancheProvider.
              It includes: {availableChains.map(chain => chain.name).join(', ')}.
            </p>
            <p className="mt-2">
              If no chains are provided, it defaults to Avalanche Mainnet and Fuji Testnet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
