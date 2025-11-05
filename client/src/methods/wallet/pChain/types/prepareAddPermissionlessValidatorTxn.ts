import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareAddPermissionlessValidatorTxnParameters = CommonTxParams & {
  /**
   * Amount of AVAX to stake. The staked amount in nAVAX will
   * represent the weight of this validator on the network.
   * This amount will be locked until the end of the staking period.
   * The staked outputs will be consolidated into a single output
   * and owned by the `changeAddresses` or the `fromAddresses` array.
   */
  stakeInAvax: bigint;
  /**
   * The NodeID of the validator being added.
   */
  nodeId: string;
  /**
   * Optional. The BLS public key (in hex format) of the validator being added.
   */
  publicKey?: string;
  /**
   * Optional. The BLS signature (in hex format) of the validator being added.
   */
  signature?: string;
  /**
   * The Unix time in seconds when the validator will be removed from staking set.
   * (and staked AVAX is returned).
   */
  end: bigint;
  /**
   * The addresses which will receive the validator rewards. Given addresses
   * will share the reward UTXO.
   */
  rewardAddresses: string[];
  /**
   * The addresses which will receive the delegator fee rewards. Given addresses
   * will share the reward UTXO.
   */
  delegatorRewardAddresses: string[];
  /**
   * The percentage of delegator rewards given to validator or `delegatorRewardAddresses`
   * as a delgation fee. Valid upto 3 decimal places.
   * @max 100 @min 2
   */
  delegatorRewardPercentage: number;
  /**
   * Optional. The number of signatures required to spend the funds in the
   * resultant reward UTXO (both validator and delegator fee rewards).
   * @default 1
   */
  threshold?: number;
  /**
   * Optional. The unix timestamp in seconds after which the reward UTXO
   * can be spent, once they are created after the staking period ends
   * (both validator and delegator fee rewards).
   * @default 0
   */
  locktime?: bigint;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareAddPermissionlessValidatorTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The add permissionless validator transaction instance.
   */
  addPermissionlessValidatorTx: pvmSerial.AddPermissionlessValidatorTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
