import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareCreateSubnetTxnParameters = CommonTxParams & {
  /**
   * Subnet owners of the subnet being created. Signatures
   * from these addresses will be required to any Subnet related
   * transactions.
   */
  subnetOwners: SubnetOwners;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type SubnetOwners = {
  addresses: string[];
  threshold?: number;
  locktime?: bigint;
};

export type PrepareCreateSubnetTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
