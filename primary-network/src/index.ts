export * from "./primaryNetworkClient";
export * from "./primaryNetworkCoreClient";
export * from "./transactions";
export * from "./wallet";

import { pChainTxTypes, pChainUtils } from "./transactions";
export const txTypes = {
    pChain: pChainTxTypes.txTypes,
}

export const utils = {
    pChain: pChainUtils,
}
