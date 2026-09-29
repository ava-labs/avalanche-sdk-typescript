import { createPublicClient, http, formatUnits } from 'viem';
import type { Avalanche } from '@avalanche-sdk/chainkit';
import { ERC20_METADATA_ABI } from '../../../utils/erc20';
import type { ChainConfig } from '../../../types/chainConfig';
import type { EarnPool } from '../../../earn/types';
import { UNITROLLER_ABI, QI_TOKEN_ABI } from './abis';

// Contract addresses
export const BENQI_UNITROLLER = '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4' as const;


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
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_METADATA_ABI,
        functionName: 'name',
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
      decimals: decimals as number,
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    throw error;
  }
}

/**
 * Fetch Benqi pools from contracts
 */
export async function fetchBenqiPools(
  chain: ChainConfig,
  chainkit: Avalanche,
  userAddress?: `0x${string}`
): Promise<EarnPool[]> {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const unitrollerAddress = BENQI_UNITROLLER as `0x${string}`;

  // Get all markets from Unitroller
  const markets = await publicClient.readContract({
    address: unitrollerAddress,
    abi: UNITROLLER_ABI,
    functionName: 'getAllMarkets',
  }) as `0x${string}`[];

  // Fetch data for each market
  const pools: EarnPool[] = await Promise.all(
    markets.map(async (qiTokenAddress) => {
      try {
        // Check if market is listed and not paused
        const [marketInfo, mintPaused] = await Promise.all([
          publicClient.readContract({
            address: unitrollerAddress,
            abi: UNITROLLER_ABI,
            functionName: 'markets',
            args: [qiTokenAddress],
          }),
          publicClient.readContract({
            address: unitrollerAddress,
            abi: UNITROLLER_ABI,
            functionName: 'mintGuardianPaused',
            args: [qiTokenAddress],
          }).catch(() => false), // If function doesn't exist, assume not paused
        ]);

        const isListed = (marketInfo as readonly [boolean, bigint, number])[0];
        const isMintPaused = mintPaused as boolean;

        // Filter out unlisted or paused markets
        if (!isListed || isMintPaused) {
          return null as unknown as EarnPool;
        }

        // Get QiToken info
        const [qiTokenSymbol, qiTokenName, qiTokenDecimals, underlyingAddress, totalSupply, exchangeRate] = await Promise.all([
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'symbol',
          }),
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'name',
          }),
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'underlying',
          }).catch(() => null as `0x${string}` | null),
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'totalSupply',
          }),
          publicClient.readContract({
            address: qiTokenAddress,
            abi: QI_TOKEN_ABI,
            functionName: 'exchangeRateStored',
          }),
        ]);

        // Check if underlying exists - if not, treat as native AVAX
        const isNative = !underlyingAddress || 
                        underlyingAddress === '0x0000000000000000000000000000000000000000' ||
                        underlyingAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // Common native token address
        
        // For native tokens, use AVAX info
        let tokenInfo: { name: string; symbol: string; decimals: number };
        let underlyingTokenAddress: `0x${string}`;
        
        if (isNative) {
          // Native AVAX token
          tokenInfo = {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18,
          };
          underlyingTokenAddress = '0x0000000000000000000000000000000000000000' as `0x${string}`;
        } else {
          // ERC20 token - get underlying token info
          underlyingTokenAddress = underlyingAddress;
          tokenInfo = await getTokenInfo(publicClient, underlyingTokenAddress).catch(() => ({
            name: qiTokenName as string,
            symbol: qiTokenSymbol as string,
            decimals: qiTokenDecimals as number,
          }));
        }

        // Try to get contract metadata from Glacier (only for ERC20 tokens)
        let tokenImage: string | null = null;
        if (!isNative) {
          try {
            const contractMetadata = await chainkit.data.evm.contracts.getMetadata({
              address: underlyingTokenAddress,
              chainId: chain.id.toString(),
            });

            if (contractMetadata && typeof contractMetadata === 'object' && 'contractMetadata' in contractMetadata) {
              const contractMeta = (contractMetadata as any).contractMetadata;
              if (contractMeta && typeof contractMeta === 'object') {
                tokenInfo = {
                  name: contractMeta.name || tokenInfo.name,
                  symbol: contractMeta.symbol || tokenInfo.symbol,
                  decimals: tokenInfo.decimals,
                };
              }
            }

            // Extract logoAsset imageUri if available
            if (contractMetadata && typeof contractMetadata === 'object' && 'logoAsset' in contractMetadata) {
              const logoAsset = (contractMetadata as any).logoAsset;
              if (logoAsset && typeof logoAsset === 'object' && 'imageUri' in logoAsset) {
                tokenImage = logoAsset.imageUri || null;
              }
            }
          } catch (error) {
            console.error('Error fetching contract metadata:', error);
          }
        }

        // Calculate total supply in underlying tokens
        // totalSupply (qiToken) * exchangeRate / 1e18 = underlying amount
        const exchangeRateValue = exchangeRate as bigint;
        const totalSupplyValue = totalSupply as bigint;
        const totalUnderlying = (totalSupplyValue * exchangeRateValue) / BigInt(10 ** 18);
        const totalSupplyFormatted = formatUnits(totalUnderlying, tokenInfo.decimals);

        // Fetch user data if address provided
        let userDeposited: string | undefined;
        if (userAddress) {
          try {
            const userBalanceUnderlying = await publicClient.readContract({
              address: qiTokenAddress,
              abi: QI_TOKEN_ABI,
              functionName: 'balanceOfUnderlying',
              args: [userAddress],
            }) as bigint;

            if (userBalanceUnderlying > 0n) {
              userDeposited = formatUnits(userBalanceUnderlying, tokenInfo.decimals);
            }
          } catch (error) {
            console.error(`Error fetching user data for ${qiTokenAddress}:`, error);
          }
        }

        return {
          id: `benqi-${tokenInfo.symbol.toLowerCase()}-${chain.id}`,
          name: tokenInfo.symbol,
          token: {
            address: underlyingTokenAddress as `0x${string}`,
            chainId: chain.id,
            decimals: tokenInfo.decimals,
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            image: tokenImage,
          },
          totalSupply: totalSupplyFormatted,
          status: 'active',
          provider: 'benqi',
          poolAddress: qiTokenAddress,
          userDeposited,
        };
      } catch (error) {
        console.error(`Error processing market ${qiTokenAddress}:`, error);
        return null as unknown as EarnPool;
      }
    })
  );

  return pools.filter((pool): pool is EarnPool => pool !== null);
}

