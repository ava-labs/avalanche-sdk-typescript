import { Chain } from "viem/chains";

export interface ChainConfig extends Chain {
    blockchainId: string;
}