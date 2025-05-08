import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "@avalanche-sdk/rpc";
import { Extended } from "@avalanche-sdk/rpc/clients/createAvalancheCoreClient.js";
import {
  PrimaryNetworkActions,
  primaryNetworkActions,
} from "./decorators/primaryNetwork.js";
import {
  createPrimaryNetworkCoreClient,
  CreatePrimaryNetworkCoreClientErrorType,
  PrimaryNetworkCoreClient,
  PrimaryNetworkCoreClientConfig,
} from "./primaryNetworkCoreClient.js";

export type PrimaryNetworkClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Pick<
    PrimaryNetworkCoreClientConfig<
      transport,
      chain,
      accountOrAddress,
      rpcSchema
    >,
    | "batch"
    | "cacheTime"
    | "ccipRead"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "nodeUrl"
  > & {
    apiKey?: string;
    rlToken?: string;
  }
>;

export type PrimaryNetworkClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = undefined
> = Prettify<
  PrimaryNetworkCoreClient<transport, chain, account, rpcSchema, extended>
>;

export type CreatePrimaryNetworkClientErrorType =
  CreatePrimaryNetworkCoreClientErrorType;

export async function createPrimaryNetworkClient<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined
>(
  parameters: PrimaryNetworkClientConfig<transport, chain, accountOrAddress>
): Promise<
  PrimaryNetworkClient<
    transport,
    chain,
    ParseAccount<accountOrAddress>,
    undefined,
    PrimaryNetworkActions
  >
> {
  const client = (await createPrimaryNetworkCoreClient<
    transport,
    chain,
    ParseAccount<accountOrAddress>,
    undefined,
    PrimaryNetworkActions
  >(parameters)) as any;
  const extendedClient = client.extend(primaryNetworkActions) as any;
  return extendedClient;
}
