import React from 'react';
import { ICTTProvider, useICTTContext, ICTTTokenModeToggle, ICTTAmountInput, ICTTButtons, Card, CardContent, CardDescription, CardHeader, CardTitle, TokenChip, WalletConnectionOverlay, AvalancheChainOverlay, ChainLogo } from '@avalanche-sdk/ui';
import { useAvalanche } from '@avalanche-sdk/ui';
import { useWalletContext } from '@avalanche-sdk/ui';
import { echo } from '../chains/echo';
import { dispatch } from '../chains/dispatch';

// Internal component that uses the ICTT context
function SimpleICTT1Content() {
  const { fromChain, toChain, setFromChain, setToChain, setRecipientAddress, selectedToken } = useICTTContext();
  const { availableChains } = useAvalanche();
  const { address } = useWalletContext();

  // Set chains on mount
  React.useEffect(() => {
    setFromChain(echo.id.toString());
    setToChain(dispatch.id.toString());
  }, [setFromChain, setToChain]);

  // Auto-set recipient address to current wallet address
  React.useEffect(() => {
    if (address) {
      setRecipientAddress(address);
    }
  }, [address, setRecipientAddress]);

  // Get chain objects from IDs for display
  const fromChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === fromChain),
    [availableChains, fromChain]
  );
  
  const toChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === toChain),
    [availableChains, toChain]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Clean, minimal transfer preview */}
      <div className="flex items-center justify-between py-4 rounded-xl bg-muted/30">
        {/* From Chain */}
        <div className="flex items-center gap-3">
          {fromChainData && (
            <ChainLogo 
              chain={fromChainData}
              size={32}
              showLabel={false}
            />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="text-sm font-medium">{fromChainData?.name || 'Echo L1'}</span>
          </div>
        </div>

        {/* Arrow */}
        <svg 
          className="w-5 h-5 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>

        {/* To Chain */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground">To</span>
            <span className="text-sm font-medium">{toChainData?.name || 'Dispatch L1'}</span>
          </div>
          {toChainData && (
            <ChainLogo 
              chain={toChainData}
              size={32}
              showLabel={false}
            />
          )}
        </div>
      </div>

      {/* Token mode toggle - manual mode disabled */}
      <ICTTTokenModeToggle allowManualMode={false} />

      <ICTTAmountInput />

      <ICTTButtons />
    </div>
  );
}

// SimpleICTT1: Full featured with token chip display
export function SimpleICTT1() {
  return (
    <ICTTProvider
      onSuccess={(result) => {
        console.log('ICTT transfer successful:', result);
      }}
      onError={(error) => {
        console.error('ICTT transfer error:', error);
      }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quick Bridge</CardTitle>
          <CardDescription>Transfer tokens from Echo L1 to Dispatch L1</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            <SimpleICTT1Content />
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}

