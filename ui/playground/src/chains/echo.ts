import { defineChain } from "viem";
import type { ChainConfig } from "@avalanche-sdk/ui";

export const echo = defineChain({
    id: 173750,
    name: 'Echo L1',
    network: 'echo',
    nativeCurrency: {
        decimals: 18,
        name: 'Ech',
        symbol: 'ECH',
    },
    rpcUrls: {
        default: {
            http: ['https://subnets.avax.network/echo/testnet/rpc']
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://subnets-test.avax.network/echo' },
    },
    // Custom variables
    iconUrl: "https://raw.githubusercontent.com/ava-labs/avalanche-starter-kit/refs/heads/main/web-apps/public/chains/logo/173750.png",
    blockchainId: "0x1278d1be4b987e847be3465940eb5066c4604a7fbd6e086900823597d81af4c1",
    icm_registry: "0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228",
    testnet: true,
    interchainContracts: {
        teleporterRegistry: "0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228",
        teleporterManager: "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
    }
}) as ChainConfig;
