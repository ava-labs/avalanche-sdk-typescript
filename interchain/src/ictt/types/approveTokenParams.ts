import { Address, WalletClient } from "viem";
import { ChainConfig } from "../../chains/types/chainConfig";

export type ApproveTokenParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    tokenHomeContract: Address,
    tokenAddress: Address,
    amountInBaseUnit: number,
}
