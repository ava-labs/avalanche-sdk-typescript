import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import {
  AvalancheBaseClient,
  AvalancheBaseClientConfig,
  CreateAvalancheBaseClientErrorType,
  Extended,
  createAvalancheBaseClient,
} from "./createAvalancheBaseClient.js";
import { AvalancheTransportConfig, ClientType } from "./types/types.js";
import { createAvalancheTransportClient } from "./utils.js";

export type AvalancheCoreClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  Omit<
    AvalancheBaseClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    "transport"
  > & {
    transport: AvalancheTransportConfig<transport, rpcSchema, raw>;
    apiKey?: string;
    rlToken?: string;
    clientType?: ClientType | undefined;
  }
>;

export type AvalancheCoreClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
> = Prettify<
  AvalancheBaseClient<transport, chain, account, rpcSchema, extended>
>;

export type CreateAvalancheCoreClientErrorType =
  CreateAvalancheBaseClientErrorType;

/**
 * Creates an Avalanche Core Client with a given transport configured for a Chain.
 *
 * The Avalanche Core Client is a base client that can be used to create other
 * Avalanche clients or make rpc requests.
 *
 * @param parameters - {@link AvalancheCoreClientConfig}
 * @returns A Avalanche Core Client. {@link AvalancheCoreClient}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: { type: "http" },
 * })
 *
 * const block = await client.getBlock("latest")
 * ```
 */
export function createAvalancheCoreClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined,
  raw extends boolean = false
>(
  parameters: AvalancheCoreClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): AvalancheCoreClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema,
  extended
> {
  const {
    key = "avalancheCore",
    name = "Avalanche Core Client",
    transport: transportParam,
    chain: chainConfig,
    apiKey,
    rlToken,
    clientType = "public",
  } = parameters;

  const customTransport = createAvalancheTransportClient<
    transport,
    chain,
    rpcSchema,
    raw
  >(transportParam, chainConfig, { apiKey, rlToken }, clientType);

  const client = createAvalancheBaseClient({
    ...parameters,
    key,
    name,
    transport: customTransport,
  });

  return client as any;
}
