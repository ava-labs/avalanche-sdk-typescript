import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { HealthRpcSchema } from "../methods/health/healthRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { HealthAPIActions, healthAPIActions } from "./decorators/healthApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type HealthApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type HealthApiClient<
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
      ? [...HealthRpcSchema, ...rpcSchema]
      : HealthRpcSchema,
    HealthAPIActions
  >
>;

export type CreateHealthApiClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates a Health API Client with a given transport configured for a Chain.
 *
 * The Health API Client is an interface to interact with the Health API through Avalanche-specific JSON-RPC API methods.
 *
 * @param parameters - {@link HealthApiClientConfig}
 * @returns A Health API Client. {@link HealthApiClient}
 *
 * @example
 * ```ts
 * import { createHealthApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createHealthApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get health status
 * const health = await client.liveness()
 * ```
 */
export function createHealthApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: HealthApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): HealthApiClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
> {
  const { key = "health", name = "Health API Client" } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType: "health",
  });

  return client.extend(healthAPIActions) as any;
}
