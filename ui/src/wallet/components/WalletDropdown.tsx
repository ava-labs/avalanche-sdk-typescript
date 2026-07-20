'use client';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useWalletContext } from '../hooks/useWalletContext';
import { useAvalanche } from '../../AvalancheProvider';
import { cn, text, pressable } from '../../styles/theme';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';
import type { WalletDropdownProps } from '../types';

export function WalletDropdown({
  className,
  showBalance = true,
  showNetwork = true,
  showXPAddresses = false,
}: WalletDropdownProps) {
  const { status, address, disconnect, xAddress, pAddress, balances } = useWalletContext();
  const { chain: currentChain } = useAvalanche();
  const [open, setOpen] = useState(false);

  if (status !== 'connected' || !address) {
    return null;
  }

  // Utility function to abbreviate addresses
  const abbreviateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Utility function to copy address
  const copyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Utility function to open address in explorer
  const openInExplorer = (addr: string, chainType: 'C' | 'X' | 'P' = 'C') => {
    // This would need to be customized based on the explorer URLs for each chain
    const baseUrl = chainType === 'C' 
      ? 'https://snowtrace.io/address/' 
      : `https://explorer.avax.network/address/`;
    window.open(`${baseUrl}${addr}`, '_blank');
  };

  // Component for address row with copy and external link buttons
  const AddressRow = ({ 
    label, 
    addr, 
    chainType = 'C' 
  }: { 
    label: string; 
    addr: string; 
    chainType?: 'C' | 'X' | 'P';
  }) => (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className={cn(text.caption, 'text-muted-foreground mb-1')}>
          {label}
        </div>
        <div className={cn(text.label2, 'font-mono')}>
          {abbreviateAddress(addr)}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => copyAddress(addr)}
          className={cn(
            'p-1 rounded hover:bg-accent transition-colors',
            'text-muted-foreground hover:text-foreground'
          )}
          title="Copy address"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={() => openInExplorer(addr, chainType)}
          className={cn(
            'p-1 rounded hover:bg-accent transition-colors',
            'text-muted-foreground hover:text-foreground'
          )}
          title="View in explorer"
        >
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border',
            pressable.default,
            className,
          )}
          data-testid="wallet-dropdown-trigger"
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className={cn(text.caption, 'text-primary-foreground')}>
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <span className={cn(text.label2, 'font-mono')}>
            {abbreviateAddress(address)}
          </span>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[220px] bg-popover rounded-md border border-border shadow-md p-1',
          )}
          sideOffset={5}
          data-testid="wallet-dropdown-content"
        >
          {/* Account Info */}
          <div className="px-3 py-2 border-b border-border space-y-3">
            <AddressRow label="C-Chain Address" addr={address} chainType="C" />
            {showXPAddresses && xAddress && (
              <AddressRow label="X-Chain Address" addr={xAddress} chainType="X" />
            )}
            {showXPAddresses && pAddress && (
              <AddressRow label="P-Chain Address" addr={pAddress} chainType="P" />
            )}
          </div>

          {/* Balance Info */}
          {showBalance && (
            <div className="px-3 py-2 border-b border-border">
              <div className={cn(text.caption, 'text-muted-foreground mb-1')}>
                Balance
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn(text.label2, 'font-mono')}>
                  {parseFloat(balances.cChain.avax).toFixed(4)} {currentChain.nativeCurrency?.symbol || 'AVAX'}
                </span>
                {balances.cChain.loading && (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          )}

          {/* Network Info */}
          {showNetwork && (
            <div className="px-3 py-2 border-b border-border">
              <div className={cn(text.caption, 'text-muted-foreground mb-1')}>
                Network
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={cn(text.label2)}>{currentChain.name}</span>
              </div>
            </div>
          )}

          {/* Actions */}

          <DropdownMenu.Item asChild>
            <button
              onClick={disconnect}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-left text-destructive',
                'hover:bg-destructive hover:text-destructive-foreground rounded-sm transition-colors',
              )}
              data-testid="wallet-disconnect"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className={cn(text.label2)}>Disconnect</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
