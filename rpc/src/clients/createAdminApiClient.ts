import { Account, Address, Chain, ParseAccount, Prettify, RpcSchema, Transport } from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { TransportConfig } from "./types/types.js";
import { createTransportClient } from "./utils.js";
import { AdminRpcSchema } from "../methods/admin/adminRpcSchema.js";
import { AdminAPIActions, adminAPIActions } from "./decorators/adminApi.js";

export type AdminApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  Pick<
    AvalancheCoreClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | "batch"
    | "cacheTime"
    | "ccipRead"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
  > & {
    transport: TransportConfig<transport, rpcSchema, raw>;
  }
>;

export type AdminApiClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...AdminRpcSchema, ...rpcSchema] : AdminRpcSchema,
      AdminAPIActions
  >
>;

export type CreateAdminApiClientErrorType = CreateAvalancheCoreClientErrorType;

export function createAdminApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: AdminApiClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): AdminApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'admin', name = 'Admin API Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "admin");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(adminAPIActions) as any;
}