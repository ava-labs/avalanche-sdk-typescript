import {
  Account,
  Address,
  Chain,
  Client,
  ClientConfig,
  createClient,
  CreatePublicClientErrorType,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { AvalancheAccount, XPAccount } from "../accounts/avalancheAccount.js";
import { parseAvalancheAccount } from "../accounts/utils/parseAvalancheAccount.js";
import { Extended } from "./createAvalancheBaseClient.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
} from "./createAvalancheCoreClient.js";
import { AvalancheTransportConfig } from "./types/types.js";
import { createAvalancheTransportClient } from "./utils.js";
export type AvalancheWalletCoreClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  Pick<
    ClientConfig<transport, chain, account, rpcSchema>,
    | "cacheTime"
    | "ccipRead"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "type"
  > & {
    account?: AvalancheAccount | Address | undefined;
    transport: AvalancheTransportConfig<transport, rpcSchema, raw>;
    apiKey?: string;
    rlToken?: string;
  }
>;

export type AvalancheWalletCoreClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
> = Client<transport, chain, account, rpcSchema, extended> & {
  xpAccount?: XPAccount;
  pChainClient: AvalancheCoreClient;
  cChainClient: AvalancheCoreClient;
  xChainClient: AvalancheCoreClient;
  infoClient: AvalancheCoreClient;
};

export type CreateAvalancheWalletCoreClientErrorType =
  CreatePublicClientErrorType;

export function createAvalancheWalletCoreClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends Extended | undefined = Extended | undefined
>(
  parameters: AvalancheWalletCoreClientConfig<
    transport,
    chain,
    account,
    rpcSchema
  >
): AvalancheWalletCoreClient<transport, chain, account, rpcSchema, extended> {
  let {
    key = "avalancheWalletCore",
    name = "Avalanche Wallet Core Client",
    transport: transportConfig,
    chain: chainConfig,
    account,
    apiKey = "",
    rlToken = "",
    ...rest
  } = parameters;

  if (typeof account === "string") {
    account = parseAvalancheAccount(account);
  }
  const walletTransport = createAvalancheTransportClient(
    transportConfig,
    chainConfig,
    { apiKey, rlToken },
    "wallet"
  );

  const client = createClient({
    ...rest,
    transport: walletTransport,
    account: account?.evmAccount,
    chain: chainConfig,
    key,
    name,
    type: "avalancheWalletCoreClient",
  });

  function extend(base: typeof client) {
    type ExtendFn = (base: typeof client) => unknown;
    return (extendFn: ExtendFn) => {
      const extended = extendFn(base) as Extended;
      for (const key in client) delete extended[key];
      const combined = { ...base, ...extended };
      return Object.assign(combined, { extend: extend(combined as any) });
    };
  }

  const walletCoreClient = {
    ...client,
    xpAccount: account?.xpAccount,
    pChainClient: createAvalancheCoreClient({
      ...parameters,
      clientType: "pChain",
    }),
    cChainClient: createAvalancheCoreClient({
      ...parameters,
      clientType: "cChain",
    }),
    xChainClient: createAvalancheCoreClient({
      ...parameters,
      clientType: "xChain",
    }),
    infoClient: createAvalancheCoreClient({
      ...parameters,
      clientType: "info",
    }),
  } as AvalancheWalletCoreClient<
    transport,
    chain,
    account,
    rpcSchema,
    extended
  >;

  return Object.assign(walletCoreClient, {
    extend: extend(walletCoreClient),
  });
}
