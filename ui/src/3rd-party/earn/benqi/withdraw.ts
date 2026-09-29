import { createPublicClient, http, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import type { ChainConfig } from '../../../types/chainConfig';
import type { WalletClient } from 'viem';
import { QI_TOKEN_REDEEM_ABI } from './abis';

/**
 * Withdraw tokens from Benqi pool
 */
export async function withdrawFromBenqiPool(params: {
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

  // Parse amount to wei/base units
  const amountInWei = parseUnits(amount, decimals);

  // Use redeemUnderlying to withdraw the exact amount of underlying tokens
  // This is more user-friendly than calculating the exact qiToken amount
  const txHash = await walletClient.writeContract({
    address: qiTokenAddress,
    abi: QI_TOKEN_REDEEM_ABI,
    functionName: 'redeemUnderlying',
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

