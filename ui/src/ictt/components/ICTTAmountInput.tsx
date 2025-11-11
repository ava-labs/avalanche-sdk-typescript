'use client';
import { useState, useEffect } from 'react';
import { cn } from '../../styles/theme';
import { AmountInput } from '../../components/ui/amount-input';
import { useICTTContext } from './ICTTProvider';
import { useAvalanche } from '../../AvalancheProvider';

export interface ICTTAmountInputProps {
  className?: string;
}

export function ICTTAmountInput({ className }: ICTTAmountInputProps) {
  const { 
    amount, 
    setAmount, 
    selectedToken,
    fromChain,
    areTokensValid
  } = useICTTContext();
  
  const { walletAddress, isWalletConnected, availableChains } = useAvalanche();
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // Fetch token balance when wallet is connected and token is selected
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!selectedToken || !walletAddress || !isWalletConnected) {
        setTokenBalance(null);
        return;
      }

      try {
        // Import viem for RPC calls
        const { createPublicClient, http, formatUnits } = await import('viem');

        // Find the chain data from availableChains
        const chainData = availableChains.find(c => c.id.toString() === fromChain);
        if (!chainData) {
          throw new Error(`Chain ${fromChain} not found in available chains`);
        }

        // Import ERC20 ABI for balance fetching
        const { ERC20_BALANCE_ABI } = await import('../../utils/erc20');

        const publicClient = createPublicClient({
          chain: chainData,
          transport: http(),
        });

        // Fetch balance and decimals
        const [balance, decimals] = await Promise.all([
          publicClient.readContract({
            address: selectedToken.address as `0x${string}`,
            abi: ERC20_BALANCE_ABI,
            functionName: 'balanceOf',
            args: [walletAddress as `0x${string}`],
          }),
          publicClient.readContract({
            address: selectedToken.address as `0x${string}`,
            abi: ERC20_BALANCE_ABI,
            functionName: 'decimals',
          }),
        ]);

        // Format balance using token decimals
        const formattedBalance = formatUnits(balance as bigint, decimals as number);
        
        // Format for display (add commas for thousands)
        const numericBalance = parseFloat(formattedBalance);
        const displayBalance = numericBalance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        });
        
        setTokenBalance(displayBalance);
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
        setTokenBalance('0.00');
      }
    };

    fetchTokenBalance();
  }, [selectedToken, walletAddress, isWalletConnected, fromChain]);

  const handleMaxClick = () => {
    if (tokenBalance && tokenBalance !== '0.00') {
      // Remove commas for input value
      const numericBalance = tokenBalance.replace(/,/g, '');
      setAmount(numericBalance);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <AmountInput
        label="Amount to Bridge"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        symbol={selectedToken?.symbol || 'TOKEN'}
        placeholder="0.00"
        disabled={!areTokensValid}
        showMax={!!tokenBalance && tokenBalance !== '0.00' && isWalletConnected && areTokensValid}
        maxValue={tokenBalance?.replace(/,/g, '') || '0'}
        onMaxClick={handleMaxClick}
        showBalance={!!tokenBalance && isWalletConnected}
      />
    </div>
  );
}
