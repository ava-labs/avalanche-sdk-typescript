import {
  Common,
  Context as ContextType,
  PChainOwner,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareSetAutoRenewedValidatorConfigTxnParameters =
  CommonTxParams & {
    /**
     * ID of the transaction that created the auto-renewed validator.
     */
    validatorTxId: string;
    /**
     * Indices from the auto-renewed validator owner set that will authorize this config update.
     */
    auth: number[];
    /**
     * Percentage of rewards to restake in the next cycle.
     * 0 withdraws all rewards and 100 restakes all rewards.
     */
    autoCompoundRewardPercentage: number;
    /**
     * Duration of the next validation cycle in seconds.
     * Set to 0 to stop validating after the current cycle.
     */
    period: bigint;
    /**
     * Optional. The context to use for the transaction. If not provided, the context will be fetched.
     */
    context?: ContextType.Context;
  };

export type PrepareSetAutoRenewedValidatorConfigTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The set auto-renewed validator config transaction instance.
   */
  setAutoRenewedValidatorConfigTx: pvmSerial.SetAutoRenewedValidatorConfigTx;
  /**
   * The owner set authorized to update the auto-renewed validator config.
   */
  autoRenewedValidatorOwners: PChainOwner;
  /**
   * The owner indices authorizing the config update.
   */
  autoRenewedValidatorAuth: number[];
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
