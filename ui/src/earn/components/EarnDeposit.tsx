'use client';
import { useState, useEffect } from 'react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AmountInput } from '../../components/ui/amount-input';
import { LoaderCircle, ArrowDownCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';

export interface EarnDepositProps {
  className?: string;
}

export function EarnDeposit({ className }: EarnDepositProps) {
  const {
    selectedPool,
    depositAmount,
    setDepositAmount,
    isDepositing,
    deposit,
    needsApproval,
    isApproving,
    approveToken,
    isValidForDeposit,
    isOnCorrectChain,
    isSwitchingChain,
    switchToChain,
    chainId,
    error,
  } = useEarnContext();
  
  const { walletAddress, isWalletConnected, availableChains } = useAvalanche();
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  
  // Fetch token balance
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!selectedPool || !walletAddress || !isWalletConnected) {
        setTokenBalance(null);
        return;
      }
      
      try {
        const { createPublicClient, http, formatUnits } = await import('viem');
        const { ERC20_BALANCE_ABI } = await import('../../utils/erc20');
        
        const chainData = availableChains.find(c => c.id.toString() === chainId);
        if (!chainData) {
          throw new Error(`Chain ${chainId} not found`);
        }
        
        const publicClient = createPublicClient({
          chain: chainData,
          transport: http(),
        });
        
        const tokenAddress = selectedPool.token.address || '0x0000000000000000000000000000000000000000';
        
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          // Native token (AVAX)
          const balance = await publicClient.getBalance({
            address: walletAddress as `0x${string}`,
          });
          const formattedBalance = formatUnits(balance, 18);
          setTokenBalance(parseFloat(formattedBalance).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6,
          }));
        } else {
          const [balance, decimals] = await Promise.all([
            publicClient.readContract({
              address: tokenAddress as `0x${string}`,
              abi: ERC20_BALANCE_ABI,
              functionName: 'balanceOf',
              args: [walletAddress as `0x${string}`],
            }),
            publicClient.readContract({
              address: tokenAddress as `0x${string}`,
              abi: ERC20_BALANCE_ABI,
              functionName: 'decimals',
            }),
          ]);
          
          const formattedBalance = formatUnits(balance as bigint, decimals as number);
          setTokenBalance(parseFloat(formattedBalance).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
        setTokenBalance('0.00');
      }
    };
    
    fetchTokenBalance();
  }, [selectedPool, walletAddress, isWalletConnected, chainId, availableChains]);
  
  const handleMaxClick = () => {
    if (tokenBalance && tokenBalance !== '0.00') {
      const numericBalance = tokenBalance.replace(/,/g, '');
      setDepositAmount(numericBalance);
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
          <p className="text-center text-muted-foreground">Please select a pool to deposit</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(className)} data-testid="earn-deposit">
      <CardHeader>
        <CardTitle>Deposit to {selectedPool.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <AmountInput
            label="Deposit Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            symbol={selectedPool.token.symbol}
            placeholder="0.00"
            disabled={!isOnCorrectChain || !isWalletConnected}
            showMax={!!tokenBalance && tokenBalance !== '0.00' && isWalletConnected && isOnCorrectChain}
            maxValue={tokenBalance?.replace(/,/g, '') || '0'}
            onMaxClick={handleMaxClick}
            showBalance={!!tokenBalance && isWalletConnected}
          />
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
        
        {needsApproval && (
          <Button
            onClick={approveToken}
            disabled={!isValidForDeposit || isApproving || !isOnCorrectChain}
            className="w-full"
            size="lg"
          >
            {isApproving ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {isApproving ? 'Approving...' : `Approve ${selectedPool.token.symbol}`}
          </Button>
        )}
        
        <Button
          onClick={deposit}
          disabled={!isValidForDeposit || isDepositing || !isOnCorrectChain || needsApproval}
          className="w-full"
          size="lg"
        >
          {isDepositing ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownCircle className="mr-2 h-4 w-4" />
          )}
          {isDepositing ? 'Depositing...' : `Deposit ${selectedPool.token.symbol}`}
        </Button>
      </CardContent>
    </Card>
  );
}

