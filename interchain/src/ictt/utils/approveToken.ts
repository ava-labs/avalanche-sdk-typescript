import { createPublicClient, http, WalletClient } from "viem";
import { erc20ABI } from "../../abis/erc20ABI";
import { ChainConfig } from "../../chains/types/chainConfig";
import { getERC20TokenInfo } from "./getERC20TokenInfo";

export async function approveToken(params: {
    walletClient: WalletClient,
    chain: ChainConfig,
    spenderAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    amountInBaseUnit: number,
}) {
    const publicClient = createPublicClient({
        chain: params.chain,
        transport: http(),
    });

    const { tokenDecimals } = await getERC20TokenInfo(params.chain, params.tokenAddress);
    const amountInWei = BigInt(params.amountInBaseUnit) * BigInt(10 ** tokenDecimals);
    const approveTxHash = await params.walletClient.writeContract({
        address: params.tokenAddress,
        abi: erc20ABI.abi,
        functionName: "approve",
        args: [params.spenderAddress, amountInWei],
        chain: params.chain,
        account: params.walletClient.account ?? null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
    if (receipt.status === 'success') {
        return { txHash: approveTxHash };
    } else {
        throw new Error('Failed to approve token.', { cause: receipt });
    }
}