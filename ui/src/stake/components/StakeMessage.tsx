'use client';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../styles/theme';
import { useStakeContext } from './StakeProvider';
import type { StakeMessageProps } from '../types';

export function StakeMessage({ className }: StakeMessageProps) {
  const { status, error, result, isTestnet } = useStakeContext();

  if (status === 'idle' || status === 'preparing' || status === 'pending') {
    return null;
  }

  if (status === 'error' && error) {
    return (
      <Alert variant="destructive" className={cn('flex items-center', className)}>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Stake Failed:</strong> {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'success' && result) {
    const explorerUrl = isTestnet
      ? `https://subnets-test.avax.network/p-chain/tx/${result.txHash}`
      : `https://subnets.avax.network/p-chain/tx/${result.txHash}`;

    return (
      <Alert variant="default" className={cn('border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950', className)}>
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription>
          <div className="space-y-2">
            <div>
              <strong className="text-green-800 dark:text-green-200">Stake Successful!</strong>
            </div>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Transaction:</span>{' '}
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline font-mono"
                >
                  {result.txHash.slice(0, 8)}...{result.txHash.slice(-8)}
                </a>
              </div>
              <div>
                <span className="font-medium">Stake Amount:</span> {result.stakeAmount} AVAX
              </div>
              <div>
                <span className="font-medium">Node ID:</span>{' '}
                <span className="font-mono text-xs">{result.nodeId}</span>
              </div>
              <div>
                <span className="font-medium">End Time:</span>{' '}
                {new Date(result.endTime * 1000).toLocaleString()}
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
