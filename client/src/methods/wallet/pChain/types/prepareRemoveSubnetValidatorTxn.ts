import {
  Common,
  Context as ContextType,
  PChainOwner,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareRemoveSubnetValidatorTxnParameters = CommonTxParams & {
  /**
   * Subnet ID of the subnet to remove the validator from.
   */
  subnetId: string;
  /**
   * Node ID of the validator being removed.
   */
  nodeId: string;
  /**
   * Array of indices from the subnet's owners array
   * who will sign this `RemoveSubnetValidatorTx`.
   */
  subnetAuth: readonly number[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareRemoveSubnetValidatorTxnReturnType = {
  tx: Common.UnsignedTx;
  subnetOwners: PChainOwner;
  subnetAuth: number[];
  chainAlias: "P";
};
