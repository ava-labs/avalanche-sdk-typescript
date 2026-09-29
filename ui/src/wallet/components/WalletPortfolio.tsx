'use client';
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useWalletContext } from '../hooks/useWalletContext';
import { useErc20Balances } from '../../glacier/wallet/useErc20Balances';
import { useNativeBalance } from '../../glacier/wallet/useNativeBalance';
import { useAvalanche } from '../../AvalancheProvider';
import { cn, text } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { RefreshCw, Loader2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WalletPortfolioProps } from '../types';
import { formatUnits } from 'viem';
import { TokenRow } from '../../token/components/TokenRow';
import type { Token } from '../../token/types';
import { buildExplorerUrl, openExplorer } from '../../utils/explorer';

const DEFAULT_ITEMS_PER_PAGE = 10;

export interface WalletPortfolioRef {
  refresh: () => Promise<void>;
}

export const WalletPortfolio = forwardRef<WalletPortfolioRef, WalletPortfolioProps>(function WalletPortfolio({
  className,
  showUSD = true,
  showRefresh = true,
  maxItems,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  contractAddresses,
  blockNumber,
}, ref) {
  const { status, address } = useWalletContext();
  const { chain } = useAvalanche();
  const [currentPage, setCurrentPage] = useState(1);

  const { balance: nativeBalance, loading: nativeLoading, refresh: refreshNative } = useNativeBalance({
    blockNumber,
    autoFetch: true,
  });

  const { balances, loading, error, refresh: fetchBalances } = useErc20Balances({
    blockNumber,
    contractAddresses,
    filterZeroBalances: true,
    sortByValue: true,
    autoFetch: true,
  });

  // Expose refresh method via ref
  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await Promise.all([fetchBalances(), refreshNative()]);
    },
  }), [fetchBalances, refreshNative]);

  // Convert native balance to Token type
  const nativeToken = useMemo<Token | null>(() => {
    if (!nativeBalance) return null;
    return {
      address: '', // Native token has no address
      chainId: chain.id,
      decimals: nativeBalance.decimals,
      image: nativeBalance.logoUri || null,
      name: nativeBalance.name,
      symbol: nativeBalance.symbol,
    };
  }, [nativeBalance, chain.id]);

  // Convert Erc20TokenBalance to Token type
  const tokens = useMemo<Token[]>(() => {
    return balances.map((balance) => ({
      address: balance.address,
      chainId: chain.id,
      decimals: balance.decimals,
      image: balance.logoUri || null,
      name: balance.name,
      symbol: balance.symbol,
    }));
  }, [balances, chain.id]);

  // Pagination logic - include native token in count
  const hasNativeToken = !!nativeBalance;
  const totalItems = useMemo(() => {
    const erc20Count = maxItems ? Math.min(balances.length, maxItems) : balances.length;
    return erc20Count + (hasNativeToken ? 1 : 0);
  }, [balances.length, maxItems, hasNativeToken]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // Determine if native token should be shown on current page
  const showNativeTokenOnPage = useMemo(() => {
    if (!hasNativeToken) return false;
    // Native token is always on page 1 (index 0)
    return currentPage === 1;
  }, [hasNativeToken, currentPage]);

  // Calculate how many ERC-20 tokens to show on current page
  const displayedBalances = useMemo(() => {
    const balancesToShow = maxItems ? balances.slice(0, maxItems) : balances;
    
    if (showNativeTokenOnPage) {
      // If showing native token, reduce ERC-20 tokens by 1
      const erc20ItemsPerPage = itemsPerPage - 1;
      const startIndex = (currentPage - 1) * erc20ItemsPerPage;
      const endIndex = startIndex + erc20ItemsPerPage;
      return balancesToShow.slice(startIndex, endIndex);
    } else {
      // If not showing native token, adjust start index to account for native token
      const erc20ItemsPerPage = itemsPerPage - 1; // First page had one less ERC-20 token
      const startIndex = erc20ItemsPerPage + (currentPage - 2) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return balancesToShow.slice(startIndex, endIndex);
    }
  }, [balances, currentPage, maxItems, itemsPerPage, showNativeTokenOnPage]);

  const displayedTokens = useMemo(() => {
    const tokensToShow = maxItems ? tokens.slice(0, maxItems) : tokens;
    // Match the displayed balances indices
    if (displayedBalances.length === 0) return [];
    const balancesToShow = maxItems ? balances.slice(0, maxItems) : balances;
    const startIndex = balancesToShow.findIndex(b => b.address === displayedBalances[0].address);
    if (startIndex === -1) return [];
    const endIndex = startIndex + displayedBalances.length;
    return tokensToShow.slice(startIndex, endIndex);
  }, [tokens, displayedBalances, balances, maxItems]);

  const totalUSDValue = useMemo(() => {
    const erc20Value = balances.reduce((sum, balance) => {
      return sum + (balance.balanceValue?.value || 0);
    }, 0);
    const nativeValue = nativeBalance?.balanceValue?.value || 0;
    return erc20Value + nativeValue;
  }, [balances, nativeBalance]);

  // Reset to page 1 when balances change
  useEffect(() => {
    setCurrentPage(1);
  }, [balances.length, hasNativeToken]);

  if (status !== 'connected' || !address) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} data-testid="wallet-portfolio">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn(text.label1, 'text-foreground mb-1')}>
            Token Portfolio
          </h3>
          {showUSD && totalUSDValue > 0 && (
            <p className={cn(text.caption, 'text-muted-foreground')}>
              Total Value: ${totalUSDValue.toFixed(2)} USD
            </p>
          )}
        </div>
        {showRefresh && (
          <Button
            onClick={() => {
              fetchBalances();
              refreshNative();
            }}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={loading || nativeLoading}
            title="Refresh balances"
          >
            {(loading || nativeLoading) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className={cn(text.caption, 'text-destructive')}>{error}</p>
        </div>
      )}

      {(loading || nativeLoading) && balances.length === 0 && !nativeBalance ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayedBalances.length === 0 && !nativeBalance ? (
        <div className="text-center py-8">
          <p className={cn(text.caption, 'text-muted-foreground')}>
            No token balances found
          </p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="border-b border-border pb-2">
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <div className={cn(text.caption, 'text-muted-foreground font-medium')}>
                Token
              </div>
              <div className={cn(text.caption, 'text-muted-foreground font-medium text-right')}>
                Actions
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {/* Native Token Balance - Shown on first page only */}
            {showNativeTokenOnPage && nativeToken && nativeBalance && (
              <div>
                <div
                  className={cn(
                    "grid grid-cols-[1fr_auto] gap-4 items-center hover:bg-accent/50 transition-colors group",
                    displayedBalances.length === 0 ? "pb-0" : "pb-2"
                  )}
                >
                  <TokenRow
                    token={nativeToken}
                    amount={formatUnits(BigInt(nativeBalance.balance), nativeBalance.decimals)}
                    value={showUSD && nativeBalance.balanceValue?.value ? nativeBalance.balanceValue.value : undefined}
                    isNative={true}
                    variant="ghost"
                    hideSymbol={false}
                    onClick={() => {
                      openExplorer(chain, { type: 'address', value: address });
                    }}
                    className="flex-1 min-w-0 -mx-2"
                    as="div"
                  />
                  <div className="flex items-center justify-end">
                    <a
                      href={buildExplorerUrl(chain, { type: 'address', value: address })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                {displayedBalances.length > 0 && (
                  <div className="h-px bg-border" />
                )}
              </div>
            )}

            {/* ERC-20 Token Balances */}
            {displayedBalances.map((balance, index) => {
              const formattedAmount = formatUnits(BigInt(balance.balance), balance.decimals);
              const usdValue = balance.balanceValue?.value || 0;
              const token = displayedTokens[index];
              const isLast = index === displayedBalances.length - 1;
              const isFirst = index === 0;

              return (
                <div key={balance.address}>
                  <div
                    className={cn(
                      "grid grid-cols-[1fr_auto] gap-4 items-center hover:bg-accent/50 transition-colors group",
                      isFirst && !isLast ? "pb-2" : 
                      isLast && !isFirst ? "pt-2 pb-0" : 
                      isFirst && isLast ? "pb-0" : 
                      "py-2"
                    )}
                  >
                    {/* Token Info with Amount and Value */}
                    <TokenRow
                      token={token}
                      amount={formattedAmount}
                      value={showUSD && usdValue > 0 ? usdValue : undefined}
                      reputation={balance.tokenReputation}
                      variant="ghost"
                      hideSymbol={false}
                      onClick={(t) => {
                        openExplorer(chain, { type: 'token', value: t.address });
                      }}
                      className="flex-1 min-w-0 -mx-2"
                      as="div"
                    />

                    {/* Actions Column */}
                    <div className="flex items-center justify-end">
                      <a
                        href={buildExplorerUrl(chain, { type: 'token', value: balance.address })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        title="View on explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="h-px bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className={cn(text.caption, 'text-muted-foreground')}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} token{totalItems !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className={cn(text.caption, 'text-foreground min-w-[60px] text-center')}>
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

