import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { ERC20_APPROVAL_ABI } from '../../../utils/erc20';
import { QI_TOKEN_MINT_ABI } from './abis';

/**
 * Deposit tokens to Benqi pool
 */
export async function depositToBenqiPool(params: {
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

  // Parse amount to wei/base units
  const amountInWei = parseUnits(amount, decimals);

  // Check if native AVAX (no underlying or empty address) - Benqi supports native AVAX via payable mint
  const isNative = !underlyingAddress || 
                   underlyingAddress === '0x0000000000000000000000000000000000000000' ||
                   underlyingAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

  if (!isNative) {
    // ERC20 token - check and approve if needed
    const currentAllowance = await publicClient.readContract({
      address: underlyingAddress,
      abi: ERC20_APPROVAL_ABI,
      functionName: 'allowance',
      args: [walletClient.account.address, qiTokenAddress],
    }) as bigint;

    if (currentAllowance < amountInWei) {
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
      await waitForTransactionReceipt(publicClient, {
        hash: approveHash,
      });
    }

    // Deposit ERC20 tokens using mint(uint256)
    const txHash = await walletClient.writeContract({
      address: qiTokenAddress,
      abi: QI_TOKEN_MINT_ABI,
      functionName: 'mint',
      args: [amountInWei],
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

  // Deposit native AVAX using payable mint()
  const txHash = await walletClient.writeContract({
    address: qiTokenAddress,
    abi: QI_TOKEN_MINT_ABI,
    functionName: 'mint',
    chain,
    account: walletClient.account,
    value: amountInWei,
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

