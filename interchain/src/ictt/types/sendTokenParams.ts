import { Address, WalletClient } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";

export type SendTokenParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    destinationChain: ChainConfig | undefined,
    tokenHomeContract: Address,
    tokenRemoteContract: Address,
    recipient: Address,
    amountInBaseUnit: number,
    feeTokenAddress?: Address,
    feeAmount?: number,
}
