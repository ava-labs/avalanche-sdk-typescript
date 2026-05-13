'use client';
import React from 'react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { EarnProvider } from './EarnProvider';
import { EarnProviderSelector } from './EarnProviderSelector';
import { EarnPoolsList } from './EarnPoolsList';
import { EarnDeposit } from './EarnDeposit';
import { EarnWithdraw } from './EarnWithdraw';
import { EarnClaimRewards } from './EarnClaimRewards';
import { TokenImage } from '../../token/components/TokenImage';
import { Badge } from '../../components/ui/badge';
import { ExternalLink, ArrowDownCircle, ArrowUpCircle, Gift } from 'lucide-react';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { AvalancheChainOverlay } from '../../components/ui/avalanche-chain-overlay';
import { avalanche } from '@avalanche-sdk/client/chains';
import { openExplorer } from '../../utils/explorer';
import type { EarnProviderProps } from '../types';
import type { ChainConfig } from '../../types/chainConfig';

type EarnProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
} & Omit<EarnProviderProps, 'children'>;

function EarnContent() {
  const { action, setAction, selectedPool, setSelectedPool, chainId } = useEarnContext();
  const { availableChains, walletChainId } = useAvalanche();
  
  const handleExternalLink = () => {
    const chain = availableChains.find((c: ChainConfig) => c.id.toString() === chainId);
    if (selectedPool?.poolAddress) {
      openExplorer(chain, { type: 'address', value: selectedPool.poolAddress });
    }
  };
  
  // Check if on Avalanche Mainnet
  const isOnMainnet = walletChainId === avalanche.id;
  
  return (
    <AvalancheChainOverlay showOverlay={!isOnMainnet} onlyMainnet={true}>
      <div className="flex flex-col gap-6">
        <EarnProviderSelector />
        
        {selectedPool ? (
        <div className="space-y-4">
          {/* Expanded Pool View */}
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedPool(null);
                      setAction(null);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
                    title="Back to pools"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <TokenImage token={selectedPool.token} size={48} />
                    <div>
                      <CardTitle className="text-2xl">{selectedPool.name} Pool</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedPool.provider.toUpperCase()}
                        </Badge>
                        {selectedPool.status === 'active' && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExternalLink}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent"
                  title="View on explorer"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pool Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Supply</p>
                    <p className="text-3xl font-bold text-primary">
                      {parseFloat(selectedPool.totalSupply).toLocaleString(undefined, { maximumFractionDigits: 2 })} {selectedPool.token.symbol}
                    </p>
                  </div>
                  {selectedPool.userDeposited && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Your Deposit</p>
                      <p className="text-2xl font-semibold">{selectedPool.userDeposited} {selectedPool.token.symbol}</p>
                    </div>
                  )}
                  {selectedPool.userRewards && parseFloat(selectedPool.userRewards) > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Pending Rewards</p>
                      <p className="text-2xl font-semibold text-green-600">{selectedPool.userRewards} {selectedPool.rewardToken?.symbol || 'REWARDS'}</p>
                    </div>
                  )}
                </div>
                
                {/* Action Tabs */}
                <div className="border-t pt-6">
                  <Tabs value={action || 'deposit'} onValueChange={(value) => setAction(value as 'deposit' | 'withdraw' | 'claim')}>
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
                      <TabsTrigger 
                        value="deposit" 
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                        <span>Deposit</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="withdraw"
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                        <span>Withdraw</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="claim"
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                      >
                        <Gift className="h-4 w-4" />
                        <span>Claim</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="deposit" className="mt-6">
                      <EarnDeposit />
                    </TabsContent>
                    
                    <TabsContent value="withdraw" className="mt-6">
                      <EarnWithdraw />
                    </TabsContent>
                    
                    <TabsContent value="claim" className="mt-6">
                      <EarnClaimRewards />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EarnPoolsList />
      )}
      </div>
    </AvalancheChainOverlay>
  );
}

export function Earn({
  children,
  className,
  title = "Earn",
  ...providerProps
}: EarnProps) {
  return (
    <EarnProvider {...providerProps}>
      <Card className={cn('w-full', className)} data-testid="earn">
        <CardHeader>
          <CardTitle className="text-center" data-testid="earn-title">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            {children || <EarnContent />}
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </EarnProvider>
  );
}

