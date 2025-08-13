import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { AdminRpcSchema } from "../methods/admin/adminRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { AdminAPIActions, adminAPIActions } from "./decorators/adminApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type AdminApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type AdminApiClient<
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
      ? [...AdminRpcSchema, ...rpcSchema]
      : AdminRpcSchema,
    AdminAPIActions
  >
>;

export type CreateAdminApiClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates an Admin API Client with a given transport configured for a Chain.
 *
 * @param parameters - {@link  AdminApiClientConfig}
 * @returns An Admin API Client. {@link AdminApiClient}
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "https://api.avax.network/ext/admin",
 *   },
 * })
 *
 * // Set endpoint alias
 * const alias = await client.alias({ endpoint: "bc/X", alias: "myAlias" })
 * ```
 */
export function createAdminApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: AdminApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): AdminApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "admin", name = "Admin API Client" } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType: "admin",
  });

  return client.extend(adminAPIActions) as any;
}
