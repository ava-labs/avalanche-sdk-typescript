import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "./types/getL1Validator.js";

/**
 * Get the L1 validator information.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetl1validator
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param parameters - The validator node ID {@link GetL1ValidatorParameters}
 * @returns The L1 validator information. {@link GetL1ValidatorReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getL1Validator } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const validator = await getL1Validator(client, {
 *   nodeID: "NodeID-111111111111111111111111111111111111111"
 * })
 * ```
 */
export async function getL1Validator<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetL1ValidatorParameters
): Promise<GetL1ValidatorReturnType> {
  const l1Validator = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getL1Validator";
      params: GetL1ValidatorParameters;
    },
    GetL1ValidatorReturnType
  >({
    method: "platform.getL1Validator",
    params,
  });

  return {
    ...l1Validator,
    startTime: BigInt(l1Validator.startTime),
    weight: BigInt(l1Validator.weight),
    ...(l1Validator.minNonce && { minNonce: BigInt(l1Validator.minNonce) }),
    ...(l1Validator.balance && { balance: BigInt(l1Validator.balance) }),
    ...(l1Validator.height && { height: BigInt(l1Validator.height) }),
  };
}
