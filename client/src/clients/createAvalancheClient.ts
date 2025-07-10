import {
  Account,
  Address,
  Chain,
  createPublicClient,
  ParseAccount,
  rpcSchema,
  RpcSchema,
  Transport,
} from "viem";
import { AvalanchePublicRpcSchema } from "../methods/public/avalanchePublicRpcSchema.js";
import { createAdminApiClient } from "./createAdminApiClient.js";
import { createCChainClient } from "./createCChainClient.js";
import { createHealthApiClient } from "./createHealthApiClient.js";
import { createIndexApiClient } from "./createIndexApiClient.js";
import { createInfoApiClient } from "./createInfoApiClient.js";
import { createPChainClient } from "./createPChainClient.js";
import { createXChainClient } from "./createXChainClient.js";
import { adminAPIActions } from "./decorators/adminApi.js";
import { avalanchePublicActions } from "./decorators/avalanchePublic.js";
import { cChainActions } from "./decorators/cChain.js";
import { healthAPIActions } from "./decorators/healthApi.js";
import { indexAPIActions } from "./decorators/indexApi.js";
import { infoAPIActions } from "./decorators/infoApi.js";
import { pChainActions } from "./decorators/pChain.js";
import { xChainActions } from "./decorators/xChain.js";
import {
  AvalancheClient,
  AvalancheClientConfig,
} from "./types/createAvalancheClient.js";
import { createAvalancheTransportClient } from "./utils.js";
/**
 * Creates an Avalanche Client with a given transport configured for a Chain.
 *
 * The Avalanche Client is an interface to interact with the Avalanche network through various JSON-RPC API methods.
 * It provides access to multiple sub-clients for different chains and APIs:
 * - P-Chain (Platform Chain)
 * - X-Chain (Exchange Chain)
 * - C-Chain (Contract Chain)
 * - Admin API
 * - Info API
 * - Health API
 * - Index API
 *
 * @param config - {@link AvalancheClientConfig}
 * @returns An Avalanche Client with access to all sub-clients. {@link AvalancheClient}
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
 * // Access different chain clients
 * const pChainClient = client.pChain
 * const xChainClient = client.xChain
 * const cChainClient = client.cChain
 *
 * // Access API clients
 * const adminClient = client.admin
 * const infoClient = client.info
 * const healthClient = client.health
 * const indexPChainBlockClient = client.indexPChainBlock
 *
 * // Get the latest block number
 * const blockNumber = await client.pChain.getBlockNumber()
 *
 * // Get base fee
 * const baseFee = await client.getBaseFee()
 * ```
 */
export function createAvalancheClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: AvalancheClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): AvalancheClient<transport, chain, ParseAccount<accountOrAddress>> {
  const {
    key = "avalanche",
    name = "Avalanche Client",
    transport: transportParam,
    chain: chainConfig,
    apiKey = "",
    rlToken = "",
  } = parameters;
  const publicTransport = createAvalancheTransportClient<
    transport,
    chain,
    rpcSchema,
    raw
  >(transportParam, chainConfig, { apiKey, rlToken });

  const client = createPublicClient<
    transport,
    chain,
    accountOrAddress,
    AvalanchePublicRpcSchema
  >({
    ...parameters,
    key,
    name,
    transport: publicTransport,
    rpcSchema: rpcSchema<AvalanchePublicRpcSchema>(),
  });
  const extendedClient = client.extend(avalanchePublicActions) as any;

  if (
    chainConfig?.name !== "Avalanche" &&
    chainConfig?.name !== "Avalanche Fuji"
  ) {
    return {
      ...extendedClient,
    };
  }

  return {
    ...extendedClient,

    pChain: createPChainClient({
      ...parameters,
      key: "pChain",
      name: "P-Chain Client",
    }).extend(pChainActions) as any,

    cChain: createCChainClient({
      ...parameters,
      key: "cChain",
      name: "C-Chain Client",
    }).extend(cChainActions) as any,

    xChain: createXChainClient({
      ...parameters,
      key: "xChain",
      name: "X-Chain Client",
    }).extend(xChainActions) as any,

    admin: createAdminApiClient({
      ...parameters,
      key: "admin",
      name: "Admin Client",
    }).extend(adminAPIActions) as any,

    info: createInfoApiClient({
      ...parameters,
      key: "info",
      name: "Info Client",
    }).extend(infoAPIActions) as any,

    health: createHealthApiClient({
      ...parameters,
      key: "health",
      name: "Health Client",
    }).extend(healthAPIActions) as any,

    indexPChainBlock: createIndexApiClient({
      ...parameters,
      key: "indexPChainBlock",
      name: "Index P-Chain Block Client",
      clientType: "indexPChainBlock",
    }).extend(indexAPIActions) as any,

    indexCChainBlock: createIndexApiClient({
      ...parameters,
      key: "indexCChainBlock",
      name: "Index C-Chain Block Client",
      clientType: "indexCChainBlock",
    }).extend(indexAPIActions) as any,

    indexXChainBlock: createIndexApiClient({
      ...parameters,
      key: "indexXChainBlock",
      name: "Index X-Chain Block Client",
      clientType: "indexXChainBlock",
    }).extend(indexAPIActions) as any,

    indexXChainTx: createIndexApiClient({
      ...parameters,
      key: "indexXChainTx",
      name: "Index X-Chain Tx Client",
      clientType: "indexXChainTx",
    }).extend(indexAPIActions) as any,
  };
}
