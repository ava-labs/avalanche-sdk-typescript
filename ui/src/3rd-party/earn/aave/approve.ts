import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { ERC20_APPROVAL_ABI } from '../../../utils/erc20';
import { POOL_ADDRESSES_PROVIDER } from './contracts';
import { POOL_ADDRESSES_PROVIDER_ABI } from './abis';

/**
 * Check if token needs approval
 */
export async function checkTokenApproval(params: {
  publicClient: ReturnType<typeof createPublicClient>;
  asset: `0x${string}`;
  amount: string;
  decimals: number;
  owner: `0x${string}`;
  spender: `0x${string}`;
}): Promise<{ needsApproval: boolean; currentAllowance: bigint; requiredAmount: bigint }> {
  const { publicClient, asset, amount, decimals, owner, spender } = params;

  const requiredAmount = parseUnits(amount, decimals);
  const currentAllowance = await publicClient.readContract({
    address: asset,
    abi: ERC20_APPROVAL_ABI,
    functionName: 'allowance',
    args: [owner, spender],
  }) as bigint;

  return {
    needsApproval: currentAllowance < requiredAmount,
    currentAllowance,
    requiredAmount,
  };
}

/**
 * Approve token spending for AAVE pool
 */
export async function approveTokenForAavePool(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  asset: `0x${string}`;
  amount: string;
  decimals: number;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, asset, amount, decimals } = params;

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
  if (!asset || asset === '0x0000000000000000000000000000000000000000') {
    throw new Error('Native AVAX approvals not supported. Please use WAVAX (Wrapped AVAX) instead.');
  }

  // Approve the pool to spend tokens
  const approveHash = await walletClient.writeContract({
    address: asset,
    abi: ERC20_APPROVAL_ABI,
    functionName: 'approve',
    args: [poolAddress, amountInWei],
    chain,
    account: walletClient.account,
  });

  // Wait for approval transaction
  const receipt = await waitForTransactionReceipt(publicClient, {
    hash: approveHash,
  });

  if (receipt.status === 'reverted') {
    throw new Error('Approval transaction reverted');
  }

  return { txHash: approveHash };
}

