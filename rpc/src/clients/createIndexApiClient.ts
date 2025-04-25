import { Account, Address, Chain, ParseAccount, Prettify, RpcSchema, Transport } from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { TransportConfig } from "./types/types.js";
import { createTransportClient } from "./utils.js";
import { IndexRpcSchema } from "../methods/index/indexRpcSchema.js";
import { indexAPIActions, IndexAPIActions } from "./decorators/indexApi.js";

export type IndexApiClientConfig<
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

export type IndexApiClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...IndexRpcSchema, ...rpcSchema] : IndexRpcSchema,
      IndexAPIActions
  >
>;

export type CreateIndexApiClientErrorType = CreateAvalancheCoreClientErrorType;

export function createIndexApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: IndexApiClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): IndexApiClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'index', name = 'Index API Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "index");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(indexAPIActions) as any;
}