import {
  Context as ContextType,
  pvmSerial,
  UnsignedTx,
} from "@avalabs/avalanchejs";

export type PrepareRewardAutoRenewedValidatorTxnParameters = {
  /**
   * ID of the transaction that created the auto-renewed validator.
   */
  validatorTxId: string;
  /**
   * Cycle end timestamp in Unix seconds.
   */
  timestamp: bigint;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareRewardAutoRenewedValidatorTxnReturnType = {
  /**
   * The unsigned transaction wrapper. Reward auto-renewed validator transactions
   * have no P-Chain wallet signatures.
   */
  tx: UnsignedTx;
  /**
   * The reward auto-renewed validator transaction instance.
   */
  rewardAutoRenewedValidatorTx: pvmSerial.RewardAutoRenewedValidatorTx;
  /**
   * Signed transaction bytes with an empty credential set, ready for `platform.issueTx`.
   */
  txHex: string;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
