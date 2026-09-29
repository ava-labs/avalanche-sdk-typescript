'use client';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AmountInput } from '../../components/ui/amount-input';
import { LoaderCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';

export interface EarnWithdrawProps {
  className?: string;
}

export function EarnWithdraw({ className }: EarnWithdrawProps) {
  const {
    selectedPool,
    withdrawAmount,
    setWithdrawAmount,
    isWithdrawing,
    withdraw,
    isValidForWithdraw,
    isOnCorrectChain,
    isSwitchingChain,
    switchToChain,
    chainId,
    error,
  } = useEarnContext();
  
  const { availableChains } = useAvalanche();
  
  const handleMaxClick = () => {
    if (selectedPool?.userDeposited) {
      setWithdrawAmount(selectedPool.userDeposited);
    }
  };
  
  const getChainName = () => {
    const chain = availableChains.find(c => c.id.toString() === chainId);
    return chain?.name || `Chain ${chainId}`;
  };
  
  if (!selectedPool) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please select a pool to withdraw from</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!selectedPool.userDeposited || parseFloat(selectedPool.userDeposited) <= 0) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">You have no deposits in this pool</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(className)} data-testid="earn-withdraw">
      <CardHeader>
        <CardTitle>Withdraw from {selectedPool.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <AmountInput
            label="Withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            symbol={selectedPool.token.symbol}
            placeholder="0.00"
            disabled={!isOnCorrectChain}
            showMax={!!selectedPool.userDeposited && parseFloat(selectedPool.userDeposited) > 0}
            maxValue={selectedPool.userDeposited}
            onMaxClick={handleMaxClick}
            showBalance={!!selectedPool.userDeposited}
          />
          {selectedPool.userDeposited && (
            <p className="text-xs text-muted-foreground">
              Available: {selectedPool.userDeposited} {selectedPool.token.symbol}
            </p>
          )}
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
          onClick={withdraw}
          disabled={!isValidForWithdraw || isWithdrawing || !isOnCorrectChain}
          className="w-full"
          size="lg"
        >
          {isWithdrawing ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpCircle className="mr-2 h-4 w-4" />
          )}
          {isWithdrawing ? 'Withdrawing...' : `Withdraw ${selectedPool.token.symbol}`}
        </Button>
      </CardContent>
    </Card>
  );
}

