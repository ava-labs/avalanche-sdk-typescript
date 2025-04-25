import { Account, Address, Chain, ParseAccount, Prettify, RpcSchema, Transport } from "viem";
import { AvalancheCoreClient, AvalancheCoreClientConfig, createAvalancheCoreClient, CreateAvalancheCoreClientErrorType } from "./createAvalancheCoreClient.js";
import { TransportConfig } from "./types/types.js";
import { XChainRpcSchema } from "../methods/xChain/xChainRpcSchema.js";
import { xChainActions, XChainActions } from "./decorators/xChain.js";
import { createTransportClient } from "./utils.js";

export type XChainClientConfig<
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

export type XChainClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
    AvalancheCoreClient<
      transport,
      chain,
      accountOrAddress,
      rpcSchema extends RpcSchema ? [ ...XChainRpcSchema, ...rpcSchema] : XChainRpcSchema,
      XChainActions
  >
>;

export type CreateXChainClientErrorType = CreateAvalancheCoreClientErrorType;

export function createXChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
    parameters: XChainClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>,
): XChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {

    const { key = 'xChain', name = 'X-Chain Client', transport: transportParam } = parameters;
    const customTransport = createTransportClient<transport, rpcSchema, raw>(transportParam, "xChain");
    const client = createAvalancheCoreClient({
        ...parameters,
        key,
        name,
        transport: customTransport,
    })
    return client.extend(xChainActions) as any;
}