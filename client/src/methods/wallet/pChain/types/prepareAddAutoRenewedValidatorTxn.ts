import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareAddAutoRenewedValidatorTxnParameters = CommonTxParams & {
  /**
   * Amount of AVAX to stake. The staked amount in nAVAX will
   * represent the weight of this validator on the network.
   */
  stakeInNanoAvax: bigint;
  /**
   * The NodeID of the validator being added.
   */
  nodeId: string;
  /**
   * The BLS public key (in hex format) of the validator being added.
   */
  publicKey: string;
  /**
   * The BLS proof of possession signature (in hex format).
   */
  signature: string;
  /**
   * Auto-renewal cycle duration in seconds.
   */
  period: bigint;
  /**
   * The addresses which will receive the validator rewards.
   */
  rewardAddresses: string[];
  /**
   * The addresses which will receive the delegator fee rewards.
   */
  delegatorRewardAddresses: string[];
  /**
   * The addresses authorized to update the auto-renewed validator config.
   */
  ownerAddresses: string[];
  /**
   * The percentage of delegator rewards given to the validator or
   * `delegatorRewardAddresses` as a delegation fee. Valid up to 3 decimal places.
   */
  delegatorRewardPercentage: number;
  /**
   * Percentage of rewards to restake at each cycle boundary.
   * 0 withdraws all rewards and 100 restakes all rewards.
   */
  autoCompoundRewardPercentage: number;
  /**
   * Optional. The number of signatures required to spend the funds in the
   * resultant reward UTXO.
   * @default 1
   */
  threshold?: number;
  /**
   * Optional. The unix timestamp in seconds after which the reward UTXO
   * can be spent once created after a validation cycle.
   * @default 0
   */
  locktime?: bigint;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareAddAutoRenewedValidatorTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The add auto-renewed validator transaction instance.
   */
  addAutoRenewedValidatorTx: pvmSerial.AddAutoRenewedValidatorTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
