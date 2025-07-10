import { Chain, Transport } from "viem";
import { getAtomicTx } from "../../methods/cChain/getAtomicTx.js";
import { getAtomicTxStatus } from "../../methods/cChain/getAtomicTxStatus.js";
import { getUTXOs } from "../../methods/cChain/getUTXOs.js";
import { issueTx } from "../../methods/cChain/issueTx.js";
import {
  GetAtomicTxParameters,
  GetAtomicTxReturnType,
} from "../../methods/cChain/types/getAtomicTx.js";
import {
  GetAtomicTxStatusParameters,
  GetAtomicTxStatusReturnType,
} from "../../methods/cChain/types/getAtomicTxStatus.js";
import {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "../../methods/cChain/types/getUTXOs.js";
import {
  IssueTxParameters,
  IssueTxReturnType,
} from "../../methods/cChain/types/issueTx.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type CChainActions = {
  /**
   * Get the atomic transaction by its ID.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictx
   *
   * @param args - {@link GetAtomicTxParameters}
   * @returns The atomic transaction. {@link GetAtomicTxReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const tx = await client.cChain.getAtomicTx({
   *   txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1"
   * })
   * ```
   */
  getAtomicTx: (args: GetAtomicTxParameters) => Promise<GetAtomicTxReturnType>;

  /**
   * Get the status of an atomic transaction.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictxstatus
   *
   * @param args - {@link GetAtomicTxStatusParameters}
   * @returns The status of the atomic transaction. {@link GetAtomicTxStatusReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const status = await client.cChain.getAtomicTxStatus({
   *   txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1"
   * })
   * ```
   */
  getAtomicTxStatus: (
    args: GetAtomicTxStatusParameters
  ) => Promise<GetAtomicTxStatusReturnType>;

  /**
   * Get the UTXOs for a set of addresses.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetutxos
   *
   * @param args - {@link GetUTXOsParameters}
   * @returns The UTXOs for a set of addresses. {@link GetUTXOsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const utxos = await client.cChain.getUTXOs({
   *   addresses: ["X-avax1...", "X-avax2..."],
   *   limit: 100
   * })
   * ```
   */
  getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;

  /**
   * Send a signed transaction to the network.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxissuetx
   *
   * @param args - {@link IssueTxParameters}
   * @returns The transaction ID. {@link IssueTxReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const txID = await client.cChain.issueTx({
   *   tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
   *   encoding: "hex"
   * })
   * ```
   */
  issueTx: (args: IssueTxParameters) => Promise<IssueTxReturnType>;
};

export function cChainActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): CChainActions {
  return {
    getAtomicTx: (args) => getAtomicTx(client, args),
    getAtomicTxStatus: (args) => getAtomicTxStatus(client, args),
    getUTXOs: (args) => getUTXOs(client, args),
    issueTx: (args) => issueTx(client, args),
  };
}
