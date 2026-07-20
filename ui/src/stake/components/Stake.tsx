'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { WalletConnectionOverlay } from '../../components/ui/wallet-connection-overlay';
import { AvalancheChainOverlay } from '../../components/ui/avalanche-chain-overlay';
import { cn } from '../../styles/theme';
import { StakeProvider } from './StakeProvider';
import { StakeValidatorInput } from './StakeValidatorInput';
import { StakeAmountInput } from './StakeAmountInput';
import { StakeDurationInput } from './StakeDurationInput';
import { StakeButton } from './StakeButton';
import { StakeMessage } from './StakeMessage';
import type { StakeProviderProps } from '../types';

type StakeProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
} & Omit<StakeProviderProps, 'children'>;

function StakeContent() {
  return (
    <div className="flex flex-col gap-6">
      <StakeValidatorInput />
      <StakeAmountInput />
      <StakeDurationInput />
      <StakeMessage />
      <StakeButton />
    </div>
  );
}

export function Stake({
  children,
  className,
  title = "Stake on Primary Network",
  description = "Stake AVAX as a validator on Avalanche's Primary Network to secure the network and earn rewards",
  ...providerProps
}: StakeProps) {
  return (
    <StakeProvider {...providerProps}>
      <Card className={cn('w-full', className)} data-testid="stake">
        <CardHeader>
          <CardTitle className="text-center" data-testid="stake-title">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-center" data-testid="stake-description">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            <AvalancheChainOverlay>
            {children || <StakeContent />}
            </AvalancheChainOverlay>
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </StakeProvider>
  );
}
