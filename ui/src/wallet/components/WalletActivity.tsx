'use client';
import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { WalletPortfolio, type WalletPortfolioRef } from './WalletPortfolio';
import { WalletTransactions, type WalletTransactionsRef } from './WalletTransactions';
import { Button } from '../../components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import type { WalletActivityProps } from '../types';

export function WalletActivity({
  className,
  portfolioProps,
  transactionsProps,
  defaultTab = 'portfolio',
  showRefresh = true,
  itemsPerPage,
}: WalletActivityProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [refreshing, setRefreshing] = useState(false);
  const portfolioRef = useRef<WalletPortfolioRef>(null);
  const transactionsRef = useRef<WalletTransactionsRef>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        portfolioRef.current?.refresh(),
        transactionsRef.current?.refresh(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className={className} data-testid="wallet-activity">
      <div className="flex items-center justify-between mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
        </Tabs>
        {showRefresh && (
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            className="h-10 w-10 ml-4"
            disabled={refreshing}
            title="Refresh all"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="portfolio" className="mt-0">
          <WalletPortfolio 
            {...portfolioProps} 
            itemsPerPage={itemsPerPage}
            ref={portfolioRef} 
            showRefresh={false} 
          />
        </TabsContent>
        <TabsContent value="transactions" className="mt-0">
          <WalletTransactions 
            {...transactionsProps} 
            itemsPerPage={itemsPerPage}
            ref={transactionsRef} 
            showRefresh={false} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

