import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { POOL_ADDRESSES_PROVIDER } from './contracts';
import { POOL_ADDRESSES_PROVIDER_ABI, POOL_ABI } from './abis';

/**
 * Deposit tokens to AAVE pool
 */
export async function depositToAavePool(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  asset: `0x${string}`;
  amount: string;
  decimals: number;
  onBehalfOf: `0x${string}`;
  referralCode?: number;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, asset, amount, decimals, onBehalfOf, referralCode = 0 } = params;

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

  // Check if native AVAX (empty address) - AAVE requires wrapped tokens
  // For native AVAX, user should deposit WAVAX instead
  if (!asset || asset === '0x0000000000000000000000000000000000000000') {
    throw new Error('Native AVAX deposits not supported. Please use WAVAX (Wrapped AVAX) instead.');
  }

  // Deposit to pool
  const txHash = await walletClient.writeContract({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'supply',
    args: [asset, amountInWei, onBehalfOf, referralCode],
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

