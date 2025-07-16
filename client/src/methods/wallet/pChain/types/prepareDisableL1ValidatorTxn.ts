import {
  Common,
  Context as ContextType,
  PChainOwner,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareDisableL1ValidatorTxnParameters = CommonTxParams & {
  /**
   * Validation ID of the L1 validator.
   */
  validationId: string;
  /**
   * Array of indices from the L1 validator's disable owners array
   * who will sign this `DisableL1ValidatorTx`.
   */
  disableAuth: number[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareDisableL1ValidatorTxnReturnType = {
  tx: Common.UnsignedTx;
  disableOwners: PChainOwner;
  disableAuth: number[];
  chainAlias: "P";
};
