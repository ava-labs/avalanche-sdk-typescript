export {
  primaryNetworkActions,
  type PrimaryNetworkActions,
} from "./clients/decorators/primaryNetwork.js";
export {
  createPrimaryNetworkClient,
  type CreatePrimaryNetworkClientErrorType,
  type PrimaryNetworkClient,
  type PrimaryNetworkClientConfig,
} from "./clients/primaryNetworkClient.js";
export {
  createPrimaryNetworkCoreClient,
  type CreatePrimaryNetworkCoreClientErrorType,
  type PrimaryNetworkCoreClient,
  type PrimaryNetworkCoreClientConfig,
} from "./clients/primaryNetworkCoreClient.js";
// export * from "./transactions";
// export * from "./wallet";

// import { pChainTxTypes, pChainUtils } from "./transactions";
// export const txTypes = {
//   pChain: pChainTxTypes.txTypes,
// };

// export const utils = {
//   pChain: pChainUtils,
// };
