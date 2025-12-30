'use client';

import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn, text } from '../../styles/theme';
import type { TokenChipProps } from '../types';
import { TokenImage } from './TokenImage';

/**
 * Small button that displays a given token symbol and image.
 */
export function TokenChip({
  token,
  onClick,
  className,
  isPressable = true,
}: TokenChipProps) {
  if (!isPressable) {
    // Non-interactive badge variant
    return (
      <Badge
        variant="secondary"
        className={cn(
          'flex w-fit shrink-0 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 cursor-default h-auto',
          className,
        )}
      >
        <TokenImage token={token} size={28} />
        <span className={cn(text.label1, 'font-semibold')}>{token.symbol}</span>
      </Badge>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      data-testid="tokenChip_Button"
      className={cn(
        'flex w-fit shrink-0 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 h-auto hover:bg-accent',
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      <TokenImage token={token} size={28} />
      <span className={cn(text.label1, 'font-semibold')}>{token.symbol}</span>
    </Button>
  );
}

