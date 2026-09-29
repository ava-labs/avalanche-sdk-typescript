'use client';

import { useState } from 'react';
import { cn } from '../../styles/theme';
import { Badge } from '../../components/ui/badge';
import type { ChainLogoProps } from '../types';
import { normalizeChain } from '../utils/normalizeChain';
import { getChainColor, getChainGradient } from '../utils/getChainColor';

export function ChainLogo({
  chain,
  size = 40,
  className,
  showLabel = true,
  labelClassName,
  badge,
}: ChainLogoProps) {
  const normalized = normalizeChain(chain);
  const [fallback, setFallback] = useState(false);

  const numericSize =
    typeof size === 'number'
      ? size
      : Number.parseInt((size as string) || '40', 10) || 40;
  const diameter = typeof size === 'number' ? `${size}px` : size;
  const badgeSize = Math.max(14, Math.round(numericSize * 0.28));
  const logoLabel = normalized.label ?? normalized.name?.charAt(0)?.toUpperCase() ?? '?';
  const displayBadge = badge ?? normalized.badge ?? null;
  const gradientBackground = getChainGradient(normalized.id);
  const solidBackground = getChainColor(normalized.id);

  const shouldShowImage = normalized.iconUrl && !fallback;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      title={normalized.name}
      style={{ width: diameter, height: diameter }}
    >
      <div
        className="rounded-full border-2 border-border bg-background flex items-center justify-center shadow-sm overflow-hidden"
        style={{ width: '100%', height: '100%', background: shouldShowImage ? undefined : gradientBackground }}
      >
        {shouldShowImage ? (
          <img
            src={normalized.iconUrl ?? undefined}
            alt={normalized.name}
            className="object-cover"
            style={{ width: '100%', height: '100%' }}
            onError={() => setFallback(true)}
          />
        ) : (
          showLabel && (
            <span
              className={cn(
                'flex h-full w-full items-center justify-center font-semibold text-white',
                labelClassName,
              )}
            >
              {logoLabel}
            </span>
          )
        )}
      </div>

      {displayBadge ? (
        <Badge
          variant="outline"
          className={cn(
            'absolute bottom-0 right-0 flex items-center justify-center text-xs font-bold border-2 border-background rounded-full backdrop-blur-sm',
            labelClassName,
          )}
          style={{
            background: solidBackground,
            color: '#fff',
            fontSize: `${Math.max(8, Math.round(badgeSize * 0.5))}px`,
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            minWidth: `${badgeSize}px`,
            minHeight: `${badgeSize}px`,
            padding: 0,
          }}
        >
          {displayBadge}
        </Badge>
      ) : null}
    </div>
  );
}
