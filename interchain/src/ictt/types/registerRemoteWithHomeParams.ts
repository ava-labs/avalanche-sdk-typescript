import { Address, WalletClient } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";

export type RegisterRemoteWithHomeParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    destinationChain: ChainConfig | undefined,
    tokenRemoteContract: Address,
    feeTokenAddress?: Address,
    feeAmount?: number,
}
