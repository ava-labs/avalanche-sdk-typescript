'use client';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '../../styles/theme';
import { TokenImage } from '../../token';
import { XCircle, Loader2 } from 'lucide-react';
import { useICTTContext } from './ICTTProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { isAddress, formatUnits, createPublicClient, http } from 'viem';
import { ERC20_ABI } from '../../utils/erc20';

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}

interface TokenValidationState {
  isValidating: boolean;
  isValid: boolean;
  error?: string;
  tokenInfo?: TokenInfo;
  homeContractAddress?: string;
}

export interface ICTTRemoteTokenAddressInputProps {
  className?: string;
  label?: string;
  onRemoteContractChange?: (remoteContract: string | null) => void;
  onHomeContractChange?: (homeContract: string | null) => void;
}

export function ICTTRemoteTokenAddressInput({
  className,
  label = "ICTT Remote Contract Address",
  onRemoteContractChange,
  onHomeContractChange
}: ICTTRemoteTokenAddressInputProps) {
  const { toChain } = useICTTContext();
  const { availableChains, walletAddress, isWalletConnected } = useAvalanche();
  const [remoteContractAddress, setRemoteContractAddress] = useState<string>('');
  const [tokenValidation, setTokenValidation] = useState<TokenValidationState>({
    isValidating: false,
    isValid: false,
  });
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // Get chain config and create public client
  const getPublicClient = useCallback((chainId: string) => {
    const chainData = availableChains.find(c => c.id.toString() === chainId);
    
    if (!chainData) {
      throw new Error(`Chain ${chainId} not found in availableChains`);
    }
    
    const rpcUrl = chainData.rpcUrls?.default?.http?.[0];
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ${chainId}. Please ensure the chain is properly configured in AvalancheProvider.`);
    }
    
    return createPublicClient({
      chain: chainData as any, // ChainConfig should be compatible with viem Chain
      transport: http(rpcUrl),
    });
  }, [availableChains]);

  // Get token home address from ICTT remote contract
  const getTokenHomeAddressFromRemote = useCallback(async (remoteContract: string): Promise<string> => {
    // Call getTokenHomeAddress() function on the remote contract
    // This is a custom function on ICTT remote contracts, not part of ERC20
    // So we use raw RPC call instead of viem's readContract
    const rpcUrl = availableChains.find(c => c.id.toString() === toChain)?.rpcUrls?.default?.http?.[0];
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ${toChain}`);
    }
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: remoteContract,
            data: '0xc3cd6927', // getTokenHomeAddress() function selector
          },
          'latest'
        ],
        id: 1,
      }),
    });

    const result = await response.json();
    
    if (result.error || !result.result || result.result === '0x') {
      throw new Error('Failed to get token home address from remote contract');
    }

    // Decode the address from the result (last 20 bytes)
    const homeAddress = '0x' + result.result.slice(-40);
    
    if (!isAddress(homeAddress)) {
      throw new Error('Invalid token home address returned from remote contract');
    }

    return homeAddress;
  }, [toChain, availableChains]);


  // Validate token contract using ERC20 interface
  const validateTokenContract = useCallback(async (tokenAddress: string, chainId: string) => {
    const publicClient = getPublicClient(chainId);
    
    // Read token metadata using ERC20 ABI
    const [name, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'name',
      }) as Promise<string>,
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }) as Promise<string>,
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as Promise<number>,
    ]);

    if (!name || !symbol || isNaN(decimals)) {
      throw new Error('Invalid token contract data');
    }

    // Read balance if wallet is connected
    if (walletAddress && isWalletConnected) {
      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`],
        }) as bigint;
        
        const formattedBalance = formatUnits(balance, decimals);
        const numericBalance = parseFloat(formattedBalance);
        const displayBalance = numericBalance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        });
        setTokenBalance(displayBalance);
      } catch {
        setTokenBalance('0');
      }
    } else {
      setTokenBalance(null);
    }

    return {
      name,
      symbol,
      decimals,
      address: tokenAddress,
    };
  }, [getPublicClient, walletAddress, isWalletConnected]);

  // Validate ICTT remote contract and get token info
  const validateRemoteContract = useCallback(async (remoteContractAddress: string) => {
    if (!remoteContractAddress || !isAddress(remoteContractAddress)) {
      setTokenValidation({
        isValidating: false,
        isValid: false,
        error: 'Invalid remote contract address format',
      });
      return;
    }

    setTokenValidation({ isValidating: true, isValid: false });
    setTokenBalance(null);

    try {
      // Step 1: Get token home address from remote contract for validation
      const homeContractAddress = await getTokenHomeAddressFromRemote(remoteContractAddress);
      
      // Step 2: Get token metadata directly from the remote contract address (not from home contract)
      const tokenInfo = await validateTokenContract(remoteContractAddress, toChain);

      setTokenValidation({
        isValidating: false,
        isValid: true,
        tokenInfo,
        homeContractAddress,
      });

      // Notify parent components about the contract addresses
      onRemoteContractChange?.(remoteContractAddress);
      onHomeContractChange?.(homeContractAddress);

    } catch (error) {
      setTokenValidation({
        isValidating: false,
        isValid: false,
        error: error instanceof Error ? error.message : 'Failed to validate remote contract',
      });
      onRemoteContractChange?.(null);
      onHomeContractChange?.(null);
    }
  }, [getTokenHomeAddressFromRemote, validateTokenContract, toChain, onRemoteContractChange, onHomeContractChange]);

  // Handle address change with debouncing
  useEffect(() => {
    if (!remoteContractAddress) {
      setTokenValidation({ isValidating: false, isValid: false });
      onRemoteContractChange?.(null);
      onHomeContractChange?.(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      validateRemoteContract(remoteContractAddress);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [remoteContractAddress, validateRemoteContract, onRemoteContractChange, onHomeContractChange]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {/* Input Container with Token Display */}
      <div className="relative">
        <div className="flex">
          {/* Remote Contract Address Input */}
          <div className="flex-1">
            <input
              type="text"
              value={remoteContractAddress}
              onChange={(e) => setRemoteContractAddress(e.target.value)}
              placeholder="0x... (ICTT Remote Contract)"
              className={cn(
                "flex h-12 w-full border border-input bg-background px-3 py-2 text-base",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
                "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                "rounded-l-md border-r-0", // Left side rounded, no right border
                tokenValidation.isValid && "border-green-500",
                tokenValidation.error && "border-destructive"
              )}
            />
          </div>

          {/* Token Display - looks like part of input */}
          <div className={cn(
            "flex items-center h-12 px-3 py-2 border border-input bg-background relative",
            "rounded-r-md border-l-0 min-w-[200px]", // Right side rounded, no left border
            tokenValidation.isValid && "border-green-500",
            tokenValidation.error && "border-destructive"
          )}>
            {/* Left Divider */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 bg-border" />
            {tokenValidation.isValid && tokenValidation.tokenInfo ? (
              <div className="flex items-center justify-start gap-3 w-full">
                <TokenImage
                  token={{
                    symbol: tokenValidation.tokenInfo.symbol,
                    name: tokenValidation.tokenInfo.name,
                    address: tokenValidation.tokenInfo.address,
                    decimals: tokenValidation.tokenInfo.decimals,
                    chainId: parseInt(toChain),
                    image: null,
                  }}
                  size={20}
                />
                <div className="flex flex-col items-start">
                  <div className="font-medium text-sm">
                    {tokenValidation.tokenInfo.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tokenValidation.tokenInfo.symbol}
                  </div>
                </div>
              </div>
            ) : remoteContractAddress && tokenValidation.isValidating ? (
              <div className="flex items-center justify-start gap-2 text-muted-foreground w-full">
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                <span className="text-sm">Validating...</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Validation Status Below */}
        {remoteContractAddress && (
          <div className="flex items-center gap-2 text-xs mt-2">
            {tokenValidation.isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Validating ICTT remote contract...</span>
              </>
            ) : tokenValidation.error ? (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">{tokenValidation.error}</span>
              </>
            ) : null}
          </div>
        )}

        {/* Token Balance */}
        {tokenValidation.isValid && tokenValidation.tokenInfo && (
          <p className="text-xs text-muted-foreground">
            {isWalletConnected ? (
              tokenBalance !== null ? (
                <>Balance: {tokenBalance} {tokenValidation.tokenInfo.symbol}</>
              ) : (
                'Connect wallet to see balance'
              )
            ) : (
              'Connect wallet to see balance'
            )}
          </p>
        )}
      </div>

    </div>
  );
}
