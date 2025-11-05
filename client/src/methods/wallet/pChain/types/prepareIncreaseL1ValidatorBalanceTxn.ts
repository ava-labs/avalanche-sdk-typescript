import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common";

export type PrepareIncreaseL1ValidatorBalanceTxnParameters = CommonTxParams & {
  /**
   * Amount of AVAX to increase the L1 validator balance by (in nano AVAX).
   */
  balanceInAvax: bigint;
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
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The increase L1 validator balance transaction instance.
   */
  increaseL1ValidatorBalanceTx: pvmSerial.IncreaseL1ValidatorBalanceTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
