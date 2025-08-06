import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareCreateSubnetTxnParameters = CommonTxParams & {
  /**
   * Subnet owners of the subnet being created. Signatures
   * from these addresses will be required to any Subnet related
   * transactions. {@link SubnetOwners}
   */
  subnetOwners: SubnetOwners;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched. {@link ContextType.Context}
   */
  context?: ContextType.Context;
};

export type SubnetOwners = {
  /**
   * A list of unique addresses that correspond to the private keys that can be used to spend this output. Addresses must be sorted lexicographically.
   */
  addresses: string[];
  /**
   * An int that names the number of unique signatures required to spend the output. Must be less than or equal to the length of Addresses. If Addresses is empty, must be 0.
   */
  threshold?: number;
  /**
   *  Contains the Unix timestamp that this output can be spent after. The Unix timestamp is specific to the second.
   */
  locktime?: bigint;
};

export type PrepareCreateSubnetTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The create subnet transaction instance.
   */
  createSubnetTx: pvmSerial.CreateSubnetTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
