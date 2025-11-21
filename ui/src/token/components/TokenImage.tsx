'use client';

import { useMemo, useState } from 'react';
import { cn } from '../../styles/theme';
import type { TokenImageProps } from '../types';
import { getTokenImageColor } from '../utils/getTokenImageColor';

/**
 * TokenImage component displays a token's logo image
 */
export function TokenImage({ className, size = 24, token }: TokenImageProps) {
  const { image, name, symbol } = token;
  const [imageError, setImageError] = useState(false);

  const styles = useMemo(() => {
    return {
      container: {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      },
    };
  }, [size]);

  // Show gradient fallback if no image or image failed to load
  if (!image || imageError) {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-full flex items-center justify-center border-2 border-border shadow-sm',
          className
        )}
        data-testid="tokenImage_NoImage"
        style={{
          ...styles.container,
          background: getTokenImageColor(name),
        }}
      >
        <span 
          className="text-white font-bold"
          style={{ fontSize: `${Math.max(10, Math.round(size * 0.4))}px` }}
        >
          {symbol.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-hidden rounded-full border-2 border-border shadow-sm', className)}
      style={styles.container}
    >
      <img
        className="w-full h-full object-cover"
        alt={`${name} token`}
        data-testid="tokenImage_Image"
        src={image}
        onError={() => setImageError(true)}
      />
    </div>
  );
}

