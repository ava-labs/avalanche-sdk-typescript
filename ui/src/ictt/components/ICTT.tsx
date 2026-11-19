'use client';
import React from 'react';
import { cn } from '../../styles/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { ICTTProvider } from './ICTTProvider';
import { ICTTChainSelector } from './ICTTChainSelector';
import { ICTTToggleButton } from './ICTTToggleButton';
import { ICTTTokenModeToggle } from './ICTTTokenModeToggle';
import { ICTTAmountInput } from './ICTTAmountInput';
import { ICTTAddressInput } from './ICTTAddressInput';
import { ICTTButtons } from './ICTTButtons';
import type { ICTTProviderProps } from '../types';

type ICTTProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  allowManualMode?: boolean;
} & Omit<ICTTProviderProps, 'children'>;

function ICTTContent({ allowManualMode }: { allowManualMode?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <ICTTChainSelector type="from" />
        
        <ICTTToggleButton />
        
        <ICTTChainSelector type="to" />
      </div>

      <ICTTTokenModeToggle allowManualMode={allowManualMode} />

      <ICTTAmountInput />

      <ICTTAddressInput />

      <ICTTButtons />
    </div>
  );
}

export function ICTT({
  children,
  className,
  title = "Interchain Token Transfer",
  allowManualMode,
  ...providerProps
}: ICTTProps) {
  return (
    <ICTTProvider {...providerProps}>
      <Card className={cn('w-full', className)} data-testid="ictt">
        <CardHeader>
          <CardTitle className="text-center" data-testid="ictt-title">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            {children || <ICTTContent allowManualMode={allowManualMode} />}
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}