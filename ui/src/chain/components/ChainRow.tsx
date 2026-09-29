'use client';

import { cn } from '../../styles/theme';
import type { ChainRowProps } from '../types';
import { ChainLogo } from './ChainLogo';

export function ChainRow({
  chain,
  className,
  iconSize = 32,
  showDescription = true,
  descriptionOverride,
  disabled = false,
}: ChainRowProps) {
  const icon = (() => {
    if (chain.icon) {
      return chain.icon;
    }
    return (
      <ChainLogo
        chain={chain}
        size={iconSize}
        badge={chain.badge}
        showLabel={false}
      />
    );
  })();

  const fallbackDescription = chain.description ?? (chain.testnet ? 'Testnet' : undefined);
  const resolvedDescription = descriptionOverride ?? fallbackDescription;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="shrink-0">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col items-start">
        <span
          className={cn(
            'text-sm font-semibold text-foreground truncate',
            disabled && 'opacity-70',
          )}
        >
          {chain.name}
        </span>
        {showDescription && resolvedDescription ? (
          <span
            className={cn(
              'text-xs text-muted-foreground truncate',
              disabled && 'opacity-70',
            )}
          >
            {resolvedDescription}
          </span>
        ) : null}
      </div>
    </div>
  );
}
