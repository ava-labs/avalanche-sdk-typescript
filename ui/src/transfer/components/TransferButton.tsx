'use client';
import { useTransferContext } from '../hooks/useTransferContext';
import { cn } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { Loader2, Send } from 'lucide-react';
import type { TransferButtonProps } from '../types';

export function TransferButton({
  className,
  text: buttonText = 'Transfer',
  disabled = false,
}: TransferButtonProps) {
  const { status, amount, toAddress, executeTransfer } = useTransferContext();

  const isLoading = status === 'preparing' || status === 'pending';
  const isDisabled = disabled || isLoading || !amount || !toAddress;

  const getButtonText = () => {
    if (status === 'preparing') return 'Preparing...';
    if (status === 'pending') return 'Confirming...';
    return buttonText;
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return <Send className="h-4 w-4" />;
  };

  return (
    <Button
      onClick={executeTransfer}
      disabled={isDisabled}
      size="lg"
      className={cn('w-full', className)}
      data-testid="transfer-button"
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </Button>
  );
}
