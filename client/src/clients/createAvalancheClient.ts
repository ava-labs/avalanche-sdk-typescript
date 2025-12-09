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
import { AVALANCHE_CHAIN_IDS } from "../methods/consts.js";
import { AvalanchePublicRpcSchema } from "../methods/public/avalanchePublicRpcSchema.js";
import { createAdminApiClient } from "./createAdminApiClient.js";
import { createCChainClient } from "./createCChainClient.js";
import { createHealthApiClient } from "./createHealthApiClient.js";
import { createIndexApiClient } from "./createIndexApiClient.js";
import { createInfoApiClient } from "./createInfoApiClient.js";
import { createPChainClient } from "./createPChainClient.js";
import { createProposervmApiClient } from "./createProposervmApiClient.js";
import { createXChainClient } from "./createXChainClient.js";
import { avalanchePublicActions } from "./decorators/avalanchePublic.js";
import {
  AvalancheClient,
  AvalancheClientConfig,
} from "./types/createAvalancheClient.js";
import { createAvalancheTransportClient } from "./utils.js";

const AVALANCHE_CHAIN_ID_VALUES = Object.values(AVALANCHE_CHAIN_IDS) as number[];
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
 * - proposervm API
 * - Index API
 *
 * @param parameters - {@link AvalancheClientConfig}
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
 * const proposervmCChainClient = client.proposervm.cChain
 * const proposervmPChainClient = client.proposervm.pChain
 * const proposervmXChainClient = client.proposervm.xChain
 * const indexPChainBlockClient = client.indexBlock.pChain
 * const indexCChainBlockClient = client.indexBlock.cChain
 * const indexXChainBlockClient = client.indexBlock.xChain
 * const indexXChainTxClient = client.indexTx.xChain
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

  if (!chainConfig?.id || !AVALANCHE_CHAIN_ID_VALUES.includes(chainConfig.id)) {
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
    }),

    cChain: createCChainClient({
      ...parameters,
      key: "cChain",
      name: "C-Chain Client",
    }),

    xChain: createXChainClient({
      ...parameters,
      key: "xChain",
      name: "X-Chain Client",
    }),

    admin: createAdminApiClient({
      ...parameters,
      key: "admin",
      name: "Admin Client",
    }),

    info: createInfoApiClient({
      ...parameters,
      key: "info",
      name: "Info Client",
    }),

    health: createHealthApiClient({
      ...parameters,
      key: "health",
      name: "Health Client",
    }),

    proposervm: {
      cChain: createProposervmApiClient({
        ...parameters,
        key: "proposervm",
        name: "proposervm Client",
        clientType: "proposervmCChain",
      }),

      pChain: createProposervmApiClient({
        ...parameters,
        key: "proposervm",
        name: "proposervm Client",
        clientType: "proposervmPChain",
      }),

      xChain: createProposervmApiClient({
        ...parameters,
        key: "proposervm",
        name: "proposervm Client",
        clientType: "proposervmXChain",
      }),
    } as any,

    indexBlock: {
      pChain: createIndexApiClient({
        ...parameters,
        key: "indexPChainBlock",
        name: "Index P-Chain Block Client",
        clientType: "indexPChainBlock",
      }),

      cChain: createIndexApiClient({
        ...parameters,
        key: "indexCChainBlock",
        name: "Index C-Chain Block Client",
        clientType: "indexCChainBlock",
      }),

      xChain: createIndexApiClient({
        ...parameters,
        key: "indexXChainBlock",
        name: "Index X-Chain Block Client",
        clientType: "indexXChainBlock",
      }),
    } as any,

    indexTx: {
      xChain: createIndexApiClient({
        ...parameters,
        key: "indexXChainTx",
        name: "Index X-Chain Tx Client",
        clientType: "indexXChainTx",
      }),
    } as any,
  } as any;
}
