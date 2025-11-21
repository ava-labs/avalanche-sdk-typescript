import { createPublicClient, http } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { BENQI_UNITROLLER } from './contracts';
import { UNITROLLER_ABI } from './abis';

/**
 * Claim rewards from Benqi pool
 * 
 * @param rewardType - 0 for QI token rewards, 1 for AVAX rewards (if available)
 */
export async function claimBenqiRewards(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  qiTokenAddresses?: `0x${string}`[];
  rewardType?: number;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, qiTokenAddresses, rewardType = 0 } = params;

  if (!walletClient.account) {
    throw new Error('Wallet not connected');
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Use provided qiToken addresses or claim for all markets
  // If qiTokenAddresses is provided, claim for specific markets
  // Otherwise, claim for all markets (pass empty array or omit parameter)
  
  let txHash: `0x${string}`;

  if (qiTokenAddresses && qiTokenAddresses.length > 0) {
    // Claim rewards for specific qiTokens
    txHash = await walletClient.writeContract({
      address: BENQI_UNITROLLER as `0x${string}`,
      abi: UNITROLLER_ABI,
      functionName: 'claimReward',
      args: [rewardType as number, walletClient.account.address as `0x${string}`, qiTokenAddresses],
      chain,
      account: walletClient.account,
    });
  } else {
    // Claim rewards for all markets
    txHash = await walletClient.writeContract({
      address: BENQI_UNITROLLER as `0x${string}`,
      abi: UNITROLLER_ABI,
      functionName: 'claimReward',
      args: [rewardType as number, walletClient.account.address as `0x${string}`],
      chain,
      account: walletClient.account,
    });
  }

  // Wait for transaction receipt
  const receipt = await waitForTransactionReceipt(publicClient, {
    hash: txHash,
  });

  if (receipt.status === 'reverted') {
    throw new Error('Transaction reverted');
  }

  return { txHash };
}

