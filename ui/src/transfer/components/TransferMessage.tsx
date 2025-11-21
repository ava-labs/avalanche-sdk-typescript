'use client';
import { useTransferContext } from '../hooks/useTransferContext';
import { cn, text } from '../../styles/theme';
import type { TransferMessageProps } from '../types';

export function TransferMessage({
  className,
  showDetails = false,
}: TransferMessageProps) {
  const { status, error, result, clearError } = useTransferContext();

  if (status === 'idle' || status === 'preparing' || status === 'pending') {
    return null;
  }

  if (status === 'error' && error) {
    return (
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-default border border-error bg-red-50',
          className,
        )}
        data-testid="transfer-error-message"
      >
        <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        
        <div className="flex-1 min-w-0">
          <div className={cn(text.label1, 'text-error mb-1')}>
            Transfer Failed
          </div>
          
          <div className={cn(text.label2, 'text-foreground mb-2')}>
            {error.message}
          </div>
          
          {showDetails && error.code && (
            <div className={cn(text.legal, 'text-foreground-muted font-mono')}>
              Error Code: {error.code}
            </div>
          )}
        </div>

        <button
          onClick={clearError}
          className={cn(
            'p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors',
          )}
          data-testid="transfer-error-close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  if (status === 'success' && result) {
    return (
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-default border border-success bg-success-background',
          className,
        )}
        data-testid="transfer-success-message"
      >
        <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        
        <div className="flex-1 min-w-0">
          <div className={cn(text.label1, 'text-success mb-1')}>
            Transfer Successful
          </div>
          
          <div className={cn(text.label2, 'text-foreground mb-2')}>
            {result.amount} AVAX transferred from {result.fromChain}-Chain to {result.toChain}-Chain
          </div>
          
          {showDetails && result.txHashes.length > 0 && (
            <div className={cn(text.legal, 'text-foreground-muted')}>
              <div className="mb-1">Transaction Hash{result.txHashes.length > 1 ? 'es' : ''}:</div>
              {result.txHashes.map((hash, index) => (
                <div key={index} className="font-mono break-all">
                  {hash}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
