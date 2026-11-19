import { defineChain } from "viem";
import type { ChainConfig } from "@avalanche-sdk/ui";

export const dispatch = defineChain({
    id: 779672,
    name: 'Dispatch L1',
    network: 'dispatch',
    nativeCurrency: {
        decimals: 18,
        name: 'DIS',
        symbol: 'DIS',
    },
    rpcUrls: {
        default: {
            http: ['https://subnets.avax.network/dispatch/testnet/rpc']
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://subnets-test.avax.network/dispatch' },
    },
    // Custom variables
    iconUrl: "https://raw.githubusercontent.com/ava-labs/avalanche-starter-kit/refs/heads/main/web-apps/public/chains/logo/779672.png",
    blockchainId: "0x9f3be606497285d0ffbb5ac9ba24aa60346a9b1812479ed66cb329f394a4b1c7",
    icm_registry: "0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228",
    testnet: true,
    interchainContracts: {
        teleporterRegistry: "0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228",
        teleporterManager: "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
    }
}) as ChainConfig;
