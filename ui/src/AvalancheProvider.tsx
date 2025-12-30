'use client';
import { createContext, useContext, useLayoutEffect, useMemo, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { createAvalancheWalletClient } from '@avalanche-sdk/client';
import type { Chain } from '@avalanche-sdk/client/chains';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';
import { Avalanche } from '@avalanche-sdk/chainkit';
import type { ICTTToken } from './ictt/types';
import type { ChainConfig } from './types/chainConfig';

export type AvalancheConfig = {
  /** The name of the application */
  name?: string;
  /** The logo URL for the application */
  logo?: string;
  /** The theme mode */
  mode?: 'auto' | 'light' | 'dark';
  /** The theme variant */
  theme?: 'default' | 'custom';
  /** RPC URL override */
  rpcUrl?: string;
  /** API key for enhanced features */
  apiKey?: string;
};

export type AvalancheProviderProps = {
  /** The blockchain network chain */
  chain: ChainConfig;
  /** Available chains for network switching */
  chains?: ChainConfig[];
  /** Well-known tokens for ICTT */
  wellKnownTokens?: ICTTToken[];
  /** Configuration options */
  config?: AvalancheConfig;
  /** Child components */
  children: ReactNode;
  /** Session ID for analytics */
  sessionId?: string;
};

export type AvalancheContextType = {
  /** Current blockchain chain */
  chain: Chain;
  /** Application configuration */
  config: Required<AvalancheConfig>;
  /** Session identifier */
  sessionId: string;
  /** ChainKit SDK client for Glacier API */
  chainkit: Avalanche;
  /** Wallet client for transactions (null if no wallet) */
  walletClient: ReturnType<typeof createAvalancheWalletClient> | null;
  /** Current wallet address */
  walletAddress: string | null;
  /** Current chain ID from wallet */
  walletChainId: number | null;
  /** Whether wallet is connected */
  isWalletConnected: boolean;
  /** Available chains for network switching */
  availableChains: ChainConfig[];
  /** Well-known tokens for ICTT */
  wellKnownTokens: ICTTToken[];
  /** Connect wallet function */
  connectWallet: () => Promise<void>;
  /** Disconnect wallet function */
  disconnectWallet: () => void;
  /** Switch chain function */
  switchChain: (targetChain: Chain) => Promise<void>;
};

const AvalancheContext = createContext<AvalancheContextType | null>(null);

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function useTheme(mode: AvalancheConfig['mode'] = 'auto') {
  return useMemo(() => {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    
    // Auto mode - default to dark theme to match Builder Console
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    
    return 'dark'; // Default to dark theme
  }, [mode]);
}

/**
 * Provides the Avalanche context to the app.
 * This is the main provider that should wrap your entire application.
 */
export function AvalancheProvider({
  chain: initialChain,
  chains,
  wellKnownTokens = [],
  config = {},
  children,
  sessionId: providedSessionId,
}: AvalancheProviderProps) {
  const [sessionId] = useSessionStorage(
    'session-id',
    providedSessionId || generateSessionId(),
  );

  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletChainId, setWalletChainId] = useState<number | null>(null);
  const [currentChain, setCurrentChain] = useState<Chain | null>(null);
  const [walletClient, setWalletClient] = useState<ReturnType<typeof createAvalancheWalletClient> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const theme = useTheme(config.mode);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Also set the class for compatibility
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Create ChainKit SDK client (only when chain is available)
  const chainkit = useMemo(() => {
    if (!currentChain) return null;
    return new Avalanche({
      chainId: currentChain.id.toString(),
      ...(config.apiKey && { apiKey: config.apiKey }),
    });
  }, [currentChain, config.apiKey]);

  // Create wallet client when address is available
  const createWalletClient = useCallback(async (address: string, targetChain?: Chain) => {
    if (typeof window === 'undefined') return null;
    
    const provider = (window as any).avalanche;
    if (!provider) return null;

    const chainToUse = targetChain || currentChain || initialChain;

    try {
      const client = createAvalancheWalletClient({
        chain: chainToUse,
        transport: { type: 'custom', provider },
        account: address as `0x${string}`,
      } as any);
      return client;
    } catch (error) {
      console.error('Failed to create wallet client:', error);
      return null;
    }
  }, [currentChain, initialChain]);

  // Handle account changes
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (!accounts || accounts.length === 0) {
      // Wallet disconnected
      setWalletAddress(null);
      setWalletClient(null);
      return;
    }

    const account = accounts[0];
    setWalletAddress(account);

    // Create new wallet client with current account
    const chainToUse = currentChain || initialChain;
    const client = await createWalletClient(account, chainToUse);
    setWalletClient(client);
  }, [createWalletClient, currentChain, initialChain]);

  // Handle chain changes
  const handleChainChanged = useCallback(async (chainId: string | number) => {
    const numericId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
    setWalletChainId(numericId);

    // Update current chain based on chain ID - check all available chains
    const newChain = chains?.find(chain => chain.id === numericId) || 
                     (numericId === avalanche.id ? avalanche : avalancheFuji);
    setCurrentChain(newChain);
    setIsInitializing(false);

    // Recreate wallet client with new chain if wallet is connected
    if (walletAddress) {
      const client = await createWalletClient(walletAddress, newChain);
      setWalletClient(client);
    }
  }, [walletAddress, createWalletClient, chains]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection is only available in browser environment');
    }

    const provider = (window as any).avalanche;
    if (!provider) {
      throw new Error('Avalanche wallet not found. Please install Core wallet.');
    }

    try {
      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        await handleAccountsChanged(accounts);
        
        // Get current chain ID
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (chainId) {
          await handleChainChanged(chainId);
        }
      }
    } catch (error: any) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }, [handleAccountsChanged, handleChainChanged]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setWalletClient(null);
    setWalletChainId(null);
  }, []);

  // Switch chain function
  const switchChain = useCallback(async (targetChain: Chain) => {
    if (typeof window === 'undefined') {
      throw new Error('Chain switching is only available in browser environment');
    }

    const provider = (window as any).avalanche;
    if (!provider) {
      throw new Error('Avalanche wallet not found. Please install Core wallet.');
    }

    // Find matching ChainConfig from availableChains if available
    // ChainConfig extends Chain, so this works for both types
    const chainToUse: Chain = chains?.find(c => c.id === targetChain.id) || targetChain;

    try {
      // Request to switch to the target chain (only need id for switching)
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChain.id.toString(16)}` }],
      });

      // Update current chain
      setCurrentChain(chainToUse);
      setWalletChainId(targetChain.id);

      // Recreate wallet client with new chain
      if (walletAddress) {
        const client = await createWalletClient(walletAddress, chainToUse);
        setWalletClient(client);
      }
    } catch (switchError: any) {
      // If the chain hasn't been added to the wallet, add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [ chainToUse ],
          });

          // Update current chain after adding
          setCurrentChain(chainToUse);
          setWalletChainId(chainToUse.id);

          // Recreate wallet client with new chain
          if (walletAddress) {
            const client = await createWalletClient(walletAddress, chainToUse);
            setWalletClient(client);
          }
        } catch (addError: any) {
          throw new Error(`Failed to add chain: ${addError.message}`);
        }
      } else {
        throw new Error(`Failed to switch chain: ${switchError.message}`);
      }
    }
  }, [walletAddress, createWalletClient, chains]);

  // Set up wallet event listeners and initialize chain
  useEffect(() => {
    if (typeof window === 'undefined') {
      // No wallet available, use initial chain
      setCurrentChain(initialChain);
      setIsInitializing(false);
      return;
    }

    const provider = (window as any).avalanche;
    if (!provider || !provider.on) {
      // No wallet provider, use initial chain
      setCurrentChain(initialChain);
      setIsInitializing(false);
      return;
    }

    // Add event listeners
    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    // Check if already connected and get actual chain
    const checkConnection = async () => {
      try {
        // Always get the chain ID first, even if wallet is not connected
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (chainId) {
          await handleChainChanged(chainId);
        } else {
          // No chain ID available, use initial chain
          setCurrentChain(initialChain);
        }
        
        // Then check accounts
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          await handleAccountsChanged(accounts);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
        // On error, fall back to initial chain
        setCurrentChain(initialChain);
      } finally {
        setIsInitializing(false);
      }
    };

    checkConnection();

    // Cleanup event listeners
    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, initialChain]);

  const contextValue = useMemo(() => {
    const avalancheConfig: Required<AvalancheConfig> = {
      name: config.name || 'Avalanche App',
      logo: config.logo || '',
      mode: config.mode || 'auto',
      theme: config.theme || 'default',
      rpcUrl: config.rpcUrl || '',
      apiKey: config.apiKey || '',
    };

    // Don't return context until we have the actual chain (unless no wallet available)
    if (isInitializing && typeof window !== 'undefined' && (window as any).avalanche) {
      // Still initializing, return null chain to prevent wrong data
      return null;
    }

    // Use currentChain if available, otherwise fall back to initialChain
    const activeChain = currentChain || initialChain;

    return {
      chain: activeChain,
      config: avalancheConfig,
      sessionId,
      chainkit: chainkit || new Avalanche({
        chainId: activeChain.id.toString(),
        ...(config.apiKey && { apiKey: config.apiKey }),
      }),
      walletClient,
      walletAddress,
      walletChainId,
      isWalletConnected: !!walletAddress,
      availableChains: chains as ChainConfig[] || [],
      wellKnownTokens,
      connectWallet,
      disconnectWallet,
      switchChain,
    };
  }, [
    currentChain,
    initialChain,
    isInitializing,
    chains,
    wellKnownTokens,
    config,
    sessionId,
    chainkit,
    walletClient,
    walletAddress,
    walletChainId,
    connectWallet,
    disconnectWallet,
    switchChain,
  ]);

  // Don't render children until we have the chain (unless no wallet available)
  if (contextValue === null) {
    return null; // or a loading spinner
  }

  return (
    <AvalancheContext.Provider value={contextValue}>
      {children}
    </AvalancheContext.Provider>
  );
}

/**
 * Hook to access the Avalanche context.
 * Must be used within an AvalancheProvider.
 */
export function useAvalanche() {
  const context = useContext(AvalancheContext);
  if (!context) {
    throw new Error('useAvalanche must be used within an AvalancheProvider');
  }
  return context;
}

/**
 * Hook to get available chains for network switching.
 */
export function useAvailableChains() {
  const { availableChains } = useAvalanche();
  return availableChains;
}
