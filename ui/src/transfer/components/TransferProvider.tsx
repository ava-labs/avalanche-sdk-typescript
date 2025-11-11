'use client';
import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { publicKeyToXPAddress } from '@avalanche-sdk/client/accounts';
import type { Address } from '@avalanche-sdk/client';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type {
  TransferContextType,
  TransferProviderProps,
  TransferStatus,
  TransferChain,
  TransferError,
  TransferResult,
} from '../types';

export const TransferContext = createContext<TransferContextType | null>(null);

export function TransferProvider({
  children,
  initialFromChain = 'P',
  initialToChain = 'C',
  onStatusChange,
  onError,
  onSuccess,
}: TransferProviderProps) {
  const { address: walletAddress, currentChain, walletClient } = useWalletContext();
  
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [fromChain, setFromChain] = useState<TransferChain>(initialFromChain);
  const [toChain, setToChain] = useState<TransferChain>(initialToChain);
  const [amount, setAmount] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [error, setError] = useState<TransferError | undefined>();
  const [result, setResult] = useState<TransferResult | undefined>();

  // TODO: Add X-Chain support when low-level export/import methods are implemented
  // Currently P ↔ C, P → P, and C → C transfers are supported by the SDK's high-level send() method
  const availableChains: TransferChain[] = useMemo(() => ['P', 'C'], []);

  // Derive destination address based on the selected chain
  const deriveDestinationAddress = useCallback(async (targetChain: TransferChain): Promise<string> => {
    if (!walletClient || !walletAddress) return '';

    try {
      if (targetChain === 'C') {
        // For C-Chain, use the wallet's C-Chain address (EVM format)
        return walletAddress;
      } else {
        // For P-Chain and X-Chain, derive from public key
        const { xp } = await walletClient.getAccountPubKey();
        const hrp = currentChain.name?.includes('Fuji') ? 'fuji' : 'avax';
        const xpBech32 = publicKeyToXPAddress(xp, hrp);
        return `${targetChain}-${xpBech32}`;
      }
    } catch (error) {
      console.error('Error deriving destination address:', error);
      return '';
    }
  }, [walletClient, walletAddress, currentChain]);

  // Auto-update destination address when toChain changes
  useEffect(() => {
    if (walletAddress && walletClient) {
      deriveDestinationAddress(toChain).then(setToAddress);
    }
  }, [toChain, walletAddress, walletClient, deriveDestinationAddress]);

  const updateStatus = useCallback((newStatus: TransferStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const handleError = useCallback((err: Error | TransferError) => {
    const transferError: TransferError = {
      message: err.message || 'An unknown error occurred',
      code: 'code' in err ? err.code : undefined,
    };
    setError(transferError);
    updateStatus('error');
    onError?.(transferError);
  }, [onError, updateStatus]);

  const executeTransfer = useCallback(async () => {
    if (!walletClient || !walletAddress) {
      handleError(new Error('Wallet not connected'));
      return;
    }

    if (!amount || !toAddress) {
      handleError(new Error('Please fill in all required fields'));
      return;
    }

    const value = Number(amount);
    if (!value || value <= 0) {
      handleError(new Error('Please enter a valid amount'));
      return;
    }

    try {
      updateStatus('preparing');
      setError(undefined);

      let transferResult: any;

      if (fromChain === 'P' && toChain === 'C') {
        // P → C transfer
        transferResult = await walletClient.send({
          to: toAddress as Address,
          amount: parseFloat(amount), // Convert to number for client
          sourceChain: "P",
          destinationChain: "C",
        });
      } else if (fromChain === 'C' && toChain === 'P') {
        // C → P transfer
        transferResult = await walletClient.send({
          to: toAddress,
          amount: parseFloat(amount), // Convert to number for client
          destinationChain: "P",
        });
      } else if (fromChain === 'C' && toChain === 'C') {
        // C → C transfer (same chain transfer)
        // For C→C, don't specify sourceChain/destinationChain - they default to C
        console.log('C → C transfer - walletClient:', {
          toAddress,
          amount,
          parsedAmount: parseFloat(amount),
          walletClientType: typeof walletClient,
          hasWalletClient: !!walletClient,
        });
        
        // Note: C→C transfers using custom provider (Core Wallet) may have limitations
        // The SDK's transferCtoCChain uses viem actions (estimateGas, getGasPrice, getBalance)
        // which might not be fully supported by all custom providers
        try {
          transferResult = await walletClient.send({
            to: toAddress as Address,
            amount: parseFloat(amount), // Convert to number for client
          });
        } catch (ctocError: any) {
          // If the error is about an unrecognized method, provide more context
          if (ctocError.message?.includes('Unrecognized method') || ctocError.code === -32603) {
            throw new Error(
              `C-Chain to C-Chain transfers may not be fully supported with the current wallet provider. ` +
              `Error: ${ctocError.message || 'Unknown error'}. ` +
              `This might be a limitation of the Core Wallet's custom provider implementation.`
            );
          }
          throw ctocError;
        }
      } else if (fromChain === 'P' && toChain === 'P') {
        // P → P transfer (same chain transfer)
        transferResult = await walletClient.send({
          to: toAddress,
          amount: parseFloat(amount), // Convert to number for client
          sourceChain: "P",
          destinationChain: "P",
        });
      } else if (
        (fromChain === 'P' && toChain === 'X') ||
        (fromChain === 'X' && toChain === 'P') ||
        (fromChain === 'C' && toChain === 'X') ||
        (fromChain === 'X' && toChain === 'C')
      ) {
        // TODO: X-Chain transfers are not supported by the high-level send() method
        // The SDK supports P ↔ C, P → P, and C → C transfers via the send() method.
        // X-Chain transfers require low-level export/import transactions:
        // 1. Export from source chain (e.g., walletClient.cChain.prepareExportTxn())
        // 2. Import to destination chain (e.g., walletClient.xChain.prepareImportTxn())
        // See examples in: client/examples/prepare-primary-network-txns/
        throw new Error(
          `X-Chain transfers are not yet supported. Supported routes: P ↔ C only.`
        );
      } else {
        throw new Error(`Unsupported transfer direction: ${fromChain} → ${toChain}`);
      }

      updateStatus('pending');

      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const successResult: TransferResult = {
        txHashes: transferResult.txHashes || ['0x...'],
        fromChain,
        toChain,
        amount,
      };

      setResult(successResult);
      updateStatus('success');
      onSuccess?.(successResult);

    } catch (err: any) {
      console.error('Transfer error details:', {
        error: err,
        errorMessage: err?.message,
        errorCode: err?.code,
        errorDetails: err?.details,
        errorStack: err?.stack,
        fromChain,
        toChain,
        amount,
        toAddress,
      });
      handleError(err);
    }
  }, [
    walletClient,
    walletAddress,
    amount,
    toAddress,
    fromChain,
    toChain,
    handleError,
    updateStatus,
    onSuccess,
  ]);

  const toggleChains = useCallback(() => {
    const newFromChain = toChain;
    const newToChain = fromChain;
    setFromChain(newFromChain);
    setToChain(newToChain);
  }, [fromChain, toChain]);

  const clearError = useCallback(() => {
    setError(undefined);
    if (status === 'error') {
      updateStatus('idle');
    }
  }, [status, updateStatus]);

  const reset = useCallback(() => {
    setAmount('');
    setToAddress('');
    setError(undefined);
    setResult(undefined);
    updateStatus('idle');
  }, [updateStatus]);

  const contextValue = useMemo((): TransferContextType => ({
    status,
    fromChain,
    toChain,
    amount,
    toAddress,
    error,
    result,
    availableChains,
    setFromChain,
    setToChain,
    setAmount,
    setToAddress,
    executeTransfer,
    toggleChains,
    clearError,
    reset,
  }), [
    status,
    fromChain,
    toChain,
    amount,
    toAddress,
    error,
    result,
    availableChains,
    executeTransfer,
    toggleChains,
    clearError,
    reset,
  ]);

  return (
    <TransferContext.Provider value={contextValue}>
      {children}
    </TransferContext.Provider>
  );
}
