'use client';

import { memo } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn, pressable, text } from '../../styles/theme';
import type { TokenRowProps } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { TokenImage } from './TokenImage';
import { AlertTriangle, ShieldCheck, Coins } from 'lucide-react';

/**
 * TokenRow component for displaying a token in a list format
 */
export const TokenRow = memo(function TokenRow({
  className,
  token,
  amount,
  value,
  reputation,
  isNative = false,
  variant = 'ghost',
  onClick,
  hideImage,
  hideSymbol,
  as,
}: TokenRowProps) {
  const Component = as ?? Button;

  // When using a div (as="div"), we need to apply variant styles manually
  const variantStyles = variant === 'outline' 
    ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md'
    : variant === 'default'
    ? 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md'
    : 'hover:bg-accent hover:text-accent-foreground rounded-md'; // Ghost variant: no background, but has hover effects

  // For ghost variant with div, apply cursor-pointer and hover effects, but not bg-background
  const pressableStyles = as && variant === 'ghost' 
    ? 'cursor-pointer' 
    : as 
    ? pressable.default 
    : undefined;

  return (
    <Component
      type="button"
      variant={as ? undefined : variant}
      data-testid="tokenRow_Container"
      className={cn(
        pressableStyles,
        as ? variantStyles : undefined,
        'flex w-full items-center justify-between h-auto',
        as && !className?.includes('py-') ? 'px-2 py-3' : undefined, // Add padding when using div, unless className overrides
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      <span className="flex max-w-full items-center gap-3">
        {!hideImage && <TokenImage token={token} size={32} />}
        <span className="flex min-w-0 flex-col items-start">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                text.label2,
                'max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left font-semibold',
              )}
            >
              {token.name.trim()}
            </span>
            {isNative && (
              <Badge variant="default" className="text-xs h-5 px-1.5 flex items-center gap-1">
                <Coins className="h-3 w-3" />
              </Badge>
            )}
            {reputation === 'Malicious' && (
              <Badge variant="warning" className="text-xs h-5 px-1.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
              </Badge>
            )}
            {reputation === 'Benign' && (
              <Badge variant="success" className="text-xs h-5 px-1.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
              </Badge>
            )}
          </span>
          {!hideSymbol && (
            <span className={cn(text.legal, 'text-muted-foreground')}>
              {token.symbol}
            </span>
          )}
        </span>
      </span>
      {(amount !== undefined || value !== undefined) && (
        <span className="flex flex-col items-end">
      {amount !== undefined && (
        <span
          data-testid="tokenRow_Amount"
          className={cn(text.label2, 'text-muted-foreground')}
        >
          {formatAmount(amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
          })}
            </span>
          )}
          {value !== undefined && (
            <span
              data-testid="tokenRow_Value"
              className={cn(text.legal, 'text-muted-foreground')}
            >
              {typeof value === 'number' 
                ? `$${value.toFixed(2)}` 
                : value}
            </span>
          )}
        </span>
      )}
    </Component>
  );
});

