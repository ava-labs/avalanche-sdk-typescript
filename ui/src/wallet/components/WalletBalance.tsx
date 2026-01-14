'use client';
import { useMemo } from 'react';
import { useWalletContext } from '../hooks/useWalletContext';
import { useAvalanche } from '../../AvalancheProvider';
import { cn, text } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import type { WalletBalanceProps } from '../types';

export function WalletBalance({
  className,
  symbol,
  decimals = 4,
  chainType = 'cChain', // Default to C-Chain
}: WalletBalanceProps) {
  const { status, balances, refreshBalances } = useWalletContext();
  const { chain } = useAvalanche();

  // Get the balance for the specified chain
  const chainBalance = useMemo(() => {
    return balances[chainType];
  }, [balances, chainType]);

  const { avax, usd, loading } = chainBalance;

  // Format balance to specified decimals
  const formattedBalance = useMemo(() => {
    return parseFloat(avax).toFixed(decimals);
  }, [avax, decimals]);

  // Get chain name label
  const chainLabel = useMemo(() => {
    if (chainType === 'pChain') return 'P-Chain';
    if (chainType === 'xChain') return 'X-Chain';
    // For C-Chain, show the actual chain name
    return chain.name;
  }, [chainType, chain]);

  // Get the native currency symbol from the chain
  const currencySymbol = useMemo(() => {
    // Use provided symbol if available, otherwise use chain's native currency
    if (symbol) return symbol;
    return chain.nativeCurrency?.symbol || 'AVAX';
  }, [symbol, chain]);

  if (status !== 'connected') {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-3', className)} data-testid="wallet-balance">
      <div className="flex items-center gap-2">
        <span className={cn(text.caption, 'text-muted-foreground')}>
          {chainLabel} Balance
        </span>
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        <Button
          onClick={refreshBalances}
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          title="Refresh balance"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn(text.headline, 'font-mono')}>
          {formattedBalance} {currencySymbol}
        </span>
      </div>
    </div>
  );
}
