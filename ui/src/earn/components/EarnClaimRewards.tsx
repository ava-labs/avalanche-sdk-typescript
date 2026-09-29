'use client';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { LoaderCircle, Gift, RefreshCw } from 'lucide-react';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';

export interface EarnClaimRewardsProps {
  className?: string;
}

export function EarnClaimRewards({ className }: EarnClaimRewardsProps) {
  const {
    selectedPool,
    isClaiming,
    claimRewards,
    isOnCorrectChain,
    isSwitchingChain,
    switchToChain,
    chainId,
    error,
  } = useEarnContext();
  
  const { availableChains } = useAvalanche();
  
  const getChainName = () => {
    const chain = availableChains.find(c => c.id.toString() === chainId);
    return chain?.name || `Chain ${chainId}`;
  };
  
  if (!selectedPool) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please select a pool to claim rewards from</p>
        </CardContent>
      </Card>
    );
  }
  
  const hasRewards = selectedPool.userRewards && parseFloat(selectedPool.userRewards) > 0;
  
  if (!hasRewards) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No rewards available to claim</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(className)} data-testid="earn-claim-rewards">
      <CardHeader>
        <CardTitle>Claim Rewards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Available Rewards</p>
          <div className="text-2xl font-bold text-green-600">
            {selectedPool.userRewards} {selectedPool.rewardToken?.symbol || 'REWARDS'}
          </div>
          <p className="text-xs text-muted-foreground">
            From {selectedPool.name} pool
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="break-words">{error}</AlertDescription>
          </Alert>
        )}
        
        {!isOnCorrectChain && (
          <Button
            onClick={switchToChain}
            disabled={isSwitchingChain}
            className="w-full"
            variant="destructive"
          >
            {isSwitchingChain ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Switch to {getChainName()}
          </Button>
        )}
        
        <Button
          onClick={claimRewards}
          disabled={isClaiming || !isOnCorrectChain || !hasRewards}
          className="w-full"
          size="lg"
        >
          {isClaiming ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Gift className="mr-2 h-4 w-4" />
          )}
          {isClaiming ? 'Claiming...' : 'Claim Rewards'}
        </Button>
      </CardContent>
    </Card>
  );
}

