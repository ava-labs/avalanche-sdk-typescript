import {
  Account,
  Address,
  Chain,
  Prettify,
  PublicClient,
  RpcSchema,
  Transport,
} from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClientConfig,
  CreateAvalancheCoreClientErrorType,
} from "../createAvalancheCoreClient.js";
import { TransportConfig } from "./types.js";
import { PChainRpcSchema } from "../../methods/pchain/pChainRpcSchema.js";
import { PChainActions } from "../decorators/pChain.js";

export type AvalancheClientConfig<
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

export type AvalancheClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  PublicClient<
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  > & {
    pChain:
      | AvalancheCoreClient<transport, chain, accountOrAddress, PChainRpcSchema, PChainActions>
      | undefined;
  }
>;

export type CreateAvalancheClientErrorType = CreateAvalancheCoreClientErrorType;
