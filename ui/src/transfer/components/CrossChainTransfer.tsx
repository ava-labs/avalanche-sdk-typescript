'use client';
import { cn, text } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { AvalancheChainOverlay } from '../../components/ui/avalanche-chain-overlay';
import { TransferProvider } from './TransferProvider';
import { TransferAmountInput } from './TransferAmountInput';
import { TransferChainSelector } from './TransferChainSelector';
import { TransferButton } from './TransferButton';
import { TransferMessage } from './TransferMessage';
import { TransferToast } from './TransferToast';
import { TransferToggleButton } from './TransferToggleButton';
import { useTransferContext } from '../hooks/useTransferContext';
import type { TransferProviderProps } from '../types';

type CrossChainTransferProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
} & Omit<TransferProviderProps, 'children'>;

function TransferAddressInput() {
  const { toAddress, toChain } = useTransferContext();

  const isDisabled = true; // Always disabled - auto-derived
  
  const getPlaceholder = () => {
    if (toChain === 'C') return 'Auto-derived C-Chain address';
    return `Auto-derived ${toChain}-Chain address`;
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={toAddress}
        placeholder={getPlaceholder()}
        disabled={isDisabled}
        className="font-mono pr-16"
        data-testid="transfer-address-input"
        readOnly
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <span className={cn(text.legal, 'text-foreground-muted')}>
          Auto
        </span>
      </div>
    </div>
  );
}

function CrossChainTransferContent() {
  return (
    <div className="flex flex-col gap-6">
      <TransferMessage />
      
      <div className="flex flex-col gap-4">
        <TransferChainSelector type="from" />
        
        <TransferToggleButton />
        
        <TransferChainSelector type="to" />
      </div>

      <TransferAmountInput />

      <div className="flex flex-col gap-2">
        <Label htmlFor="destination-address">
          Destination Address 
          <span className={cn(text.legal, 'text-foreground-muted ml-2')}>
            (Auto-derived)
          </span>
        </Label>
        <TransferAddressInput />
      </div>

      <TransferButton />
      
      <TransferToast />
    </div>
  );
}

export function CrossChainTransfer({
  children,
  className,
  title = 'Cross-Chain Transfer',
  initialFromChain,
  initialToChain,
  onStatusChange,
  onError,
  onSuccess,
}: CrossChainTransferProps) {
  return (
    <TransferProvider
      initialFromChain={initialFromChain}
      initialToChain={initialToChain}
      onStatusChange={onStatusChange}
      onError={onError}
      onSuccess={onSuccess}
    >
      <WalletConnectionOverlay>
        <AvalancheChainOverlay>
        <Card
          className={cn('w-full', className)}
          data-testid="cross-chain-transfer"
        >
          <CardHeader>
            <CardTitle className="text-center" data-testid="cross-chain-transfer-title">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {children || <CrossChainTransferContent />}
          </CardContent>
        </Card>
        </AvalancheChainOverlay>
      </WalletConnectionOverlay>
    </TransferProvider>
  );
}
