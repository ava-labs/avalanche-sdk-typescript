import { Address } from "viem";
import { Chain } from "viem/chains";

export interface ChainConfig extends Chain {
    blockchainId: string;
    interchainContracts: {
        teleporterRegistry: Address;
        teleporterManager: Address;
    }
}