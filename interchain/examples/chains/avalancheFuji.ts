import { defineChain } from 'viem';
import { avalancheFuji as avalancheFujiBase } from 'viem/chains';

export const avalancheFuji = defineChain({
    ...avalancheFujiBase,
    blockchainId: '0x7fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d5',
});
