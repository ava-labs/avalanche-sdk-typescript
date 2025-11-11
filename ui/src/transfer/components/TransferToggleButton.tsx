'use client';
import { useTransferContext } from '../hooks/useTransferContext';
import { DirectionToggle } from '../../components/ui/direction-toggle';
import type { TransferToggleButtonProps } from '../types';

export function TransferToggleButton({
  className,
  disabled = false,
}: TransferToggleButtonProps) {
  const { status, toggleChains } = useTransferContext();

  const isDisabled = disabled || status === 'preparing' || status === 'pending';

  return (
    <DirectionToggle
      className={className}
      disabled={isDisabled}
      onClick={toggleChains}
      data-testid="transfer-toggle-button"
    />
  );
}
