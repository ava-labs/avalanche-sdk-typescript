'use client';
import { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';
import { formatUnits } from 'viem';
import { publicKeyToXPAddress } from '@avalanche-sdk/client/accounts';
import { getBalance as getCChainBalance } from '@avalanche-sdk/client/methods';
import { getBalance as getPChainBalance } from '@avalanche-sdk/client/methods/pChain';
import { getBalance as getXChainBalance } from '@avalanche-sdk/client/methods/xChain';
import type { Address, Chain } from '@avalanche-sdk/client';
import { useAvalanche } from '../../AvalancheProvider';
import type { WalletContextType, WalletProviderProps, WalletStatus, WalletError, ChainBalances, WalletBalance } from '../types';

export const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({
  children,
  initialChain,
  onStatusChange,
  onError,
  onConnect,
  onDisconnect,
}: WalletProviderProps) {
  const { 
    chain: defaultChain, 
    walletClient, 
    walletAddress, 
    isWalletConnected, 
    connectWallet, 
    disconnectWallet 
  } = useAvalanche();
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [error, setError] = useState<WalletError | undefined>();
  const [currentChain, setCurrentChain] = useState<Chain>(initialChain || defaultChain);

  // Sync wallet address from AvalancheProvider
  const address = walletAddress as Address | undefined;
  
  // X and P chain addresses
  const [xAddress, setXAddress] = useState<string | undefined>();
  const [pAddress, setPAddress] = useState<string | undefined>();
  
  // Initialize empty balances
  const [balances, setBalances] = useState<ChainBalances>(() => ({
    pChain: { avax: '0', wei: 0n, loading: false },
    cChain: { avax: '0', wei: 0n, loading: false },
    xChain: { avax: '0', wei: 0n, loading: false },
  }));

  const availableChains = useMemo(() => [avalanche, avalancheFuji], []);

  const updateStatus = useCallback((newStatus: WalletStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const handleError = useCallback((err: Error | WalletError) => {
    const walletError: WalletError = {
      message: err.message || 'An unknown error occurred',
      code: 'code' in err ? err.code : undefined,
    };
    setError(walletError);
    updateStatus('error');
    onError?.(walletError);
  }, [onError, updateStatus]);

  // Function to compute X and P chain addresses
  const updateXPAddresses = useCallback(async () => {
    if (!walletClient || !address) {
      setXAddress(undefined);
      setPAddress(undefined);
      return;
    }

    try {
      // Get the public key from the connected wallet
      const { xp } = await walletClient.getAccountPubKey();
      
      // Determine the correct HRP (Human Readable Part) based on network
      const hrp = currentChain.testnet ? 'fuji' : 'avax';
      
      // Derive the bech32 XP address from the public key
      const xpBech32 = publicKeyToXPAddress(xp, hrp);
      
      // Set both X and P addresses (they use the same bech32 address with different prefixes)
      setXAddress(`X-${xpBech32}`);
      setPAddress(`P-${xpBech32}`);
    } catch (error) {
      console.error('Failed to compute X/P addresses:', error);
      setXAddress(undefined);
      setPAddress(undefined);
    }
  }, [walletClient, address, currentChain]);

  // Fetch balance for a specific chain
  const fetchChainBalance = useCallback(async (
    chainType: 'pChain' | 'cChain' | 'xChain',
    walletAddress: Address
  ): Promise<WalletBalance> => {
    try {
      let balanceWei: bigint = 0n;

      // Fetch balance based on chain type
      if (chainType === 'cChain') {
        // For C-Chain, get ETH balance (AVAX on C-Chain) using walletClient
        if (!walletClient) {
          balanceWei = 0n;
        } else {
          // Use getCChainBalance with walletClient
          balanceWei = await getCChainBalance(walletClient, {
            address: walletAddress,
          });
        }
      } else if (chainType === 'pChain') {
        // For P-Chain, use existing pAddress with walletClient's pChain
        try {
          if (!walletClient || !pAddress) {
            balanceWei = 0n;
          } else {
            // Use getPChainBalance with walletClient's pChain client
            // Type assertion needed because wallet client is compatible for read operations
            const balance = await getPChainBalance(walletClient.pChainClient, {
              addresses: [pAddress],
            });
            
            balanceWei = balance.balance;
          }
        } catch (error) {
          console.error('P-Chain balance fetch error:', error);
          balanceWei = 0n;
        }
      } else if (chainType === 'xChain') {
        // For X-Chain, use existing xAddress with walletClient's xChain
        try {
          if (!walletClient || !xAddress) {
            balanceWei = 0n;
          } else {
            // Determine AVAX asset ID based on network
            const avaxAssetId = currentChain.testnet 
              ? 'U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK' // Fuji AVAX
              : 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z'; // Mainnet AVAX
            
            // Use getXChainBalance with walletClient's xChain client
            // Type assertion needed because wallet client is compatible for read operations
            // Note: X-Chain getBalance uses 'address' (singular string), not 'addresses'
            const balance = await getXChainBalance(walletClient.xChainClient, {
              address: xAddress,
              assetID: avaxAssetId,
            });
            
            balanceWei = balance.balance;
          }
        } catch (error) {
          console.error('X-Chain balance fetch error:', error);
          balanceWei = 0n;
        }
      }

      // Convert to native token - different chains use different units
      let nativeBalance: string;
      if (chainType === 'cChain') {
        // C-Chain uses wei (18 decimals)
        nativeBalance = formatUnits(balanceWei, 18);
      } else {
        // P-Chain and X-Chain use nanoAVAX (9 decimals)
        nativeBalance = formatUnits(balanceWei, 9);
      }

      return {
        avax: parseFloat(nativeBalance).toFixed(4),
        wei: balanceWei,
        loading: false,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error(`Failed to fetch ${chainType} balance:`, error);
      return {
        avax: '0',
        wei: 0n,
        loading: false,
        lastUpdated: new Date(),
      };
    }
  }, [walletClient, pAddress, xAddress, currentChain]);

  // Refresh all balances
  const refreshBalances = useCallback(async () => {
    if (!address || status !== 'connected') return;

    // Set loading state for all chains
    setBalances(prev => ({
      pChain: { ...prev.pChain, loading: true },
      cChain: { ...prev.cChain, loading: true },
      xChain: { ...prev.xChain, loading: true },
    }));

    try {
      // Fetch all balances in parallel
      const [pChainBalance, cChainBalance, xChainBalance] = await Promise.all([
        fetchChainBalance('pChain', address),
        fetchChainBalance('cChain', address),
        fetchChainBalance('xChain', address),
      ]);

      setBalances({
        pChain: pChainBalance,
        cChain: cChainBalance,
        xChain: xChainBalance,
      });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
      // Reset loading states on error
      setBalances(prev => ({
        pChain: { ...prev.pChain, loading: false },
        cChain: { ...prev.cChain, loading: false },
        xChain: { ...prev.xChain, loading: false },
      }));
    }
  }, [address, status, fetchChainBalance]);

  const connect = useCallback(async () => {
    try {
      updateStatus('connecting');
      setError(undefined);

      // Use centralized connect function from AvalancheProvider
      await connectWallet();
      
      updateStatus('connected');
      onConnect?.(address!);
      
      // Fetch balances after successful connection
      setTimeout(() => refreshBalances(), 100);
    } catch (err: any) {
      handleError(err);
    }
  }, [connectWallet, handleError, updateStatus, onConnect, refreshBalances, address]);

  const disconnect = useCallback(() => {
    setError(undefined);
    updateStatus('disconnected');
    
    // Use centralized disconnect function from AvalancheProvider
    disconnectWallet();
    
    // Reset balances on disconnect
    setBalances({
      pChain: { avax: '0', wei: 0n, loading: false },
      cChain: { avax: '0', wei: 0n, loading: false },
      xChain: { avax: '0', wei: 0n, loading: false },
    });
    onDisconnect?.();
  }, [disconnectWallet, updateStatus, onDisconnect]);

  const switchChain = useCallback(async (newChain: Chain) => {
    try {
      setCurrentChain(newChain);
      // If connected, we might need to reconnect with the new chain
      if (status === 'connected') {
        // For now, just update the chain. In a real implementation,
        // you might want to request the wallet to switch networks
        setError(undefined);
      }
    } catch (err: any) {
      handleError(err);
    }
  }, [status, handleError]);

  const clearError = useCallback(() => {
    setError(undefined);
    if (status === 'error') {
      updateStatus('disconnected');
    }
  }, [status, updateStatus]);

  // Sync wallet connection status with AvalancheProvider
  useEffect(() => {
    if (isWalletConnected && address) {
      updateStatus('connected');
      // Fetch balances for connected wallet
      setTimeout(() => refreshBalances(), 100);
      // Update X and P chain addresses
      updateXPAddresses();
    } else {
      updateStatus('disconnected');
      setXAddress(undefined);
      setPAddress(undefined);
    }
  }, [isWalletConnected, address, updateStatus, refreshBalances, updateXPAddresses]);

  const contextValue = useMemo((): WalletContextType => ({
    status,
    address,
    xAddress,
    pAddress,
    error,
    availableChains,
    currentChain,
    walletClient,
    balances,
    connect,
    disconnect,
    switchChain,
    refreshBalances,
    clearError,
  }), [
    status,
    address,
    xAddress,
    pAddress,
    error,
    availableChains,
    currentChain,
    walletClient,
    balances,
    connect,
    disconnect,
    switchChain,
    refreshBalances,
    clearError,
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
