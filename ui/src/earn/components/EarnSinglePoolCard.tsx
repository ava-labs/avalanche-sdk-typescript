'use client';
import React from 'react';
import { ExternalLink, ArrowDownCircle, ArrowUpCircle, Gift, Loader2 } from 'lucide-react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TokenImage } from '../../token/components/TokenImage';
import { EarnProvider } from './EarnProvider';
import { EarnDeposit } from './EarnDeposit';
import { EarnWithdraw } from './EarnWithdraw';
import { EarnClaimRewards } from './EarnClaimRewards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { AvalancheChainOverlay } from '../../components/ui/avalanche-chain-overlay';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { avalanche } from '@avalanche-sdk/client/chains';
import { openExplorer } from '../../utils/explorer';
import type { EarnProviderType } from '../types';
import type { ChainConfig } from '../../types/chainConfig';

export interface EarnSinglePoolCardProps {
  /** Provider name (aave, benqi) */
  provider: EarnProviderType;
  /** Chain configuration */
  chain: ChainConfig;
  /** Pool contract address (aToken address) */
  poolAddress: string;
  /** Optional className */
  className?: string;
  /** Optional title */
  title?: string;
  /** Callback on success */
  onSuccess?: (result: any) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

function EarnSinglePoolCardContent({ 
  provider, 
  chain, 
  poolAddress
}: Omit<EarnSinglePoolCardProps, 'className' | 'title' | 'onSuccess' | 'onError'>) {
  const { action, setAction, selectedPool, setSelectedPool, pools, isLoadingPools } = useEarnContext();
  const { walletChainId } = useAvalanche();
  
  // Check if on Avalanche Mainnet
  const isOnMainnet = walletChainId === avalanche.id;
  
  const handleExternalLink = () => {
    openExplorer(chain, { type: 'address', value: poolAddress });
  };

  // Find and select the pool by address when pools are loaded
  React.useEffect(() => {
    if (pools.length > 0 && !selectedPool) {
      const pool = pools.find(p => p.poolAddress.toLowerCase() === poolAddress.toLowerCase());
      if (pool) {
        setSelectedPool(pool);
        setAction('deposit');
      }
    }
  }, [pools, poolAddress, selectedPool, setSelectedPool, setAction]);

  if (isLoadingPools) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading pool data...</p>
      </div>
    );
  }

  if (!selectedPool || selectedPool.poolAddress.toLowerCase() !== poolAddress.toLowerCase()) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pool not found</p>
        <p className="text-sm text-muted-foreground mt-2">Address: {poolAddress}</p>
      </div>
    );
  }

  return (
    <AvalancheChainOverlay showOverlay={!isOnMainnet} onlyMainnet={true}>
      <div className="space-y-6">
        {/* Pool Header */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TokenImage token={selectedPool.token} size={48} />
          <div>
            <h2 className="text-2xl font-bold">{selectedPool.name} Pool</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {provider.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {chain.name}
              </Badge>
              {selectedPool.status === 'active' && (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              )}
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
    </AvalancheChainOverlay>
  );
}

export function EarnSinglePoolCard({
  provider,
  chain,
  poolAddress,
  className,
  title = "Earn",
  onSuccess,
  onError,
}: EarnSinglePoolCardProps) {
  return (
    <EarnProvider
      initialProvider={provider}
      initialChainId={chain.id.toString()}
      onSuccess={onSuccess}
      onError={onError}
    >
      <Card className={cn('w-full', className)} data-testid="earn-single-pool-card">
        <CardHeader>
          <CardTitle className="text-center" data-testid="earn-single-pool-title">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            <EarnSinglePoolCardContent
              provider={provider}
              chain={chain}
              poolAddress={poolAddress}
            />
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </EarnProvider>
  );
}

