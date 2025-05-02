import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  ValidatedByParameters,
  ValidatedByReturnType,
} from "./types/validatedBy.js";

/**
 * Get the validators that validated a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformvalidatedby
 *
 * @param client - The client to use to make the request
 * @param parameters - The transaction ID {@link ValidatedByParameters}
 * @returns The validators that validated the transaction. {@link ValidatedByReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { validatedBy } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const validators = await validatedBy(client, {
 *   txID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function validatedBy<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatedByParameters
): Promise<ValidatedByReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.validatedBy";
      params: ValidatedByParameters;
    },
    ValidatedByReturnType
  >({
    method: "platform.validatedBy",
    params,
  });
}
