import React from 'react';
import { useAvalanche, WalletBalance, Card, CardHeader, CardTitle, CardContent, Badge } from '@avalanche-sdk/ui';

export function ChainBalancesSectionContent() {
  const { chain } = useAvalanche();
  const isAvalancheChain = chain.id === 43113 || chain.id === 43114; // Mainnet or Fuji
  
  return (
    <section id="chain-balances" className="component-section">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Chain Balances
        </h2>
        <p className="text-muted-foreground text-lg">
          View balances across Avalanche chains
        </p>
      </div>
      <div className={`grid grid-cols-1 ${isAvalancheChain ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6 items-start`}>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-green-500">{chain.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <WalletBalance chainType="cChain"/>
          </CardContent>
        </Card>
        {isAvalancheChain && (
          <>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-blue-500">P-Chain</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <WalletBalance chainType="pChain"/>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-purple-500">X-Chain</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <WalletBalance chainType="xChain"/>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
  );
}

