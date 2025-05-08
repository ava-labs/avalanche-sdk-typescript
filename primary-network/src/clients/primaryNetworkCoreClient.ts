import { Context as ContextType } from "@avalabs/avalanchejs";
import {
  Account,
  Address,
  Chain,
  Client,
  ClientConfig,
  CreateAvalancheClientErrorType,
  createClient,
  createPChainClient,
  http,
  ParseAccount,
  PChainClient,
  Prettify,
  RpcSchema,
  Transport,
  walletActions,
  WalletActions,
  WalletRpcSchema,
} from "@avalanche-sdk/rpc";
import { Extended } from "@avalanche-sdk/rpc/clients/createAvalancheCoreClient";

export type PrimaryNetworkCoreClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Omit<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    "transport"
  > & {
    nodeUrl: string | undefined;
  }
>;
export type PrimaryNetworkCoreClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...WalletRpcSchema, ...rpcSchema]
      : WalletRpcSchema,
    WalletActions<chain, account> &
      (extended extends Extended ? extended : unknown)
  > & {
    pChain: PChainClient<transport, chain, account>;
    nodeUrl: string;
    context: ContextType.Context;
  }
>;

export type CreatePrimaryNetworkCoreClientErrorType =
  CreateAvalancheClientErrorType;

export async function createPrimaryNetworkCoreClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = undefined
>(
  parameters: PrimaryNetworkCoreClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  >
): Promise<
  PrimaryNetworkCoreClient<
    transport,
    chain,
    ParseAccount<accountOrAddress>,
    rpcSchema,
    extended
  >
> {
  const {
    key = "primaryNetworkCore",
    name = "Primary Network Core Client",
    nodeUrl,
    chain,
    ...rest
  } = parameters;

  const url = nodeUrl ?? chain?.rpcUrls?.default?.http?.[0];

  if (!url) {
    throw new Error("Node URL is required");
  }

  const client = createClient({
    ...rest,
    transport: http(url),
    key,
    name,
  });
  const extendedClient = client.extend(walletActions) as any;
  const origin = new URL(url).origin;
  return {
    ...extendedClient,
    nodeUrl: origin,
    context: await ContextType.getContextFromURI(origin),
    pChain: createPChainClient({
      ...rest,
      chain,
      key,
      name,
      transport: {
        type: "http",
        url: nodeUrl,
      } as any,
    }),
  } as any;
}
