import { Address } from "viem";
import { Chain } from "viem/chains";

export interface ChainConfig extends Chain {
    blockchainId: string;
    contracts: {
        [key: string]: {
            address: Address;
        };
        teleporterRegistry: {
            address: Address;
        };
        teleporterManager: {
            address: Address;
        };
    }
}