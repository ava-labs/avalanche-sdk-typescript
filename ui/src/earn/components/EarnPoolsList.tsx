'use client';
import { LayoutGrid, List, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useEarnContext } from './EarnProvider';
import { EarnPoolCard } from './EarnPoolCard';
import { EarnPoolListItem } from './EarnPoolListItem';

export interface EarnPoolsListProps {
  className?: string;
  onPoolClick?: (pool: any) => void;
}

export function EarnPoolsList({ className, onPoolClick }: EarnPoolsListProps) {
  const { pools, isLoadingPools, viewMode, setViewMode, refreshPools } = useEarnContext();
  
  return (
    <div className={cn('space-y-4', className)} data-testid="earn-pools-list">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Earn Pools</h2>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'card' | 'list')}>
            <TabsList>
              <TabsTrigger value="card" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={refreshPools}
            variant="outline"
            size="icon"
            disabled={isLoadingPools}
            title="Refresh pools"
          >
            {isLoadingPools ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Loading state - initial load */}
      {isLoadingPools && pools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading pools...</p>
        </div>
      )}
      
      {/* Loading overlay - when refreshing existing pools */}
      {isLoadingPools && pools.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Refreshing pools...</p>
            </div>
          </div>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
              {pools.map((pool) => (
                <EarnPoolCard
                  key={pool.id}
                  pool={pool}
                  onClick={onPoolClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 opacity-50">
              {pools.map((pool) => (
                <EarnPoolListItem
                  key={pool.id}
                  pool={pool}
                  onClick={onPoolClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Empty state */}
      {!isLoadingPools && pools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pools available</p>
        </div>
      )}
      
      {/* Pools grid/list */}
      {!isLoadingPools && pools.length > 0 && (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.map((pool) => (
                <EarnPoolCard
                  key={pool.id}
                  pool={pool}
                  onClick={onPoolClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {pools.map((pool) => (
                <EarnPoolListItem
                  key={pool.id}
                  pool={pool}
                  onClick={onPoolClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

