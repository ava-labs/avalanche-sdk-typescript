'use client';
import { cn } from '../../styles/theme';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useEarnContext } from './EarnProvider';

export interface EarnProviderSelectorProps {
  className?: string;
}

export function EarnProviderSelector({ className }: EarnProviderSelectorProps) {
  const { provider, setProvider } = useEarnContext();
  
  return (
    <div className={cn('space-y-2', className)} data-testid="earn-provider-selector">
      <label className="text-sm font-medium">Provider</label>
      <Tabs value={provider} onValueChange={(value) => setProvider(value as 'aave' | 'benqi')}>
        <TabsList className="w-full">
          <TabsTrigger value="aave" className="flex-1">
            AAVE
          </TabsTrigger>
          <TabsTrigger value="benqi" className="flex-1">
            Benqi
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

