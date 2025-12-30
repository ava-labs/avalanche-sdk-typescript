import React from 'react';
import { ICTTProvider, useICTTContext, ICTTTokenModeToggle, ICTTAmountInput, ICTTButtons, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@avalanche-sdk/ui';
import { useAvalanche } from '@avalanche-sdk/ui';
import { useWalletContext } from '@avalanche-sdk/ui';
import { echo } from '../chains/echo';
import { dispatch } from '../chains/dispatch';

// Internal component that uses the ICTT context
function SimpleICTTContent() {
  const { fromChain, toChain, setFromChain, setToChain, setRecipientAddress } = useICTTContext();
  const { availableChains } = useAvalanche();
  const { address } = useWalletContext();

  // Set chains on mount
  React.useEffect(() => {
    // Set chain IDs as strings (ICTTChain type is string)
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
    <div className="flex flex-col gap-6">
      {/* Display selected chains */}
      <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          {fromChainData?.iconUrl && (
            <img 
              src={(fromChainData as any).iconUrl} 
              alt={fromChainData.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <Badge variant="outline" className="font-mono">
            {fromChainData?.name || 'Echo L1'}
          </Badge>
          <span className="text-muted-foreground">→</span>
          {toChainData?.iconUrl && (
            <img 
              src={(toChainData as any).iconUrl} 
              alt={toChainData.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <Badge variant="outline" className="font-mono">
            {toChainData?.name || 'Dispatch L1'}
          </Badge>
        </div>
      </div>

      {/* Token mode toggle - manual mode disabled */}
      <ICTTTokenModeToggle allowManualMode={false} />

      <ICTTAmountInput />

      {/* Recipient address automatically set to current wallet address - input hidden */}

      <ICTTButtons />
    </div>
  );
}

// Custom Simple ICTT Component using ICTTProvider
export function SimpleICTT() {
  return (
    <ICTTProvider
      onSuccess={(result) => {
        console.log('ICTT transfer successful:', result);
      }}
      onError={(error) => {
        console.error('ICTT transfer error:', error);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Bridge</CardTitle>
          <CardDescription>Transfer tokens from Echo L1 to Dispatch L1</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleICTTContent />
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}

// Quick variation without amount input and token already selected
function SimpleICTTQuickContent() {
  const { fromChain, toChain, setFromChain, setToChain, setRecipientAddress, setSelectedToken, setAmount, availableTokens } = useICTTContext();
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

  // Auto-select first available token and set amount
  React.useEffect(() => {
    if (availableTokens && availableTokens.length > 0) {
      setSelectedToken(availableTokens[0]);
      setAmount('1'); // Set a default amount
    }
  }, [availableTokens, setSelectedToken, setAmount]);

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
    <div className="flex flex-col gap-6">
      {/* Display selected chains */}
      <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          {fromChainData?.iconUrl && (
            <img 
              src={(fromChainData as any).iconUrl} 
              alt={fromChainData.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <Badge variant="outline" className="font-mono">
            {fromChainData?.name || 'Echo L1'}
          </Badge>
          <span className="text-muted-foreground">→</span>
          {toChainData?.iconUrl && (
            <img 
              src={(toChainData as any).iconUrl} 
              alt={toChainData.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <Badge variant="outline" className="font-mono">
            {toChainData?.name || 'Dispatch L1'}
          </Badge>
        </div>
      </div>

      {/* Token and amount are auto-set, only show buttons */}
      <ICTTButtons />
    </div>
  );
}

// Quick ICTT Component with token already selected
export function SimpleICTTQuick() {
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
          <CardTitle>Instant Bridge</CardTitle>
          <CardDescription>One-click token bridge from Echo L1 to Dispatch L1</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleICTTQuickContent />
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}

