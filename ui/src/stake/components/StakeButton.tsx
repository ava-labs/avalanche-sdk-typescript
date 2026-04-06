'use client';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../styles/theme';
import { useStakeContext } from './StakeProvider';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type { StakeButtonProps } from '../types';

export function StakeButton({
  className,
  children,
  disabled = false,
  loadingText = "Processing transaction...",
}: StakeButtonProps) {
  const { status, submitStake, isTestnet, isFormValid } = useStakeContext();
  const { address } = useWalletContext();

  const isLoading = status === 'preparing' || status === 'pending';
  const isDisabled = disabled || !address || isLoading || !isFormValid;
  const networkName = isTestnet ? 'Fuji' : 'Mainnet';

  const getButtonText = () => {
    if (isLoading) return loadingText;
    if (children) return children;
    return `Stake ${networkName} Validator`;
  };

  return (
    <Button
      onClick={submitStake}
      disabled={isDisabled}
      variant="default"
      size="lg"
      className={cn('w-full', className)}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {getButtonText()}
    </Button>
  );
}
