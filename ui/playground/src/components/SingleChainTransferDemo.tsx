import React, { useState } from 'react';
import { Transfer, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ChainLogo } from '@avalanche-sdk/ui';

export function SingleChainTransferDemo() {
  const [selectedChain, setSelectedChain] = useState<'C' | 'P' | 'X'>('C');

  const chains = [
    { id: 'C' as const, name: 'C-Chain', description: 'Contract Chain' },
    { id: 'P' as const, name: 'P-Chain', description: 'Platform Chain' },
    { id: 'X' as const, name: 'X-Chain', description: 'Exchange Chain' },
  ];

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-1.5">
          <CardTitle>Single Chain Transfer</CardTitle>
          <CardDescription>Send AVAX to another address on the same chain</CardDescription>
        </div>
        
        {/* Chain Selection Buttons */}
        <div className="flex gap-2 py-4 bg-muted/30 rounded-lg w-full justify-start">
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant={selectedChain === chain.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChain(chain.id)}
              className="flex items-center gap-3 p-4"
            >
              <ChainLogo chain={chain.id} size={24} showLabel={true} />
              {chain.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Transfer
          key={selectedChain} // Force re-render when chain changes
          title="Single Chain Transfer"
          initialFromChain={selectedChain}
          initialToChain={selectedChain}
          onSuccess={(result) => {
            console.log(`${selectedChain}-Chain transfer successful:`, result);
          }}
          onError={(error) => {
            console.error(`${selectedChain}-Chain transfer error:`, error);
          }}
        />
      </CardContent>
    </Card>
  );
}
