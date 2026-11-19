import { Address } from "viem";
import type { Chain } from "@avalanche-sdk/client/chains";

export interface ChainConfig extends Chain {
    blockchainId: string;
    iconUrl?: string;
    interchainContracts: {
        teleporterRegistry: Address;
        teleporterManager: Address;
    };
}

/**
 * Type guard to check if a Chain is a ChainConfig
 */
export function isChainConfig(chain: Chain | ChainConfig): chain is ChainConfig {
    return 'blockchainId' in chain;
}
