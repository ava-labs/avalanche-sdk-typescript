export { PrimaryNetwork, createPrimaryNetworkClient } from "./primaryNetworkClient";
export { PrimaryNetworkCore, createPrimaryNetworkCoreClient } from "./primaryNetworkCoreClient";

import { pChainTxTypes, cChainTxTypes } from "./transactions";
export const txTypes = {
    pChain: pChainTxTypes,
    cChain: cChainTxTypes,
};

export { pChainTxTypes, cChainTxTypes };

export { createTxBuilder as createPChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
export { createTxBuilder as createCChainTxBuilder } from "./transactions/c-chain/builder/txBuilder";
