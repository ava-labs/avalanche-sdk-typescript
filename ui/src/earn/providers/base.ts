import type { ChainConfig } from '../../types/chainConfig';
import type { WalletClient } from 'viem';
import type { Avalanche } from '@avalanche-sdk/chainkit';
import type { EarnPool } from '../types';

/**
 * Abstract base interface for earn providers
 * All earn providers (AAVE, Benqi, etc.) must implement this interface
 */
export interface EarnProviderBase {
  /**
   * Provider identifier (e.g., 'aave', 'benqi')
   */
  readonly providerId: string;

  /**
   * Fetch pools from the provider
   */
  fetchPools(
    chain: ChainConfig,
    chainkit: Avalanche,
    userAddress?: `0x${string}`
  ): Promise<EarnPool[]>;

  /**
   * Check if token approval is needed before deposit
   */
  checkApproval(params: {
    publicClient: ReturnType<typeof import('viem').createPublicClient>;
    pool: EarnPool;
    amount: string;
    owner: `0x${string}`;
  }): Promise<{ needsApproval: boolean; currentAllowance: bigint; requiredAmount: bigint }>;

  /**
   * Approve token spending
   */
  approveToken(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }>;

  /**
   * Deposit tokens to pool
   */
  deposit(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }>;

  /**
   * Withdraw tokens from pool
   */
  withdraw(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
    amount: string;
  }): Promise<{ txHash: `0x${string}` }>;

  /**
   * Claim rewards from pool
   */
  claimRewards(params: {
    walletClient: WalletClient;
    chain: ChainConfig;
    pool: EarnPool;
  }): Promise<{ txHash: `0x${string}` }>;
}

