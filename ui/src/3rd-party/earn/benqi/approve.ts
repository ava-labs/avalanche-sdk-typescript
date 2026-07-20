import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { ERC20_APPROVAL_ABI } from '../../../utils/erc20';
import { QI_TOKEN_MINT_ABI } from './abis';

/**
 * Check if token needs approval for Benqi
 */
export async function checkTokenApprovalForBenqi(params: {
  publicClient: ReturnType<typeof createPublicClient>;
  qiTokenAddress: `0x${string}`;
  amount: string;
  decimals: number;
  owner: `0x${string}`;
}): Promise<{ needsApproval: boolean; currentAllowance: bigint; requiredAmount: bigint }> {
  const { publicClient, qiTokenAddress, amount, decimals, owner } = params;

  // Get underlying token address
  const underlyingAddress = await publicClient.readContract({
    address: qiTokenAddress,
    abi: QI_TOKEN_MINT_ABI,
    functionName: 'underlying',
  }).catch(() => null as `0x${string}` | null) as `0x${string}` | null;

  // Native AVAX doesn't need approval
  const isNative = !underlyingAddress || 
                   underlyingAddress === '0x0000000000000000000000000000000000000000' ||
                   underlyingAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  
  if (isNative) {
    return {
      needsApproval: false,
      currentAllowance: BigInt(0),
      requiredAmount: BigInt(0),
    };
  }

  const requiredAmount = parseUnits(amount, decimals);
  const currentAllowance = await publicClient.readContract({
    address: underlyingAddress,
    abi: ERC20_APPROVAL_ABI,
    functionName: 'allowance',
    args: [owner, qiTokenAddress],
  }) as bigint;

  return {
    needsApproval: currentAllowance < requiredAmount,
    currentAllowance,
    requiredAmount,
  };
}

/**
 * Approve token spending for Benqi pool
 */
export async function approveTokenForBenqiPool(params: {
  walletClient: WalletClient;
  chain: ChainConfig;
  qiTokenAddress: `0x${string}`;
  amount: string;
  decimals: number;
}): Promise<{ txHash: `0x${string}` }> {
  const { walletClient, chain, qiTokenAddress, amount, decimals } = params;

  if (!walletClient.account) {
    throw new Error('Wallet not connected');
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Get underlying token address
  const underlyingAddress = await publicClient.readContract({
    address: qiTokenAddress,
    abi: QI_TOKEN_MINT_ABI,
    functionName: 'underlying',
  }).catch(() => null as `0x${string}` | null) as `0x${string}` | null;

  // Native AVAX doesn't need approval
  const isNative = !underlyingAddress || 
                   underlyingAddress === '0x0000000000000000000000000000000000000000' ||
                   underlyingAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  
  if (isNative) {
    throw new Error('Native AVAX does not require approval');
  }

  // Parse amount to wei/base units
  const amountInWei = parseUnits(amount, decimals);

  // Approve the qiToken to spend tokens
  const approveHash = await walletClient.writeContract({
    address: underlyingAddress,
    abi: ERC20_APPROVAL_ABI,
    functionName: 'approve',
    args: [qiTokenAddress, amountInWei],
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

