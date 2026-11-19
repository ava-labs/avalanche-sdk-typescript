'use client';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAvalanche } from '../../AvalancheProvider';
import { getProvider } from '../providers/registry';
import { createPublicClient, http } from 'viem';
import type { 
  EarnProviderType,
  EarnPool,
  EarnAction,
  EarnStatus,
  EarnProviderProps,
  EarnContextType
} from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({
  children,
  initialProvider = 'aave',
  initialChainId,
  onStatusChange,
  onSuccess,
  onError,
}: EarnProviderProps) {
  const { availableChains, walletClient, walletChainId, switchChain, chainkit } = useAvalanche();
  
  // Get default chain ID
  const defaultChainId = initialChainId || availableChains[0]?.id.toString() || '43114';
  
  // Provider selection
  const [provider, setProvider] = useState<EarnProviderType>(initialProvider);
  
  // Chain selection
  const [chainId, setChainId] = useState<string>(defaultChainId);
  
  // Pool selection
  const [selectedPool, setSelectedPool] = useState<EarnPool | null>(null);
  const [pools, setPools] = useState<EarnPool[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Action state
  const [action, setAction] = useState<EarnAction | null>(null);
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  
  // Approval state
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  
  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  
  // Claim rewards state
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  
  // Status and errors
  const [status, setStatus] = useState<EarnStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Chain switching state
  const [isOnCorrectChain, setIsOnCorrectChain] = useState<boolean>(true);
  const [isSwitchingChain, setIsSwitchingChain] = useState<boolean>(false);
  
  // Load pools based on provider and chain
  const loadPools = useCallback(async () => {
    setIsLoadingPools(true);
    setError(null);
    
    try {
      const chainData = availableChains.find(chain => chain.id.toString() === chainId);
      
      if (!chainData) {
        throw new Error(`Chain ${chainId} not found`);
      }
      
      const earnProvider = getProvider(provider);
        const userAddress = walletClient?.account?.address as `0x${string}` | undefined;
      const fetchedPools = await earnProvider.fetchPools(chainData, chainkit, userAddress);
        setPools(fetchedPools);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pools';
      setError(errorMessage);
      console.error('Error loading pools:', err);
      onError?.(new Error(errorMessage));
    } finally {
      setIsLoadingPools(false);
    }
  }, [provider, chainId, availableChains, walletClient, chainkit, onError]);
  
  // Refresh pools
  const refreshPools = useCallback(async () => {
    await loadPools();
  }, [loadPools]);
  
  // Load pools when provider or chain changes
  useEffect(() => {
    loadPools();
  }, [loadPools]);
  
  // Reload pools when wallet address changes to update user deposits
  useEffect(() => {
    if (walletClient?.account?.address) {
      loadPools();
    }
  }, [walletClient?.account?.address, loadPools]);
  
  // Check if user is on correct chain
  useEffect(() => {
    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    
    if (!chainData || !walletChainId) {
      setIsOnCorrectChain(false);
      return;
    }
    
    setIsOnCorrectChain(walletChainId === chainData.id);
  }, [chainId, availableChains, walletChainId]);
  
  // Switch to chain
  const switchToChain = useCallback(async () => {
    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    
    if (!chainData) {
      setError('Chain not found');
      return;
    }
    
    if (!switchChain) {
      setError('Chain switching not available');
      return;
    }
    
    setIsSwitchingChain(true);
    setError(null);
    
    try {
      await switchChain(chainData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch chain';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsSwitchingChain(false);
    }
  }, [chainId, availableChains, switchChain, onError]);
  
  // Check approval status
  const checkApproval = useCallback(async () => {
    if (!selectedPool || !depositAmount || !walletClient?.account) {
      setNeedsApproval(false);
      return;
    }

    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    if (!chainData) {
      setNeedsApproval(false);
      return;
    }

    try {
      const publicClient = createPublicClient({
        chain: chainData,
        transport: http(),
      });

      const earnProvider = getProvider(selectedPool.provider);
      const approvalCheck = await earnProvider.checkApproval({
          publicClient,
        pool: selectedPool,
          amount: depositAmount,
          owner: walletClient.account.address as `0x${string}`,
        });

        setNeedsApproval(approvalCheck.needsApproval);
    } catch (err) {
      console.error('Error checking approval:', err);
      setNeedsApproval(false);
    }
  }, [selectedPool, depositAmount, walletClient, chainId, availableChains]);

  // Approve token
  const approveToken = useCallback(async () => {
    if (!selectedPool || !depositAmount) {
      setError('Please select a pool and enter an amount');
      return;
    }

    if (!walletClient?.account) {
      setError('Please connect your wallet');
      return;
    }

    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    if (!chainData) {
      setError('Chain not found');
      return;
    }
    
    setIsApproving(true);
    setError(null);
    
    try {
      const earnProvider = getProvider(selectedPool.provider);
      const result = await earnProvider.approveToken({
          walletClient,
          chain: chainData,
        pool: selectedPool,
          amount: depositAmount,
        });
      
      // Recheck approval status
      await checkApproval();
      
      onSuccess?.({
        pool: selectedPool,
        amount: depositAmount,
        action: 'approve' as const,
        txHash: result.txHash,
      });
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Approval failed';
      
      // Truncate long error messages
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }
      
      // Simplify common error messages
      if (errorMessage.includes('User rejected')) {
        errorMessage = 'Transaction was rejected. Please try again.';
      } else if (errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was denied. Please try again.';
      }
      
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsApproving(false);
    }
  }, [selectedPool, depositAmount, walletClient, chainId, availableChains, checkApproval, onSuccess, onError]);

  // Deposit
  const deposit = useCallback(async () => {
    if (!selectedPool || !depositAmount) {
      setError('Please select a pool and enter an amount');
      return;
    }

    if (!walletClient?.account) {
      setError('Please connect your wallet');
      return;
    }

    if (needsApproval) {
      setError('Please approve the token first');
      return;
    }

    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    if (!chainData) {
      setError('Chain not found');
      return;
    }
    
    setIsDepositing(true);
    setStatus('loading');
    setError(null);
    
    try {
      const earnProvider = getProvider(selectedPool.provider);
      const depositResult = await earnProvider.deposit({
          walletClient,
          chain: chainData,
        pool: selectedPool,
          amount: depositAmount,
        });
      
      const result = {
        pool: selectedPool,
        amount: depositAmount,
        action: 'deposit' as EarnAction,
        txHash: depositResult.txHash,
      };
      
      setStatus('success');
      setDepositAmount('');
      
      // Refresh pools to update user deposits
      await loadPools();
      
      onSuccess?.(result);
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Deposit failed';
      
      // Truncate long error messages
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }
      
      // Simplify common error messages
      if (errorMessage.includes('User rejected')) {
        errorMessage = 'Transaction was rejected. Please try again.';
      } else if (errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was denied. Please try again.';
      }
      
      setError(errorMessage);
      setStatus('error');
      onError?.(new Error(errorMessage));
    } finally {
      setIsDepositing(false);
    }
  }, [selectedPool, depositAmount, walletClient, chainId, availableChains, needsApproval, loadPools, onSuccess, onError]);

  // Check approval when deposit amount or pool changes
  useEffect(() => {
    if (selectedPool && depositAmount && walletClient?.account) {
      checkApproval();
    } else {
      setNeedsApproval(false);
    }
  }, [selectedPool, depositAmount, walletClient?.account, checkApproval]);
  
  // Withdraw
  const withdraw = useCallback(async () => {
    if (!selectedPool || !withdrawAmount) {
      setError('Please select a pool and enter an amount');
      return;
    }

    if (!walletClient?.account) {
      setError('Please connect your wallet');
      return;
    }

    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    if (!chainData) {
      setError('Chain not found');
      return;
    }
    
    setIsWithdrawing(true);
    setStatus('loading');
    setError(null);
    
    try {
      const earnProvider = getProvider(selectedPool.provider);
      const withdrawResult = await earnProvider.withdraw({
        walletClient,
        chain: chainData,
        pool: selectedPool,
        amount: withdrawAmount,
      });
      
      const result = {
        pool: selectedPool,
        amount: withdrawAmount,
        action: 'withdraw' as EarnAction,
        txHash: withdrawResult.txHash,
      };
      
      setStatus('success');
      setWithdrawAmount('');
      
      // Refresh pools to update user deposits
      await loadPools();
      
      onSuccess?.(result);
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Withdraw failed';
      
      // Truncate long error messages
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }
      
      // Simplify common error messages
      if (errorMessage.includes('User rejected')) {
        errorMessage = 'Transaction was rejected. Please try again.';
      } else if (errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was denied. Please try again.';
      }
      
      setError(errorMessage);
      setStatus('error');
      onError?.(new Error(errorMessage));
    } finally {
      setIsWithdrawing(false);
    }
  }, [selectedPool, withdrawAmount, walletClient, chainId, availableChains, loadPools, onSuccess, onError]);
  
  // Claim rewards
  const claimRewards = useCallback(async () => {
    if (!selectedPool) {
      setError('Please select a pool');
      return;
    }

    if (!walletClient?.account) {
      setError('Please connect your wallet');
      return;
    }

    const chainData = availableChains.find(chain => chain.id.toString() === chainId);
    if (!chainData) {
      setError('Chain not found');
      return;
    }
    
    setIsClaiming(true);
    setStatus('loading');
    setError(null);
    
    try {
      const earnProvider = getProvider(selectedPool.provider);
      const claimResult = await earnProvider.claimRewards({
        walletClient,
        chain: chainData,
        pool: selectedPool,
      });
      
      const result = {
        pool: selectedPool,
        action: 'claim' as EarnAction,
        txHash: claimResult.txHash,
      };
      
      setStatus('success');
      
      // Refresh pools to update user rewards
      await loadPools();
      
      onSuccess?.(result);
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Claim rewards failed';
      
      // Truncate long error messages
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }
      
      // Simplify common error messages
      if (errorMessage.includes('User rejected')) {
        errorMessage = 'Transaction was rejected. Please try again.';
      } else if (errorMessage.includes('User denied')) {
        errorMessage = 'Transaction was denied. Please try again.';
      }
      
      setError(errorMessage);
      setStatus('error');
      onError?.(new Error(errorMessage));
    } finally {
      setIsClaiming(false);
    }
  }, [selectedPool, walletClient, chainId, availableChains, loadPools, onSuccess, onError]);
  
  // Validation
  const { isValidForDeposit, isValidForWithdraw, validationErrors } = useMemo(() => {
    const errors: string[] = [];
    
    if (!selectedPool) {
      errors.push('Please select a pool');
    }
    
    if (!isOnCorrectChain) {
      errors.push('Please switch to the correct chain');
    }
    
    if (!walletClient) {
      errors.push('Please connect your wallet');
    }
    
    // Deposit validation
    const depositErrors = [...errors];
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      depositErrors.push('Please enter a valid deposit amount');
    }
    
    // Withdraw validation
    const withdrawErrors = [...errors];
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      withdrawErrors.push('Please enter a valid withdraw amount');
    }
    if (selectedPool && selectedPool.userDeposited) {
      const withdrawAmountNum = parseFloat(withdrawAmount);
      const userDepositedNum = parseFloat(selectedPool.userDeposited);
      if (withdrawAmountNum > userDepositedNum) {
        withdrawErrors.push('Withdraw amount exceeds your deposited amount');
      }
    }
    
    return {
      isValidForDeposit: depositErrors.length === 0 && isOnCorrectChain && !!walletClient,
      isValidForWithdraw: withdrawErrors.length === 0 && isOnCorrectChain && !!walletClient,
      validationErrors: withdrawErrors,
    };
  }, [selectedPool, depositAmount, withdrawAmount, isOnCorrectChain, walletClient]);
  
  // Status change callback
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);
  
  const contextValue: EarnContextType = {
    // Provider selection
    provider,
    setProvider,
    
    // Chain selection
    chainId,
    setChainId,
    
    // Pool selection
    selectedPool,
    setSelectedPool,
    pools,
    isLoadingPools,
    refreshPools,
    
    // View mode
    viewMode,
    setViewMode,
    
    // Action state
    action,
    setAction,
    
    // Deposit state
    depositAmount,
    setDepositAmount,
    isDepositing,
    deposit,
    
    // Approval state
    needsApproval,
    isApproving,
    approveToken,
    checkApproval,
    
    // Withdraw state
    withdrawAmount,
    setWithdrawAmount,
    isWithdrawing,
    withdraw,
    
    // Claim rewards state
    isClaiming,
    claimRewards,
    
    // Status and errors
    status,
    error,
    
    // Validation
    isValidForDeposit,
    isValidForWithdraw,
    validationErrors,
    
    // Chain switching
    isOnCorrectChain,
    isSwitchingChain,
    switchToChain,
  };
  
  return (
    <EarnContext.Provider value={contextValue}>
      {children}
    </EarnContext.Provider>
  );
}

export function useEarnContext() {
  const context = useContext(EarnContext);
  if (context === undefined) {
    throw new Error('useEarnContext must be used within an EarnProvider');
  }
  return context;
}

