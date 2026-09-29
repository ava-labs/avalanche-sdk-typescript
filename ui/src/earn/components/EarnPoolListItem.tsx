'use client';
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../styles/theme';
import { Badge } from '../../components/ui/badge';
import { TokenImage } from '../../token/components/TokenImage';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { openExplorer } from '../../utils/explorer';
import type { EarnPool } from '../types';

export interface EarnPoolListItemProps {
  pool: EarnPool;
  className?: string;
  onClick?: (pool: EarnPool) => void;
}

export function EarnPoolListItem({ pool, className, onClick }: EarnPoolListItemProps) {
  const { setSelectedPool, chainId } = useEarnContext();
  const { availableChains } = useAvalanche();
  
  const handleClick = () => {
    setSelectedPool(pool);
    onClick?.(pool);
  };
  
  
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const chain = availableChains.find(c => c.id.toString() === chainId);
    openExplorer(chain, { type: 'address', value: pool.poolAddress });
  };
  
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return '0';
    if (num < 0.0001) return '<0.0001';
    if (num < 1) return num.toFixed(4);
    if (num < 1000) return num.toFixed(2);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer',
        className
      )}
      onClick={handleClick}
      data-testid={`earn-pool-list-item-${pool.id}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <TokenImage token={pool.token} size={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{pool.name}</h3>
            <Badge variant="outline" className="text-xs">
              {pool.provider.toUpperCase()}
            </Badge>
            {pool.status === 'active' && (
              <Badge variant="default" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Total Supply: <span className="font-semibold text-foreground">{formatNumber(pool.totalSupply)} {pool.token.symbol}</span></span>
            {pool.userDeposited && (
              <span>Your Deposit: <span className="font-semibold text-foreground">{pool.userDeposited} {pool.token.symbol}</span></span>
            )}
            {pool.userRewards && parseFloat(pool.userRewards) > 0 && (
              <span className="text-green-600">Rewards: <span className="font-semibold">{pool.userRewards} {pool.rewardToken?.symbol || 'REWARDS'}</span></span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExternalLink}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="View on explorer"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

