import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import type { Avalanche } from '@avalanche-sdk/chainkit';
import type { EarnPool } from '../../../earn/types';
import type { EarnProviderBase } from '../../../earn/providers/base';
import { createPublicClient } from 'viem';
import { fetchAavePools } from './contracts';
import { checkTokenApproval, approveTokenForAavePool } from './approve';
import { depositToAavePool } from './deposit';
import { withdrawFromAavePool } from './withdraw';
import { claimAaveRewards } from './claim';

/**
 * AAVE Earn Provider Implementation
 */
export class AaveProvider implements EarnProviderBase {
  readonly providerId = 'aave';

  async fetchPools(
    chain: ChainConfig,
    chainkit: Avalanche,
    userAddress?: `0x${string}`
  ): Promise<EarnPool[]> {
    return fetchAavePools(chain, chainkit, userAddress);
  }

  async checkApproval(params: {
    publicClient: ReturnType<typeof createPublicClient>;
    pool: EarnPool;
    amount: string;
    owner: `0x${string}`;
  }): Promise<{ needsApproval: boolean; currentAllowance: bigint; requiredAmount: bigint }> {
    const { publicClient, pool, amount, owner } = params;
    
    const assetAddress = (pool.token.address as `0x${string}`) || '0x0000000000000000000000000000000000000000' as `0x${string}`;
    
    if (!assetAddress || assetAddress === '0x0000000000000000000000000000000000000000') {
      return {
        needsApproval: false,
        currentAllowance: BigInt(0),
        requiredAmount: BigInt(0),
      };
    }

    // Get pool address from PoolAddressesProvider
    const { POOL_ADDRESSES_PROVIDER } = await import('./contracts');
    const { POOL_ADDRESSES_PROVIDER_ABI } = await import('./abis');
    
    const poolAddress = await publicClient.readContract({
      address: POOL_ADDRESSES_PROVIDER as `0x${string}`,
      abi: POOL_ADDRESSES_PROVIDER_ABI,
      functionName: 'getPool',
    }) as `0x${string}`;

    return checkTokenApproval({
      publicClient,
      asset: assetAddress,
      amount,
      decimals: pool.token.decimals,
      owner,
      spender: poolAddress,
    });
  }

  async approveToken(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool, amount } = params;
    
    const assetAddress = (pool.token.address as `0x${string}`) || '0x0000000000000000000000000000000000000000' as `0x${string}`;
    
    return approveTokenForAavePool({
      walletClient,
      chain,
      asset: assetAddress,
      amount,
      decimals: pool.token.decimals,
    });
  }

  async deposit(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool, amount } = params;
    
    if (!walletClient.account) {
      throw new Error('Wallet not connected');
    }

    const assetAddress = (pool.token.address as `0x${string}`) || '0x0000000000000000000000000000000000000000' as `0x${string}`;
    
    return depositToAavePool({
      walletClient,
      chain,
      asset: assetAddress,
      amount,
      decimals: pool.token.decimals,
      onBehalfOf: walletClient.account.address as `0x${string}`,
    });
  }

  async withdraw(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool, amount } = params;
    
    if (!walletClient.account) {
      throw new Error('Wallet not connected');
    }

    const assetAddress = (pool.token.address as `0x${string}`) || '0x0000000000000000000000000000000000000000' as `0x${string}`;
    
    return withdrawFromAavePool({
      walletClient,
      chain,
      asset: assetAddress,
      amount,
      decimals: pool.token.decimals,
      to: walletClient.account.address as `0x${string}`,
    });
  }

  async claimRewards(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool } = params;
    
    if (!walletClient.account) {
      throw new Error('Wallet not connected');
    }

    const assetAddress = (pool.token.address as `0x${string}`) || '0x0000000000000000000000000000000000000000' as `0x${string}`;
    
    return claimAaveRewards({
      walletClient,
      chain,
      assets: [assetAddress],
      to: walletClient.account.address as `0x${string}`,
    });
  }
}

