import { Address, createPublicClient, http, WalletClient } from "viem";
import { erc20ABI } from "../../abis/erc20ABI";
import { ChainConfig } from "../../chains/types/chainConfig";

export async function deployERC20Token(
    walletClient: WalletClient,
    chain: ChainConfig,
    name: string,
    symbol: string,
    initialSupply: number,
    recipient: Address,
) {
    const publicClient = createPublicClient({
        chain,
        transport: http(),
    });

    const txHash = await walletClient.deployContract({
        abi: erc20ABI.abi,
        bytecode: erc20ABI.bytecode as `0x${string}`,
        args: [name, symbol, initialSupply * 10 ** 18, recipient],
        chain,
        account: walletClient.account ?? null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    if (receipt.status === 'success' && receipt.contractAddress) {
        return {
            txHash,
            contractAddress: receipt.contractAddress,
        };
    } else {
        throw new Error('Failed to deploy ERC20 token.', { cause: receipt });
    }
}