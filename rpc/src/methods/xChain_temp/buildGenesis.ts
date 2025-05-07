import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use.
 * @param parameters - The network ID and genesis data. {@link BuildGenesisParameters}
 * @returns The genesis bytes. {@link BuildGenesisReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { buildGenesis } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
