import {
  Common,
  Context as ContextType,
  PChainOwner,
  pvmSerial,
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
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The remove subnet validator transaction instance.
   */
  removeSubnetValidatorTx: pvmSerial.RemoveSubnetValidatorTx;
  /**
   * The subnet owners.
   */
  subnetOwners: PChainOwner;
  /**
   * The subnet auth.
   */
  subnetAuth: number[];
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
