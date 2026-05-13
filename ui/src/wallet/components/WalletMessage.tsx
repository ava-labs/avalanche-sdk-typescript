'use client';
import { useWalletContext } from '../hooks/useWalletContext';
import { cn, text } from '../../styles/theme';
import type { WalletMessageProps } from '../types';

export function WalletMessage({
  className,
  showDetails = false,
}: WalletMessageProps) {
  const { status, error, clearError } = useWalletContext();

  if (status !== 'error' || !error) {
    return null;
  }

  const getErrorIcon = () => (
    <svg className="w-5 h-5 text-destructive flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  );

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-md border border-destructive bg-destructive/10',
        className,
      )}
      data-testid="wallet-message"
    >
      {getErrorIcon()}
      
      <div className="flex-1 min-w-0">
        <div className={cn(text.label1, 'text-destructive mb-1')}>
          Wallet Error
        </div>
        
        <div className={cn(text.label2, 'mb-2')}>
          {error.message}
        </div>
        
        {showDetails && error.code && (
          <div className={cn(text.legal, 'text-muted-foreground font-mono')}>
            Error Code: {error.code}
          </div>
        )}
      </div>

      <button
        onClick={clearError}
        className={cn(
          'p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
        )}
        data-testid="wallet-message-close"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
