import {
  Common,
  Context as ContextType,
  PChainOwner,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareAddSubnetValidatorTxnParameters = CommonTxParams & {
  /**
   * Subnet ID to add the validator to.
   */
  subnetId: string;
  /**
   * Node ID of the validator being added.
   */
  nodeId: string;
  /**
   * Weight of the validator that will be used during
   * consensus.
   */
  weight: bigint;
  /**
   * End timestamp in seconds after which the subnet validator
   * will be removed from the subnet's validator set.
   */
  end: bigint;
  /**
   * Array of indices from the subnet's owners array
   * who will sign this `AddSubnetValidatorTx`.
   */
  subnetAuth: readonly number[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareAddSubnetValidatorTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The add subnet validator transaction instance.
   */
  addSubnetValidatorTx: pvmSerial.AddSubnetValidatorTx;
  /**
   * The subnet owners.
   */
  subnetOwners: PChainOwner;
  /**
   * Array of indices from the subnet's owners array
   * who will sign this `AddSubnetValidatorTx`.
   */
  subnetAuth: number[];
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
