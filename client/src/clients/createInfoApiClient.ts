import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { InfoRpcSchema } from "../methods/info/infoRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { infoAPIActions, InfoAPIActions } from "./decorators/infoApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type InfoApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type InfoApiClient<
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
      ? [...InfoRpcSchema, ...rpcSchema]
      : InfoRpcSchema,
    InfoAPIActions
  >
>;

export type CreateInfoApiClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates an Info API Client with a given transport configured for a Chain.
 *
 * The Info API Client is an interface to interact with the Info API through Avalanche-specific JSON-RPC API methods.
 *
 * @param parameters - {@link InfoApiClientConfig}
 * @returns An Info API Client. {@link InfoApiClient}
 *
 * @example
 * ```ts
 * import { createInfoApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createInfoApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get info
 * const info = await client.getNetworkID()
 * ```
 */
export function createInfoApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: InfoApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): InfoApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "info", name = "Info API Client" } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType: "info",
  });

  return client.extend(infoAPIActions) as any;
}
