import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";

export type PrepareAddPermissionlessDelegatorTxnParameters = CommonTxParams & {
  /**
   * Amount of AVAX to stake. This amount will be locked until
   * the end of the staking period. The staked outputs will be
   * consolidated into a single output and owned by the
   * `changeAddresses` or the `fromAddresses` array.
   */
  stakeInAvax: bigint;
  /**
   * NodeID of the validator to delegate AVAX to.
   */
  nodeId: string;
  /**
   * The Unix time in seconds when the delegation stops
   * (and staked AVAX is returned).
   */
  end: bigint;
  /**
   * The addresses which will receive the rewards from the delegated stake.
   * Given addresses will share the reward UTXO.
   */
  rewardAddresses: string[];
  /**
   * Optional. The number of signatures required to spend the funds in the
   * resultant reward UTXO.
   * @default 1
   */
  threshold?: number;
  /**
   * Optional. The unix timestamp in seconds after which the reward UTXO
   * can be spent, once they are created after the staking period ends.
   * @default 0
   */
  locktime?: bigint;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareAddPermissionlessDelegatorTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The add permissionless delegator transaction instance.
   */
  addPermissionlessDelegatorTx: pvmSerial.AddPermissionlessDelegatorTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
