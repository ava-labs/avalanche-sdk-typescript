import { WalletClient } from "viem"
import { ChainConfig } from "../../chains/types/chainConfig"
import { Address } from "viem"
export type DeployERC20TokenParams = {
    walletClient: WalletClient,
    sourceChain: ChainConfig | undefined,
    name: string,
    symbol: string,
    initialSupply: number,
    recipient?: Address,
}