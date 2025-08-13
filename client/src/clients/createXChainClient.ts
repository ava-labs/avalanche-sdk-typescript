import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { XChainRpcSchema } from "../methods/xChain/xChainRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { xChainActions, XChainActions } from "./decorators/xChain.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type XChainClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type XChainClient<
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
      ? [...XChainRpcSchema, ...rpcSchema]
      : XChainRpcSchema,
    XChainActions
  >
>;

export type CreateXChainClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates an X-Chain (Exchange Chain) Client with a given transport configured for a Chain.
 *
 * The X-Chain Client is an interface to interact with the Avalanche Exchange Chain through JSON-RPC API methods.
 * The Exchange Chain is responsible for:
 * - Creating and trading digital assets
 * - Managing asset transfers
 * - Handling atomic swaps
 * - Creating and managing custom assets
 *
 * @param parameters - {@link XChainClientConfig}
 * @returns An X-Chain Client. {@link XChainClient}
 *
 * @example
 * ```ts
 * import { createXChainClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get asset information
 * const asset = await client.getAssetDescription({ assetID: 'asset-id' })
 *
 * // Get balance for an address
 * const balance = await client.getBalance({ address: 'X-avax...' })
 * ```
 */
export function createXChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: XChainClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): XChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "xChain", name = "X-Chain Client" } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType: "xChain",
  });

  return client.extend(xChainActions) as any;
}
