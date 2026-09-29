'use client';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAvalanche } from '../../AvalancheProvider';
import { createICTTClient } from '@avalanche-sdk/interchain/ictt';

import type { 
  ICTTToken, 
  ICTTTokenMirror,
  ICTTStatus, 
  ICTTProviderProps, 
  ICTTContextType 
} from '../types';

const ICTTContext = createContext<ICTTContextType | undefined>(undefined);

export function ICTTProvider({
  children,
  initialFromChain,
  initialToChain,
  onStatusChange,
  onSuccess,
  onError,
}: ICTTProviderProps) {
  const { availableChains, wellKnownTokens, walletClient, walletChainId, switchChain } = useAvalanche();
  
  // Get default chains from available chains
  const defaultFromChain = initialFromChain || availableChains[0]?.id.toString() || '1';
  const defaultToChain = initialToChain || availableChains[1]?.id.toString() || availableChains[0]?.id.toString() || '43113';
  
  // Chain selection
  const [fromChain, setFromChain] = useState<string>(defaultFromChain);
  const [toChain, setToChain] = useState<string>(defaultToChain);
  
  // Token selection
  const [selectedToken, setSelectedToken] = useState<ICTTToken | null>(null);

  // Auto-set home and remote contracts when a well-known token is selected
  useEffect(() => {
    if (selectedToken && isICTTToken(selectedToken) && selectedToken.ictt) {
      // Set the home contract from the selected token
      setTokenHomeContract(selectedToken.ictt.home);
      
      // Find the remote contract for the destination chain
      const remoteMirror = selectedToken.ictt.mirrors.find((mirror: ICTTTokenMirror) => mirror.chainId === toChain);
      if (remoteMirror) {
        setTokenRemoteContract(remoteMirror.address);
      } else {
        // If no mirror found for the destination chain, clear the remote contract
        setTokenRemoteContract(null);
      }
    } else {
      // If no token selected or token doesn't have ICTT data, clear contracts
      // (but only if they weren't manually set via the home/remote inputs)
      // We'll keep them as they might be manually entered
    }
  }, [selectedToken, toChain]);
  
  // Contract addresses for Home mode
  const [tokenHomeContract, setTokenHomeContract] = useState<string | null>(null);
  const [tokenRemoteContract, setTokenRemoteContract] = useState<string | null>(null);
  
  // Transfer details
  const [amount, setAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  
  // Chain switching state
  const [isOnCorrectChain, setIsOnCorrectChain] = useState<boolean>(true);
  const [isSwitchingChain, setIsSwitchingChain] = useState<boolean>(false);
  
  // Allowance and approval state
  const [allowance, setAllowance] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState<boolean>(false);
  
  // Status
  const [status, setStatus] = useState<ICTTStatus>('idle');
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Swap chains
  const swapChains = useCallback(() => {
    const tempChain = fromChain;
    setFromChain(toChain);
    setToChain(tempChain);
  }, [fromChain, toChain]);

  // Switch to source chain
  const switchToSourceChain = useCallback(async () => {
    const sourceChainData = availableChains.find(chain => chain.id.toString() === fromChain);
    
    if (!sourceChainData) {
      setError('Source chain not found');
      console.error('Source chain not found:', fromChain, 'Available chains:', availableChains);
      return;
    }

    if (!switchChain) {
      setError('Chain switching not available');
      console.error('switchChain function not available');
      return;
    }

    setIsSwitchingChain(true);
    setError(null);

    try {
      console.log('Switching to chain:', sourceChainData);
      await switchChain(sourceChainData);
      console.log('Chain switch successful');
    } catch (error) {
      console.error('Chain switch failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to switch chain');
    } finally {
      setIsSwitchingChain(false);
    }
  }, [fromChain, availableChains, switchChain]);

  // Check token allowance
  const checkAllowance = useCallback(async () => {
    if (!selectedToken || !amount || !tokenHomeContract || !walletClient) {
      setAllowance(null);
      setIsApproved(false);
      return;
    }

    setIsCheckingAllowance(true);
    setError(null);

    try {
      // Find the source chain
      const sourceChainData = availableChains.find(chain => chain.id.toString() === fromChain);
      if (!sourceChainData) {
        throw new Error('Source chain not found');
      }

      // Create public client for reading allowance
      const { createPublicClient, http } = await import('viem');
      const { ERC20_APPROVAL_ABI } = await import('../../utils/erc20');
      
      const publicClient = createPublicClient({
        chain: sourceChainData,
        transport: http(),
      });

      // Check allowance using ERC20 allowance function
      const allowanceResult = await publicClient.readContract({
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_APPROVAL_ABI,
        functionName: 'allowance',
        args: [walletClient.account?.address as `0x${string}`, tokenHomeContract as `0x${string}`],
      });

      const allowanceAmount = allowanceResult.toString();
      const requiredAmount = (parseFloat(amount) * Math.pow(10, selectedToken.decimals)).toString();
      
      setAllowance(allowanceAmount);
      setIsApproved(BigInt(allowanceAmount) >= BigInt(requiredAmount));

    } catch (error) {
      console.error('Failed to check allowance:', error);
      setAllowance(null);
      setIsApproved(false);
      setError(error instanceof Error ? error.message : 'Failed to check allowance');
    } finally {
      setIsCheckingAllowance(false);
    }
  }, [selectedToken, amount, tokenHomeContract, walletClient, fromChain, availableChains]);

  // Approve token
  const approveToken = useCallback(async () => {
    if (!selectedToken || !amount || !tokenHomeContract) {
      setError('Please fill in all required fields for approval');
      return;
    }

    setIsApproving(true);
    setStatus('loading');
    setError(null);

    try {
      // Find the source chain
      const sourceChainData = availableChains.find(chain => chain.id.toString() === fromChain);
      if (!sourceChainData) {
        throw new Error('Source chain not found');
      }

      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      // Parse amount to base units (approve double the amount for safety)
      const amountInBaseUnit = parseFloat(amount);

      const icttClient = createICTTClient(sourceChainData);
      
      console.log('📝 Approving token...', {
        sourceChain: sourceChainData.name,
        tokenHomeContract: tokenHomeContract,
        tokenAddress: selectedToken.address,
        amountInBaseUnit,
      });
      
      const approveResult = await icttClient.approveToken({
        walletClient,
        sourceChain: sourceChainData,
        tokenHomeContract: tokenHomeContract as `0x${string}`,
        tokenAddress: selectedToken.address as `0x${string}`,
        amountInBaseUnit,
      });

      console.log('✅ Token approved:', approveResult.txHash);
      
      // Check allowance after approval
      await checkAllowance();
      
      setStatus('idle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Approval failed';
      setError(errorMessage);
      setStatus('error');
      onError?.(new Error(errorMessage));
    } finally {
      setIsApproving(false);
    }
  }, [selectedToken, amount, tokenHomeContract, fromChain, availableChains, walletClient, onError, checkAllowance]);

  // Send token
  const sendToken = useCallback(async () => {
    if (!selectedToken || !amount || !recipientAddress || !tokenHomeContract || !tokenRemoteContract) {
      setError('Please fill in all required fields for sending');
      return;
    }

    setIsSending(true);
    setStatus('loading');
    setError(null);

    try {
      // Find the source and destination chains
      const sourceChainData = availableChains.find(chain => chain.id.toString() === fromChain);
      const destinationChainData = availableChains.find(chain => chain.id.toString() === toChain);
      
      if (!sourceChainData || !destinationChainData) {
        throw new Error('Source or destination chain not found');
      }

      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      // Parse amount to base units
      const amountInBaseUnit = parseFloat(amount);

      const icttClient = createICTTClient(sourceChainData, destinationChainData);
      
      console.log('📝 Sending token...', {
        sourceChain: sourceChainData.name,
        destinationChain: destinationChainData.name,
        tokenHomeContract: tokenHomeContract,
        tokenRemoteContract: tokenRemoteContract,
        recipient: recipientAddress,
        amountInBaseUnit,
      });
      
      const sendResult = await icttClient.sendToken({
        walletClient,
        sourceChain: sourceChainData,
        destinationChain: destinationChainData,
        tokenHomeContract: tokenHomeContract as `0x${string}`,
        tokenRemoteContract: tokenRemoteContract as `0x${string}`,
        recipient: recipientAddress as `0x${string}`,
        amountInBaseUnit,
      });

      // TODO: remote > home transfer??

      console.log('✅ Token sent:', sendResult.txHash);
        
      const result = {
        fromChain,
        toChain,
        token: selectedToken,
        amount,
        recipientAddress,
        txHash: sendResult.txHash,
      };

      setStatus('success');
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed';
      setError(errorMessage);
      setStatus('error');
      onError?.(new Error(errorMessage));
    } finally {
      setIsSending(false);
    }
  }, [selectedToken, amount, recipientAddress, fromChain, toChain, availableChains, walletClient, onSuccess, onError, tokenHomeContract, tokenRemoteContract]);

  // Validation
  const { isValidForApproval, isValidForSending, validationErrors } = useMemo(() => {
    const errors: string[] = [];

    if (!selectedToken) {
      errors.push('Please select a token');
    }

    if (!amount || parseFloat(amount) <= 0) {
      errors.push('Please enter a valid amount');
    }

    if (!tokenHomeContract) {
      errors.push('Please provide token home contract');
    }

    if (fromChain === toChain) {
      errors.push('Source and destination chains must be different');
    }

    // Additional validation for sending
    const sendingErrors = [...errors];
    
    if (!recipientAddress) {
      sendingErrors.push('Please enter recipient address');
    }

    if (!tokenRemoteContract) {
      sendingErrors.push('Please provide token remote contract');
    }

    return {
      isValidForApproval: errors.length === 0 && isOnCorrectChain,
      isValidForSending: sendingErrors.length === 0 && isApproved && isOnCorrectChain,
      validationErrors: sendingErrors,
    };
  }, [selectedToken, amount, tokenHomeContract, tokenRemoteContract, recipientAddress, fromChain, toChain, isApproved, isOnCorrectChain]);

  // Check if user is on correct chain
  useEffect(() => {
    const sourceChainData = availableChains.find(chain => chain.id.toString() === fromChain);
    
    console.log('Chain check:', {
      fromChain,
      sourceChainData,
      walletChainId,
      availableChains: availableChains.map(c => ({ id: c.id, name: c.name }))
    });
    
    if (!sourceChainData || !walletChainId) {
      console.log('Setting isOnCorrectChain to false - missing data');
      setIsOnCorrectChain(false);
      return;
    }

    const isCorrect = walletChainId === sourceChainData.id;
    console.log('Chain comparison:', { walletChainId, sourceChainId: sourceChainData.id, isCorrect });
    setIsOnCorrectChain(isCorrect);
  }, [fromChain, availableChains, walletChainId]);

  // Check allowance when relevant parameters change
  useEffect(() => {
    if (selectedToken && amount && tokenHomeContract && walletClient && isOnCorrectChain) {
      checkAllowance();
    } else {
      // Reset allowance when not on correct chain
      setAllowance(null);
      setIsApproved(false);
    }
  }, [selectedToken, amount, tokenHomeContract, walletClient, isOnCorrectChain, checkAllowance]);

  // Type guard to check if token is an ICTT token
  const isICTTToken = (token: any): token is ICTTToken => {
    return token && typeof token === 'object' && 'ictt' in token && token.ictt && token.ictt.home;
  };

  // Token validation logic
  const areTokensValid = useMemo(() => {
    if (!selectedToken) {
      return false;
    }

    // For selector mode: selectedToken must be a well-known ICTT token with mirrors
    if (isICTTToken(selectedToken) && selectedToken.ictt) {
      // Check if there's a mirror for the destination chain
      const hasRemoteMirror = selectedToken.ictt.mirrors.some(mirror => mirror.chainId === toChain);
      return hasRemoteMirror;
    }
    
    // For manual mode: selectedToken is a regular ERC20 token and both contracts must be valid
    if (!isICTTToken(selectedToken) && tokenHomeContract && tokenRemoteContract) {
      return true;
    }
    
    // No tokens are valid yet
    return false;
  }, [selectedToken, tokenHomeContract, tokenRemoteContract, toChain]);

  // Status change callback
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const contextValue: ICTTContextType = {
    // Chain selection
    fromChain,
    toChain,
    setFromChain,
    setToChain,
    swapChains,
    
    // Token selection
    selectedToken,
    setSelectedToken,
    availableTokens: wellKnownTokens,
    
    // Contract addresses for Home mode
    tokenHomeContract,
    setTokenHomeContract,
    tokenRemoteContract,
    setTokenRemoteContract,
    
    // Transfer details
    amount,
    setAmount,
    recipientAddress,
    setRecipientAddress,
    
    // Chain switching
    isOnCorrectChain,
    isSwitchingChain,
    switchToSourceChain,
    
    // Allowance and approval
    allowance,
    isApproved,
    isCheckingAllowance,
    checkAllowance,
    
    // Status and actions
    status,
    isApproving,
    isSending,
    error,
    approveToken,
    sendToken,
    
    // Token validation
    areTokensValid,
    
    // Validation
    isValidForApproval,
    isValidForSending,
    validationErrors,
  };

  return (
    <ICTTContext.Provider value={contextValue}>
      {children}
    </ICTTContext.Provider>
  );
}

export function useICTTContext() {
  const context = useContext(ICTTContext);
  if (context === undefined) {
    throw new Error('useICTTContext must be used within an ICTTProvider');
  }
  return context;
}