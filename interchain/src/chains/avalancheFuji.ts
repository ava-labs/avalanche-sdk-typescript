import { defineChain } from 'viem';
import { avalancheFuji as avalancheFujiBase } from 'viem/chains';
import { ChainConfig } from './types/chainConfig';

export const avalancheFuji = defineChain({
    ...avalancheFujiBase,
    blockchainId: '0x7fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d5',
    interchainContracts: {
        teleporterRegistry: '0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228',
        teleporterManager: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
    }
}) as ChainConfig;
