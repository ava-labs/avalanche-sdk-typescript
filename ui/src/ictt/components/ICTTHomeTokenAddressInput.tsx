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
}

export interface ICTTHomeTokenAddressInputProps {
  className?: string;
  label?: string;
}

export function ICTTHomeTokenAddressInput({
  className,
  label = "ICTT Home Contract Address"
}: ICTTHomeTokenAddressInputProps) {
  const { fromChain, setSelectedToken, setTokenHomeContract } = useICTTContext();
  const { availableChains, walletAddress, isWalletConnected } = useAvalanche();
  const [homeContractAddress, setHomeContractAddress] = useState<string>('');
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


  // Get token address from ICTT home contract
  const getTokenAddressFromHome = useCallback(async (homeContract: string): Promise<string> => {
    // Call getTokenAddress() function on the home contract
    // This is a custom function on ICTT home contracts, not part of ERC20
    // So we use raw RPC call instead of viem's readContract
    const rpcUrl = availableChains.find(c => c.id.toString() === fromChain)?.rpcUrls?.default?.http?.[0];
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ${fromChain}`);
    }
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: homeContract,
            data: '0x10fe9ae8', // getTokenAddress() function selector
          },
          'latest'
        ],
        id: 1,
      }),
    });

    const result = await response.json();
    
    if (result.error || !result.result || result.result === '0x') {
      throw new Error('Failed to get token address from home contract');
    }

    // Decode the address from the result (last 20 bytes)
    const tokenAddress = '0x' + result.result.slice(-40);
    
    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token address returned from home contract');
    }

    return tokenAddress;
  }, [fromChain, availableChains]);

  // Validate token contract using ERC20 interface
  const validateTokenContract = useCallback(async (tokenAddress: string) => {
    const publicClient = getPublicClient(fromChain);
    
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
  }, [fromChain, getPublicClient, walletAddress, isWalletConnected]);

  // Validate ICTT home contract and get token info
  const validateHomeContract = useCallback(async (homeContractAddress: string) => {
    if (!homeContractAddress || !isAddress(homeContractAddress)) {
      setTokenValidation({
        isValidating: false,
        isValid: false,
        error: 'Invalid home contract address format',
      });
      return;
    }

    setTokenValidation({ isValidating: true, isValid: false });
    setTokenBalance(null);

    try {
      // Step 1: Get token address from home contract
      const tokenAddress = await getTokenAddressFromHome(homeContractAddress);
      
      // Step 2: Validate the token contract
      const tokenInfo = await validateTokenContract(tokenAddress);

      setTokenValidation({
        isValidating: false,
        isValid: true,
        tokenInfo,
      });

      // Update the selected token and home contract in the context
      // For manual mode, we just need a simple token structure (not ICTT token)
      setSelectedToken({
        address: tokenInfo.address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        chainId: fromChain,
        // No ictt field - this is a regular ERC20 token
      });
      
      // Set the home contract address in the context
      setTokenHomeContract(homeContractAddress);

    } catch (error) {
      setTokenValidation({
        isValidating: false,
        isValid: false,
        error: error instanceof Error ? error.message : 'Failed to validate home contract',
      });
      setSelectedToken(null);
      setTokenHomeContract(null);
    }
  }, [getTokenAddressFromHome, validateTokenContract, setSelectedToken, setTokenHomeContract, fromChain]);

  // Handle address change with debouncing
  useEffect(() => {
    if (!homeContractAddress) {
      setTokenValidation({ isValidating: false, isValid: false });
      setSelectedToken(null);
      setTokenHomeContract(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      validateHomeContract(homeContractAddress);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [homeContractAddress, validateHomeContract, setSelectedToken, setTokenHomeContract]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {/* Input Container with Token Display */}
      <div className="relative">
        <div className="flex">
          {/* Home Contract Address Input */}
          <div className="flex-1">
            <input
              type="text"
              value={homeContractAddress}
              onChange={(e) => setHomeContractAddress(e.target.value)}
              placeholder="0x... (ICTT Home Contract)"
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
                    chainId: parseInt(fromChain),
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
            ) : homeContractAddress && tokenValidation.isValidating ? (
              <div className="flex items-center justify-start gap-2 text-muted-foreground w-full">
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                <span className="text-sm">Validating...</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Validation Status Below */}
        {homeContractAddress && (
          <div className="flex items-center gap-2 text-xs mt-2">
            {tokenValidation.isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Validating ICTT home contract...</span>
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
