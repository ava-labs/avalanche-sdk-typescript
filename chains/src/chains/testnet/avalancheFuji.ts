import { defineChain } from 'viem';
import { ChainConfig } from '../../types/chainConfig';

export const avalancheFuji = defineChain({
    id: 43_113,
    name: 'Avalanche Fuji',
    nativeCurrency: {
        decimals: 18,
        name: 'Avalanche Fuji',
        symbol: 'AVAX',
    },
    rpcUrls: {
        default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    },
    blockExplorers: {
        default: {
            name: 'SnowTrace',
            url: 'https://subnets-test.avax.network/c-chain',
            apiUrl: 'https://glacier-api.avax.network/v1/chains/43113',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 7096959,
        },
        teleporterRegistry: {
            address: '0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228',
        },
        teleporterManager: {
            address: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
        },
    },
    testnet: true,
    blockchainId: '0x7fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d5',
}) as ChainConfig;
