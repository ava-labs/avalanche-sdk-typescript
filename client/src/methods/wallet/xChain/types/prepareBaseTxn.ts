import {
  avmSerial,
  Common,
  Context as ContextType,
} from "@avalabs/avalanchejs";
import { X_CHAIN_ALIAS } from "../../../consts";
import { CommonTxParams, Output } from "../../types/common";

export type PrepareBaseTxnParameters = CommonTxParams &
  CommonTxParams & {
    /**
     * Optional. Outputs to send funds to. It can
     * be used to specify resulting UTXOs.
     */
    outputs?: Output[];
    /**
     * The context to use for the transaction.
     */
    context?: ContextType.Context;
  };

export type PrepareBaseTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The base transaction instance.
   */
  baseTx: avmSerial.BaseTx;
  /**
   * The chain alias. {@link X_CHAIN_ALIAS}
   */
  chainAlias: typeof X_CHAIN_ALIAS;
};
