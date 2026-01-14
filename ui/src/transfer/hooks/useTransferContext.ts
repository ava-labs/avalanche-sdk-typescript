import { useContext } from 'react';
import { TransferContext } from '../components/TransferProvider';

/**
 * Hook to access the transfer context.
 * Must be used within a TransferProvider.
 */
export function useTransferContext() {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransferContext must be used within a TransferProvider');
  }
  return context;
}
