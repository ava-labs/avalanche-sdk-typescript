'use client';
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TokenImage } from '../../token/components/TokenImage';
import { useEarnContext } from './EarnProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { openExplorer } from '../../utils/explorer';
import type { EarnPool } from '../types';

export interface EarnPoolCardProps {
  pool: EarnPool;
  className?: string;
  onClick?: (pool: EarnPool) => void;
}

export function EarnPoolCard({ pool, className, onClick }: EarnPoolCardProps) {
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
    <Card 
      className={cn('cursor-pointer hover:border-primary transition-colors', className)}
      onClick={handleClick}
      data-testid={`earn-pool-card-${pool.id}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TokenImage token={pool.token} size={40} />
            <div>
              <CardTitle className="text-lg">{pool.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {pool.provider.toUpperCase()}
                </Badge>
                {pool.status === 'active' && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleExternalLink}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="View on explorer"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Supply</p>
            <p className="text-2xl font-bold text-primary">{formatNumber(pool.totalSupply)} {pool.token.symbol}</p>
          </div>
          
          {pool.userDeposited && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Your Deposit</p>
              <p className="text-lg font-semibold">{pool.userDeposited} {pool.token.symbol}</p>
            </div>
          )}
          
          {pool.userRewards && parseFloat(pool.userRewards) > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Pending Rewards</p>
              <p className="text-lg font-semibold text-green-600">{pool.userRewards} {pool.rewardToken?.symbol || 'REWARDS'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

