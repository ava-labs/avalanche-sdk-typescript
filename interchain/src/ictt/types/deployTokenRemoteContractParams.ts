import { Abi, Address, WalletClient } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";

export type DeployTokenRemoteContractParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    destinationChain: ChainConfig | undefined,
    tokenHomeContract: Address,
    tokenRemoteCustomByteCode?: `0x${string}`,
    tokenRemoteCustomABI?: Abi,
}
