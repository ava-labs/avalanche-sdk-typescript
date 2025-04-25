import { Account, Address, Chain, ParseAccount, Prettify, RpcSchema, Transport } from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { TransportConfig } from "./types/types.js";
import { createTransportClient } from "./utils.js";
import { InfoRpcSchema } from "../methods/info/infoRpcSchema.js";
import { infoAPIActions, InfoAPIActions } from "./decorators/infoApi.js";

export type InfoApiClientConfig<
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

export type InfoApiClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...InfoRpcSchema, ...rpcSchema] : InfoRpcSchema,
      InfoAPIActions
  >
>;

export type CreateInfoApiClientErrorType = CreateAvalancheCoreClientErrorType;

export function createInfoApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: InfoApiClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): InfoApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'info', name = 'Info API Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "info");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(infoAPIActions) as any;
}