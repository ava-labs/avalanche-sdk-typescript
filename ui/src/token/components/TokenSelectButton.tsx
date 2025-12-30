'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn, text } from '../../styles/theme';
import type { TokenSelectButtonProps } from '../types';
import { TokenImage } from './TokenImage';

/**
 * TokenSelectButton - trigger button for token selection
 */
export const TokenSelectButton = forwardRef<HTMLButtonElement, TokenSelectButtonProps>(
  ({ className, isOpen, onClick, token }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 h-auto',
          className,
        )}
      >
        {token ? (
          <>
            <TokenImage token={token} size={24} />
            <span className={cn(text.label2, 'font-semibold')}>{token.symbol}</span>
          </>
        ) : (
          <span className={cn(text.label2, 'text-muted-foreground')}>
            Select token
          </span>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'transform rotate-180',
          )}
        />
      </Button>
    );
  }
);

TokenSelectButton.displayName = 'TokenSelectButton';

