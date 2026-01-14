'use client';
import { useICTTContext } from './ICTTProvider';
import { DirectionToggle } from '../../components/ui/direction-toggle';

export interface ICTTToggleButtonProps {
  className?: string;
  disabled?: boolean;
}

export function ICTTToggleButton({
  className,
  disabled = false,
}: ICTTToggleButtonProps) {
  const { status, swapChains } = useICTTContext();

  const isDisabled = disabled || status === 'loading';

  return (
    <DirectionToggle
      className={className}
      disabled={isDisabled}
      onClick={swapChains}
      data-testid="ictt-toggle-button"
    />
  );
}
