import { ChainConfig } from "../types/chainConfig";
import { avalancheFuji } from "./testnet/avalancheFuji";
import { dispatch } from "./testnet/dispatch";

export { avalancheFuji } from "./testnet/avalancheFuji";
export { dispatch } from "./testnet/dispatch";

const chainsMap = new Map<string | number, ChainConfig>();
[
    avalancheFuji,
    dispatch,
].forEach((chain) => {
    chainsMap.set(chain.id, chain);
    chainsMap.set(chain.name, chain);
});
export { chainsMap };