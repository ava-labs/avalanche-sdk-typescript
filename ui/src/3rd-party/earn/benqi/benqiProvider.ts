import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import type { Avalanche } from '@avalanche-sdk/chainkit';
import type { EarnPool } from '../../../earn/types';
import type { EarnProviderBase } from '../../../earn/providers/base';
import { createPublicClient } from 'viem';
import { fetchBenqiPools } from './contracts';
import { checkTokenApprovalForBenqi, approveTokenForBenqiPool } from './approve';
import { depositToBenqiPool } from './deposit';
import { withdrawFromBenqiPool } from './withdraw';
import { claimBenqiRewards } from './claim';

/**
 * Benqi Earn Provider Implementation
 */
export class BenqiProvider implements EarnProviderBase {
  readonly providerId = 'benqi';

  async fetchPools(
    chain: ChainConfig,
    chainkit: Avalanche,
    userAddress?: `0x${string}`
  ): Promise<EarnPool[]> {
    return fetchBenqiPools(chain, chainkit, userAddress);
  }

  async checkApproval(params: {
    publicClient: ReturnType<typeof createPublicClient>;
    pool: EarnPool;
    amount: string;
    owner: `0x${string}`;
  }): Promise<{ needsApproval: boolean; currentAllowance: bigint; requiredAmount: bigint }> {
    const { publicClient, pool, amount, owner } = params;
    
    return checkTokenApprovalForBenqi({
      publicClient,
      qiTokenAddress: pool.poolAddress as `0x${string}`,
      amount,
      decimals: pool.token.decimals,
      owner,
    });
  }

  async approveToken(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool, amount } = params;
    
    return approveTokenForBenqiPool({
      walletClient,
      chain,
      qiTokenAddress: pool.poolAddress as `0x${string}`,
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
    
    return depositToBenqiPool({
      walletClient,
      chain,
      qiTokenAddress: pool.poolAddress as `0x${string}`,
      amount,
      decimals: pool.token.decimals,
    });
  }

  async withdraw(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool, amount } = params;
    
    return withdrawFromBenqiPool({
      walletClient,
      chain,
      qiTokenAddress: pool.poolAddress as `0x${string}`,
      amount,
      decimals: pool.token.decimals,
    });
  }

  async claimRewards(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
  }): Promise<{ txHash: `0x${string}` }> {
    const { walletClient, chain, pool } = params;
    
    return claimBenqiRewards({
      walletClient,
      chain,
      qiTokenAddresses: [pool.poolAddress as `0x${string}`],
      rewardType: 0, // 0 for QI token rewards
    });
  }
}

