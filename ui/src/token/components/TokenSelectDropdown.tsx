'use client';

import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../../components/ui/select';
import { cn, text } from '../../styles/theme';
import type { TokenSelectDropdownProps } from '../types';
import { TokenImage } from './TokenImage';

/**
 * TokenSelectDropdown - dropdown for selecting tokens
 */
export function TokenSelectDropdown({
  options,
  setToken,
  token,
  className,
}: TokenSelectDropdownProps) {
  const handleValueChange = useCallback((value: string) => {
    const selectedToken = options.find((t) => {
      const tokenValue = t.address || t.symbol;
      return tokenValue === value;
    });
    if (selectedToken) {
      setToken(selectedToken);
    }
  }, [options, setToken]);

  const hasTokens = options.length > 0;
  const currentValue = token ? (token.address || token.symbol) : '';

  return (
    <Select
      value={currentValue || undefined}
      onValueChange={handleValueChange}
      disabled={!hasTokens}
    >
      <SelectTrigger className={cn('w-full gap-2 px-3 py-2 h-10', className)}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {token ? (
            <>
              <TokenImage token={token} size={24} />
              <span className="font-semibold">{token.symbol}</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              {hasTokens ? 'Select token' : 'No tokens available'}
            </span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {hasTokens ? (
          <div className="py-2 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 border-b border-border mb-2">
              <span className={cn(text.caption, 'text-muted-foreground uppercase tracking-wide')}>
                Select Token
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {options.map((tokenOption) => {
                const optionValue = tokenOption.address || tokenOption.symbol;
                return (
                  <SelectItem
                    key={optionValue}
                    value={optionValue}
                    className="cursor-pointer px-3 py-2"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <TokenImage token={tokenOption} size={28} />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-sm">
                          {tokenOption.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {tokenOption.symbol}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            No tokens available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

