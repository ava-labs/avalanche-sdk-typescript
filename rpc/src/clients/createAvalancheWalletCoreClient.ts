import { parseAvalancheAccount } from "@/account/utils/parseAvalancheAccount.js";
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
import { AvalancheAccount, XPAccount } from "../account/avalancheAccount.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  Extended,
} from "./createAvalancheCoreClient";
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
    account: AvalancheAccount | Address | undefined;
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
};

export type CreateAvalancheWalletCoreClientErrorType =
  CreatePublicClientErrorType;

export function createAvalancheWalletCoreClient(
  parameters: AvalancheWalletCoreClientConfig
): AvalancheWalletCoreClient {
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
  const pChainTransport = createAvalancheTransportClient(
    transportConfig,
    chainConfig,
    { apiKey, rlToken },
    "pChain"
  );

  const cChainTransport = createAvalancheTransportClient(
    transportConfig,
    chainConfig,
    { apiKey, rlToken },
    "cChain"
  );

  const xChainTransport = createAvalancheTransportClient(
    transportConfig,
    chainConfig,
    { apiKey, rlToken },
    "xChain"
  );

  const client = createClient({
    ...rest,
    transport: walletTransport,
    account: account?.evmAccount,
    key,
    name,
    type: "avalancheWalletCoreClient",
  });

  return {
    ...client,
    xpAccount: account?.xpAccount,
    pChainClient: createAvalancheCoreClient({
      ...rest,
      transport: pChainTransport,
    }),
    cChainClient: createAvalancheCoreClient({
      ...rest,
      transport: cChainTransport,
    }),
    xChainClient: createAvalancheCoreClient({
      ...rest,
      transport: xChainTransport,
    }),
  } as any;
}
