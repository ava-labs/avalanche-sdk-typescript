export { PrimaryNetwork, createPrimaryNetworkClient } from "./primaryNetworkClient";
export { PrimaryNetworkCore, createPrimaryNetworkCoreClient } from "./primaryNetworkCoreClient";

export {
    Wallet,
} from "./wallet";

import { utils, pChainTxTypes, cChainTxTypes } from "./transactions";
export { pChainTxTypes, cChainTxTypes };
export const txTypes = {
    pChain: pChainTxTypes,
    cChain: cChainTxTypes,
};
export { utils };
