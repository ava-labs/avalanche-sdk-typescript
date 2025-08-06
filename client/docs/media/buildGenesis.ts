import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import {
  BuildGenesisParameters,
  BuildGenesisReturnType,
} from "./types/buildGenesis.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Given a JSON representation of this Virtual Machine's genesis state, create the byte representation of that state.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmbuildgenesis
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The network ID and genesis data. {@link BuildGenesisParameters}
 * @returns The genesis bytes. {@link BuildGenesisReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { buildGenesis } from '@avalanche-sdk/client/methods/xChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const genesis = await buildGenesis(client, {
 *   networkID: 16,
 *   genesisData: {
 *     asset1: {
 *       name: "myFixedCapAsset",
 *       symbol: "MFCA",
 *       initialState: {
 *         fixedCap: [
 *           {
 *             amount: 100000,
 *             address: "avax13ery2kvdrkd2nkquvs892gl8hg7mq4a6ufnrn6"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * })
 * ```
 */
export async function buildGenesis<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: BuildGenesisParameters
): Promise<BuildGenesisReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.buildGenesis";
      params: BuildGenesisParameters;
    },
    BuildGenesisReturnType
  >({
    method: "avm.buildGenesis",
    params,
  });
}
