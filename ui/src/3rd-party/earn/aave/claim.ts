import { createPublicClient, http } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { POOL_ADDRESSES_PROVIDER } from './contracts';
import {
  POOL_ADDRESSES_PROVIDER_FULL_ABI,
  REWARDS_CONTROLLER_ABI,
} from './abis';

/**
 * Claim rewards from AAVE pool
 */
export async function claimAaveRewards(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  assets: `0x${string}`[];
  to?: `0x${string}`;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, assets, to } = params;

  if (!walletClient.account) {
    throw new Error('Wallet not connected');
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Get RewardsController address
  // AAVE v3 uses a RewardsController contract
  // The address is stored in PoolAddressesProvider with id "REWARDS_CONTROLLER"
  let rewardsControllerAddress: `0x${string}`;
  
  try {
    // Try to get RewardsController address from PoolAddressesProvider
    const REWARDS_CONTROLLER_ID = '0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532'; // keccak256("REWARDS_CONTROLLER")
    rewardsControllerAddress = await publicClient.readContract({
      address: POOL_ADDRESSES_PROVIDER as `0x${string}`,
      abi: POOL_ADDRESSES_PROVIDER_FULL_ABI,
      functionName: 'getAddress',
      args: [REWARDS_CONTROLLER_ID as `0x${string}`],
    }) as `0x${string}`;
  } catch (error) {
    // If RewardsController is not found, try to get it from the pool
    // For now, we'll use a fallback approach
    throw new Error('RewardsController not found. Rewards claiming may not be available on this chain.');
  }

  // Use provided 'to' address or default to wallet address
  const toAddress = to || walletClient.account.address as `0x${string}`;

  // Get rewards list to determine which reward token to claim
  // For simplicity, we'll claim all available rewards (amount = type(uint256).max)
  const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  // Claim rewards for all provided assets
  // For AAVE, reward token is typically the native token or a specific reward token
  // We'll use address(0) to claim all rewards
  const txHash = await walletClient.writeContract({
    address: rewardsControllerAddress,
    abi: REWARDS_CONTROLLER_ABI,
    functionName: 'claimRewards',
    args: [assets, maxAmount, toAddress, '0x0000000000000000000000000000000000000000' as `0x${string}`],
    chain,
    account: walletClient.account,
  });

  // Wait for transaction receipt
  const receipt = await waitForTransactionReceipt(publicClient, {
    hash: txHash,
  });

  if (receipt.status === 'reverted') {
    throw new Error('Transaction reverted');
  }

  return { txHash };
}

