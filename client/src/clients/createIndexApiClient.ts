import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { IndexRpcSchema } from "../methods/index/indexRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { indexAPIActions, IndexAPIActions } from "./decorators/indexApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type IndexApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw> & {
    clientType:
      | "indexPChainBlock"
      | "indexCChainBlock"
      | "indexXChainBlock"
      | "indexXChainTx";
  }
>;

export type IndexApiClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  AvalancheCoreClient<
    transport,
    chain,
    accountOrAddress,
    rpcSchema extends RpcSchema
      ? [...IndexRpcSchema, ...rpcSchema]
      : IndexRpcSchema,
    IndexAPIActions
  >
>;

export type CreateIndexApiClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates an Index API Client with a given transport configured for a Chain.
 *
 * The Index API Client is an interface to interact with the Index API through Avalanche-specific JSON-RPC API methods.
 *
 * @param parameters - {@link IndexApiClientConfig}
 * @returns An Index API Client. {@link IndexApiClient}
 *
 * @example
 * ```ts
 * import { createIndexApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 *   clientType: "indexPChainBlock",
 * })
 *
 * // Get container by ID for P-Chain block
 * const block = await client.getContainerByID({
 *   id: '0x1',
 *   encoding: 'hex'
 * })
 * ```
 */
export function createIndexApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: IndexApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): IndexApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "index", name = "Index API Client", clientType } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType,
  });

  return client.extend(indexAPIActions) as any;
}
