'use client';
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useWalletContext } from '../hooks/useWalletContext';
import { useTransactions } from '../../glacier/wallet/useTransactions';
import { useAvalanche } from '../../AvalancheProvider';
import { cn, text } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { RefreshCw, Loader2, ExternalLink, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { WalletTransactionsProps } from '../types';
import { formatUnits } from 'viem';
import { TokenChip } from '../../token/components/TokenChip';
import type { Token } from '../../token/types';
import type { TransactionDetails, Erc20TransferDetails } from '@avalanche-sdk/chainkit/models/components';
import { formatRelativeTime, abbreviateAddress, buildExplorerUrl } from '../../utils';

const DEFAULT_ITEMS_PER_PAGE = 10;

export interface WalletTransactionsRef {
  refresh: () => Promise<void>;
}

export const WalletTransactions = forwardRef<WalletTransactionsRef, WalletTransactionsProps>(function WalletTransactions({
  className,
  showRefresh = true,
  maxItems,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  startBlock,
  endBlock,
  sortOrder = 'desc',
}, ref) {
  const { status, address } = useWalletContext();
  const { chain } = useAvalanche();
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions, loading, error, refresh: fetchTransactions } = useTransactions({
    startBlock,
    endBlock,
    sortOrder,
    maxItems,
    autoFetch: true,
  });

  // Expose refresh method via ref
  useImperativeHandle(ref, () => ({
    refresh: fetchTransactions,
  }), [fetchTransactions]);

  // Pagination logic
  const totalPages = useMemo(() => {
    const total = maxItems ? Math.min(transactions.length, maxItems) : transactions.length;
    return Math.ceil(total / itemsPerPage);
  }, [transactions.length, maxItems, itemsPerPage]);

  const displayedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const transactionsToShow = maxItems ? transactions.slice(0, maxItems) : transactions;
    return transactionsToShow.slice(startIndex, endIndex);
  }, [transactions, currentPage, maxItems, itemsPerPage]);


  // Reset to page 1 when transactions change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length]);

  // Helper function to determine if address is sender or receiver
  const getTransactionDirection = (tx: TransactionDetails, address: string) => {
    const nativeTx = tx.nativeTransaction;
    const addressLower = address.toLowerCase();
    const isSender = nativeTx.from?.address?.toLowerCase() === addressLower;
    const isReceiver = nativeTx.to?.address?.toLowerCase() === addressLower;
    
    if (isSender && isReceiver) return 'self';
    if (isSender) return 'out';
    if (isReceiver) return 'in';
    return 'unknown';
  };

  // Helper function to extract input/output tokens with amounts from transaction
  const getTransactionTokens = (tx: TransactionDetails, address: string): { 
    input: Array<{ token: Token; amount: string }>; 
    output: Array<{ token: Token; amount: string }> 
  } => {
    const input: Array<{ token: Token; amount: string }> = [];
    const output: Array<{ token: Token; amount: string }> = [];
    const addressLower = address.toLowerCase();

    // Process ERC-20 transfers
    if (tx.erc20Transfers) {
      tx.erc20Transfers.forEach((transfer: Erc20TransferDetails) => {
        const fromLower = transfer.from?.address?.toLowerCase();
        const toLower = transfer.to?.address?.toLowerCase();
        
        if (transfer.erc20Token) {
          const token: Token = {
            address: transfer.erc20Token.address,
            chainId: chain.id,
            decimals: transfer.erc20Token.decimals,
            image: transfer.erc20Token.logoUri || null,
            name: transfer.erc20Token.name,
            symbol: transfer.erc20Token.symbol,
          };

          const amount = formatUnits(BigInt(transfer.value || '0'), transfer.erc20Token.decimals);

          if (fromLower === addressLower) {
            // Token sent out
            input.push({ token, amount });
          } else if (toLower === addressLower) {
            // Token received
            output.push({ token, amount });
          }
        }
      });
    }

    // Process native transaction
    const nativeTx = tx.nativeTransaction;
    const nativeValue = nativeTx.value ? BigInt(nativeTx.value) : BigInt(0);
    if (nativeValue > 0) {
      // Get chain iconUrl if available
      const chainIconUrl = (chain as any)?.iconUrl || null;
      
      const nativeToken: Token = {
        address: '',
        chainId: chain.id,
        decimals: 18,
        image: chainIconUrl,
        name: chain.nativeCurrency?.name || 'Native',
        symbol: chain.nativeCurrency?.symbol || 'AVAX',
      };

      const fromLower = nativeTx.from?.address?.toLowerCase();
      const toLower = nativeTx.to?.address?.toLowerCase();
      const amount = formatUnits(nativeValue, 18);

      if (fromLower === addressLower && toLower !== addressLower) {
        input.push({ token: nativeToken, amount });
      } else if (toLower === addressLower && fromLower !== addressLower) {
        output.push({ token: nativeToken, amount });
      }
    }

    return { input, output };
  };



  if (status !== 'connected' || !address) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} data-testid="wallet-transactions">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn(text.label1, 'text-foreground mb-1')}>
            Transaction History
          </h3>
          <p className={cn(text.caption, 'text-muted-foreground')}>
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        {showRefresh && (
          <Button
            onClick={fetchTransactions}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={loading}
            title="Refresh transactions"
          >
            {loading ? (
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

      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className={cn(text.caption, 'text-muted-foreground')}>
            No transactions found
          </p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="border-b border-border pb-2">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
              <div className={cn(text.caption, 'text-muted-foreground font-medium')}>
                Type
              </div>
              <div className={cn(text.caption, 'text-muted-foreground font-medium')}>
                Transaction
              </div>
              <div className={cn(text.caption, 'text-muted-foreground font-medium text-right')}>
                Actions
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {displayedTransactions.map((tx, index) => {
              const direction = getTransactionDirection(tx, address);
              const { input, output } = getTransactionTokens(tx, address);
              const nativeTx = tx.nativeTransaction;
              const isLast = index === displayedTransactions.length - 1;
              const isFirst = index === 0;

              return (
                <div key={nativeTx.txHash}>
                  <div
                    className={cn(
                      "grid grid-cols-[auto_1fr_auto] gap-4 items-center hover:bg-accent/50 transition-colors group",
                      isFirst && !isLast ? "pb-2" : 
                      isLast && !isFirst ? "pt-2 pb-0" : 
                      isFirst && isLast ? "pb-0" : 
                      "py-2"
                    )}
                  >
                    {/* Direction Icon */}
                    <div className="flex items-center justify-center w-10 h-10">
                      {direction === 'out' ? (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      ) : direction === 'in' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      )}
                    </div>

                    {/* Transaction Info */}
                    <div className="flex flex-col gap-2 min-w-0">
                      {/* Tokens with Amounts */}
                      <div className="flex flex-wrap items-center gap-2">
                        {input.length > 0 && (
                          <>
                            {input.map((item, idx) => (
                              <div key={`input-${idx}`} className="flex items-center gap-1.5">
                                <TokenChip
                                  token={item.token}
                                  isPressable={false}
                                  className="text-xs"
                                />
                                <span className={cn(text.caption, 'text-muted-foreground font-mono')}>
                                  {parseFloat(item.amount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                  })}
                                </span>
                              </div>
                            ))}
                            <span className={cn(text.caption, 'text-muted-foreground')}>→</span>
                          </>
                        )}
                        {output.length > 0 ? (
                          output.map((item, idx) => (
                            <div key={`output-${idx}`} className="flex items-center gap-1.5">
                              <TokenChip
                                token={item.token}
                                isPressable={false}
                                className="text-xs"
                              />
                              <span className={cn(text.caption, 'text-muted-foreground font-mono')}>
                                {parseFloat(item.amount).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className={cn(text.caption, 'text-muted-foreground')}>
                            {abbreviateAddress(nativeTx.to?.address || '')}
                          </span>
                        )}
                      </div>

                      {/* Transaction Details */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(text.legal, 'text-muted-foreground font-mono')}>
                            {nativeTx.blockNumber}
                          </span>
                          <span className={cn(text.legal, 'text-muted-foreground')}>
                            •
                          </span>
                          <span className={cn(text.legal, 'text-muted-foreground font-mono')}>
                            {abbreviateAddress(nativeTx.txHash)}
                          </span>
                          <span className={cn(text.legal, 'text-muted-foreground')}>
                            •
                          </span>
                          <span className={cn(text.legal, 'text-muted-foreground')}>
                            {formatRelativeTime(nativeTx.blockTimestamp)}
                          </span>
                          {nativeTx.gasUsed && (
                            <>
                              <span className={cn(text.legal, 'text-muted-foreground')}>
                                •
                              </span>
                              <span className={cn(text.legal, 'text-muted-foreground')}>
                                Gas: {parseInt(nativeTx.gasUsed).toLocaleString()}
                              </span>
                            </>
                          )}
                          {nativeTx.gasUsed && nativeTx.gasPrice && (() => {
                            const gasFeeWei = BigInt(nativeTx.gasUsed) * BigInt(nativeTx.gasPrice);
                            const gasFeeFormatted = formatUnits(gasFeeWei, 18);
                            const gasFeeNumber = parseFloat(gasFeeFormatted);
                            return (
                              <>
                                <span className={cn(text.legal, 'text-muted-foreground')}>
                                  •
                                </span>
                                <span className={cn(text.legal, 'text-muted-foreground font-mono')}>
                                  Fee: {gasFeeNumber.toLocaleString(undefined, {
                                    minimumFractionDigits: 6,
                                    maximumFractionDigits: 6,
                                  })} {chain.nativeCurrency?.symbol || 'AVAX'}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center justify-end">
                      <a
                        href={buildExplorerUrl(chain, { type: 'tx', value: nativeTx.txHash })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, maxItems ? Math.min(transactions.length, maxItems) : transactions.length)} of {maxItems ? Math.min(transactions.length, maxItems) : transactions.length} transactions
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

