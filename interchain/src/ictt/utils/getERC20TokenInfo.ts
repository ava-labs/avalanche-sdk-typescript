import { Address } from "viem";
import { createPublicClient, http } from "viem";
import { erc20ABI } from "../../abis/erc20ABI";
import { ChainConfig } from "../../chains/types/chainConfig";

export async function getERC20TokenInfo(
    chain: ChainConfig,
    erc20TokenAddress: Address,
) {
    const sourcePublicClient = createPublicClient({
        chain,
        transport: http(),
    });

    const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
        sourcePublicClient.readContract({
            address: erc20TokenAddress,
            abi: erc20ABI.abi,
            functionName: "name",
        }) as Promise<string>,
        sourcePublicClient.readContract({
            address: erc20TokenAddress,
            abi: erc20ABI.abi,
            functionName: "symbol",
        }) as Promise<string>,
        sourcePublicClient.readContract({
            address: erc20TokenAddress,
            abi: erc20ABI.abi,
            functionName: "decimals",
        }) as Promise<number>,
    ]);
    return {
        tokenName,
        tokenSymbol,
        tokenDecimals,
    };
}