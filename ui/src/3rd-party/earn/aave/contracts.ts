import { createPublicClient, http, formatUnits } from 'viem';
import type { Avalanche } from '@avalanche-sdk/chainkit';
import { ERC20_METADATA_ABI } from '../../../utils/erc20';
import type { ChainConfig } from '../../../types/chainConfig';
import type { EarnPool } from '../../../earn/types';
import { POOL_DATA_PROVIDER_ABI } from './abis';

// Contract addresses
export const POOL_ADDRESSES_PROVIDER = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb' as const;
export const POOL_DATA_PROVIDER = '0x243Aa95cAC2a25651eda86e80bEe66114413c43b' as const;

/**
 * Get token info from ERC20 contract
 */
async function getTokenInfo(
  publicClient: ReturnType<typeof createPublicClient>,
  tokenAddress: `0x${string}`
): Promise<{ name: string; symbol: string; decimals: number }> {
  try {
    const [name, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_METADATA_ABI,
        functionName: 'name',
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_METADATA_ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_METADATA_ABI,
        functionName: 'decimals',
      }),
    ]);
    
    return {
      name: name as string,
      symbol: symbol as string,
      decimals: Number(decimals),
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    // Return defaults if contract call fails
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      decimals: 18,
    };
  }
}

/**
 * Fetch AAVE pools from contracts
 */
export async function fetchAavePools(
  chain: ChainConfig,
  chainkit: Avalanche,
  userAddress?: `0x${string}`
): Promise<EarnPool[]> {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Get PoolDataProvider address (use the provided address)
  const poolDataProviderAddress = POOL_DATA_PROVIDER as `0x${string}`;

  // Get all reserves tokens
  const reservesTokens = await publicClient.readContract({
    address: poolDataProviderAddress,
    abi: POOL_DATA_PROVIDER_ABI,
    functionName: 'getAllReservesTokens',
  }) as Array<{ symbol: string; tokenAddress: `0x${string}` }>;

  // Fetch data for each reserve
  const pools: EarnPool[] = await Promise.all(
    reservesTokens.map(async (reserve) => {
      const tokenAddress = reserve.tokenAddress;
      
      try {
        // Fetch reserve configuration, token info, aToken supply, and contract metadata in parallel
        const [reserveConfig, tokenInfo, aTokenSupply, contractMetadataResult] = await Promise.all([
          publicClient.readContract({
            address: poolDataProviderAddress,
            abi: POOL_DATA_PROVIDER_ABI,
            functionName: 'getReserveConfigurationData',
            args: [tokenAddress],
          }),
          getTokenInfo(publicClient, tokenAddress),
          publicClient.readContract({
            address: poolDataProviderAddress,
            abi: POOL_DATA_PROVIDER_ABI,
            functionName: 'getATokenTotalSupply',
            args: [tokenAddress],
          }),
          chainkit.data.evm.contracts.getMetadata({
            address: tokenAddress,
            chainId: chain.id.toString(),
          }).catch(() => null), // Gracefully handle errors
        ]);

        // Parse reserve configuration
        const configResult = reserveConfig as [
          bigint, // decimals
          bigint,
          bigint,
          bigint,
          bigint,
          boolean,
          boolean,
          boolean,
          boolean, // isActive
          boolean,
        ];
        
        const isActive = configResult[8];
        
        // Format total supply
        const totalAToken = aTokenSupply as bigint;
        const totalSupply = formatUnits(totalAToken, tokenInfo.decimals);
        
        // Use contract metadata if available, otherwise use token info
        let finalTokenInfo = tokenInfo;
        let tokenImage: string | null = null;
        if (contractMetadataResult) {
          try {
            const metadata = await contractMetadataResult;
            if (metadata && typeof metadata === 'object' && 'contractMetadata' in metadata) {
              const contractMeta = (metadata as any).contractMetadata;
              if (contractMeta && typeof contractMeta === 'object') {
                finalTokenInfo = {
                  name: contractMeta.name || tokenInfo.name,
                  symbol: contractMeta.symbol || tokenInfo.symbol,
                  decimals: tokenInfo.decimals,
                };
              }
            }
            // Extract logoAsset imageUri if available
            if (metadata && typeof metadata === 'object' && 'logoAsset' in metadata) {
              const logoAsset = (metadata as any).logoAsset;
              if (logoAsset && typeof logoAsset === 'object' && 'imageUri' in logoAsset) {
                tokenImage = logoAsset.imageUri || null;
              }
            }
          } catch (error) {
            // Use tokenInfo if metadata fetch fails
            console.error('Error parsing contract metadata:', error);
          }
        }
        
        // Fetch user data if address provided
        let userDeposited: string | undefined;
        let userRewards: string | undefined;
        
        if (userAddress) {
          try {
            const userReserveData = await publicClient.readContract({
              address: poolDataProviderAddress,
              abi: POOL_DATA_PROVIDER_ABI,
              functionName: 'getUserReserveData',
              args: [tokenAddress, userAddress],
            }) as readonly [
              bigint, // currentATokenBalance
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              number, // stableRateLastUpdated (uint40)
              boolean,
            ];
            
            const userBalance = userReserveData[0];
            if (userBalance > 0n) {
              userDeposited = formatUnits(userBalance, tokenInfo.decimals);
            }
          } catch (error) {
            console.error(`Error fetching user data for ${tokenAddress}:`, error);
          }
        }
        
        // Get aToken address for pool address
        const reserveTokensAddresses = await publicClient.readContract({
          address: poolDataProviderAddress,
          abi: POOL_DATA_PROVIDER_ABI,
          functionName: 'getReserveTokensAddresses',
          args: [tokenAddress],
        }) as readonly [`0x${string}`, `0x${string}`, `0x${string}`];
        const aTokenAddress = reserveTokensAddresses[0];
        
        return {
          id: `aave-${finalTokenInfo.symbol.toLowerCase()}-${chain.id}`,
          name: finalTokenInfo.symbol,
          token: {
            address: tokenAddress,
            chainId: chain.id,
            decimals: finalTokenInfo.decimals,
            symbol: finalTokenInfo.symbol,
            name: finalTokenInfo.name,
            image: tokenImage,
          },
          totalSupply,
          status: isActive ? 'active' : 'inactive',
          provider: 'aave',
          poolAddress: aTokenAddress,
          userDeposited,
          userRewards,
        };
      } catch (error) {
        console.error(`Error processing reserve ${tokenAddress}:`, error);
        // Return null for failed reserves, filter them out later
        return null as unknown as EarnPool;
      }
    })
  );

  // Filter out failed reserves
  return pools.filter((pool): pool is EarnPool => pool !== null);
}

