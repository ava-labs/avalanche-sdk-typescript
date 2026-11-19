'use client';
import { useState } from 'react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AddressInput } from '../../components/ui/address-input';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { TransferProvider } from './TransferProvider';
import { TransferAmountInput } from './TransferAmountInput';
import { TransferButton } from './TransferButton';
import { TransferMessage } from './TransferMessage';
import { TransferToast } from './TransferToast';
import { useTransferContext } from '../hooks/useTransferContext';
import type { TransferProviderProps } from '../types';
import type { AddressValidationResult, ChainType } from '../../utils/addressValidation';

type TransferProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
} & Omit<TransferProviderProps, 'children'>;

function TransferAddressInput() {
  const { setToAddress, fromChain } = useTransferContext();
  const [address, setAddress] = useState('');

  const handleAddressChange = (value: string, _validation: AddressValidationResult) => {
    setAddress(value);
    setToAddress(value);
    // Note: _validation.isValid can be used for form validation in the future
  };

  // Convert TransferChain to ChainType for validation
  const chainType: ChainType = fromChain as ChainType;

  return (
    <AddressInput
      label="Destination Address"
      chainType={chainType}
      value={address}
      onChange={handleAddressChange}
      data-testid="transfer-address-input"
    />
  );
}

function SingleChainTransferContent() {
  return (
    <div className="flex flex-col gap-6">
      <TransferMessage />

      <TransferAmountInput />

      <TransferAddressInput />

      <TransferButton />
      
      <TransferToast />
    </div>
  );
}

export function Transfer({
  children,
  className,
  title = 'Transfer',
  initialFromChain = 'C', // Default to C-Chain for single-chain transfers
  initialToChain = 'C',   // Same chain for single-chain transfers
  onStatusChange,
  onError,
  onSuccess,
}: TransferProps) {
  return (
    <TransferProvider
      initialFromChain={initialFromChain}
      initialToChain={initialToChain}
      onStatusChange={onStatusChange}
      onError={onError}
      onSuccess={onSuccess}
    >
      <WalletConnectionOverlay>
        <Card
          className={cn('w-full', className)}
          data-testid="transfer"
        >
          <CardHeader>
            <CardTitle className="text-center" data-testid="transfer-title">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {children || <SingleChainTransferContent />}
          </CardContent>
        </Card>
      </WalletConnectionOverlay>
    </TransferProvider>
  );
}