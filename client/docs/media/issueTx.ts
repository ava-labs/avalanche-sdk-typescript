import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";

/**
 * Issue a transaction to the Platform Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformissuetx
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The transaction bytes and encoding {@link IssueTxParameters}
 * @returns The transaction ID. {@link IssueTxReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { issueTx } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const txID = await issueTx(client, {
 *   tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
 *   encoding: "hex"
 * })
 * ```
 */
export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "platform.issueTx",
    params,
  });
}
