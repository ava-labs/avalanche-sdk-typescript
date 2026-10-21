import { chainsMap } from '../chains'
import { ChainConfig } from '../types/chainConfig';

export function getChainByChainId(chainId: string): ChainConfig | undefined {
    return chainsMap.get(chainId);
}

export function getChainByName(chainName: string): ChainConfig | undefined {
    return chainsMap.get(chainName);
}
