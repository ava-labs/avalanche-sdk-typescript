import { Abi, Address, WalletClient } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";

export type DeployTokenHomeContractParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    erc20TokenAddress: Address,
    minimumTeleporterVersion: number,
    tokenHomeCustomByteCode?: `0x${string}`,
    tokenHomeCustomABI?: Abi,
}
