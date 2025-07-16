import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareRegisterL1ValidatorTxnParameters = CommonTxParams & {
  /**
   * Initial balance (in AVAX) of the L1 validator getting registered,
   * Balance is required for paying a contiguous fee to the Primary
   * Network to validate the L1.
   */
  initialBalanceInAvax: number;
  /**
   * BLS signature of the validator.
   */
  blsSignature: string;
  /**
   * Signed warp message hex with the `AddressedCall` payload
   * containing message of type `RegisterL1ValidatorMessage`.
   */
  message: string;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareRegisterL1ValidatorTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
