import {
  Account,
  Address,
  Chain,
  Prettify,
  RpcSchema,
  Transport,
  ParseAccount,
} from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { pChainActions, PChainActions } from "./decorators/pChain.js";
import { PChainRpcSchema } from "../methods/pchain/pChainRpcSchema.js";
import { TransportConfig } from "./types/types.js";
import { createTransportClient } from "./utils.js";

export type PChainClientConfig<
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

export type PChainClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...PChainRpcSchema, ...rpcSchema] : PChainRpcSchema,
      PChainActions
  >
>;

export type CreatePChainClientErrorType = CreateAvalancheCoreClientErrorType;

export function createPChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: PChainClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): PChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'pchain', name = 'P-Chain Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "pChain");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(pChainActions) as any;
}