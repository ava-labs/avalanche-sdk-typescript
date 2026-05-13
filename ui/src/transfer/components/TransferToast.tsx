'use client';
import { useEffect, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { useTransferContext } from '../hooks/useTransferContext';
import { cn, text } from '../../styles/theme';
import type { TransferToastProps } from '../types';

export function TransferToast({
  className,
  duration = 5000,
}: TransferToastProps) {
  const { status, result, error } = useTransferContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setOpen(true);
    }
  }, [status]);

  const isSuccess = status === 'success' && result;
  const isError = status === 'error' && error;

  if (!isSuccess && !isError) {
    return null;
  }

  return (
    <Toast.Provider swipeDirection="right" duration={duration}>
      <Toast.Root
        className={cn(
          'bg-background rounded-default shadow-default p-4 border',
          isSuccess && 'border-success',
          isError && 'border-error',
          'animate-slide-up',
          className,
        )}
        open={open}
        onOpenChange={setOpen}
        data-testid="transfer-toast"
      >
        <div className="flex items-start gap-3">
          {isSuccess && (
            <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          
          {isError && (
            <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          )}

          <div className="flex-1">
            <Toast.Title className={cn(text.label1, 'mb-1')}>
              {isSuccess ? 'Transfer Successful' : 'Transfer Failed'}
            </Toast.Title>
            
            <Toast.Description className={cn(text.label2, 'text-foreground-muted')}>
              {isSuccess && result
                ? `${result.amount} AVAX transferred from ${result.fromChain}-Chain to ${result.toChain}-Chain`
                : error?.message
              }
            </Toast.Description>
          </div>

          <Toast.Close asChild>
            <button
              className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
              data-testid="transfer-toast-close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Toast.Close>
        </div>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  );
}
