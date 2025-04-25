import { Account, Address, Chain, ParseAccount, Prettify, RpcSchema, Transport } from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { TransportConfig } from "./types/types.js";
import { createTransportClient } from "./utils.js";
import { CChainRpcSchema } from "../methods/cChain/cChainRpcSchema.js";
import { CChainActions, cChainActions } from "./decorators/cChain.js";

export type CChainClientConfig<
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

export type CChainClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...CChainRpcSchema, ...rpcSchema] : CChainRpcSchema,
      CChainActions
  >
>;

export type CreateCChainClientErrorType = CreateAvalancheCoreClientErrorType;

export function createCChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: CChainClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): CChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'cChain', name = 'C-Chain Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "cChain");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(cChainActions) as any;
}