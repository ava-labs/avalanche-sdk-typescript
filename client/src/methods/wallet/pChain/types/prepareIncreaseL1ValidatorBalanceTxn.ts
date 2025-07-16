import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common";

export type PrepareIncreaseL1ValidatorBalanceTxnParameters = CommonTxParams & {
  /**
   * Amount of AVAX to increase the L1 validator balance by.
   */
  balanceInAvax: number;
  /**
   * Validation ID of the L1 validator.
   */
  validationId: string;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareIncreaseL1ValidatorBalanceTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
