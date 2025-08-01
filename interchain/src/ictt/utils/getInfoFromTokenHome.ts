import { Address } from "viem";
import { createPublicClient, http } from "viem";
import { tokenHomeABI } from "../../abis/tokenHomeABI";
import { ChainConfig } from "../../chains/types/chainConfig";
import { getERC20TokenInfo } from "./getERC20TokenInfo";

export async function getInfoFromTokenHomeContract(
    chain: ChainConfig,
    tokenHomeAddress: Address,
) {
    const sourcePublicClient = createPublicClient({
        chain,
        transport: http(),
    });

    const [tokenContractAddress, minTeleporterVersion] = await Promise.all([
        sourcePublicClient.readContract({
            address: tokenHomeAddress,
            abi: tokenHomeABI.abi,
            functionName: "getTokenAddress",
        }) as Promise<Address>,
        sourcePublicClient.readContract({
            address: tokenHomeAddress,
            abi: tokenHomeABI.abi,
            functionName: "getMinTeleporterVersion",
        }) as Promise<bigint>,
    ]);

    const {
        tokenName,
        tokenSymbol,
        tokenDecimals,
    } = await getERC20TokenInfo(
        chain,
        tokenContractAddress,
    );

    return {
        tokenContractAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        minTeleporterVersion,
    };
}
