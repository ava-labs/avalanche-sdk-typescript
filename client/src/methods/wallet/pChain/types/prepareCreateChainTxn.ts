import {
  Common,
  Context as ContextType,
  PChainOwner,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareCreateChainTxnParameters = CommonTxParams & {
  /**
   * Subnet ID to create the chain on.
   */
  subnetId: string;
  /**
   * VM ID of the chain being created.
   */
  vmId: string;
  /**
   * Name of the chain being created.
   */
  chainName: string;
  /**
   * Genesis JSON data of the chain being created.
   */
  genesisData: Record<string, unknown>;
  /**
   * Array of indices from the subnet's owners array
   * who will sign this `CreateChainTx`.
   */
  subnetAuth: readonly number[];
  /**
   * Optional. Array of FX IDs to be added to the chain.
   */
  fxIds?: readonly string[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareCreateChainTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The create chain transaction instance.
   */
  createChainTx: pvmSerial.CreateChainTx;
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
