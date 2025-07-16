import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareSetL1ValidatorWeightTxnParameters = CommonTxParams & {
  /**
   * Signed warp message hex with the `AddressedCall` payload
   * containing message of type `SetL1ValidatorWeightMessage`.
   */
  message: string;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareSetL1ValidatorWeightTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
