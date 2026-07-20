import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { POOL_ADDRESSES_PROVIDER } from './contracts';
import { POOL_ADDRESSES_PROVIDER_ABI, POOL_ABI } from './abis';

/**
 * Withdraw tokens from AAVE pool
 */
export async function withdrawFromAavePool(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  asset: `0x${string}`;
  amount: string;
  decimals: number;
  to?: `0x${string}`;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, asset, amount, decimals, to } = params;

  if (!walletClient.account) {
    throw new Error('Wallet not connected');
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Get Pool contract address
  const poolAddress = await publicClient.readContract({
    address: POOL_ADDRESSES_PROVIDER as `0x${string}`,
    abi: POOL_ADDRESSES_PROVIDER_ABI,
    functionName: 'getPool',
  }) as `0x${string}`;

  // Parse amount to wei/base units
  const amountInWei = parseUnits(amount, decimals);

  // Use provided 'to' address or default to wallet address
  const toAddress = to || walletClient.account.address as `0x${string}`;

  // Check if native AVAX (empty address) - AAVE uses wrapped tokens
  if (!asset || asset === '0x0000000000000000000000000000000000000000') {
    throw new Error('Native AVAX withdrawals not supported. Please use WAVAX (Wrapped AVAX) instead.');
  }

  // Withdraw from pool
  const txHash = await walletClient.writeContract({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'withdraw',
    args: [asset, amountInWei, toAddress],
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

