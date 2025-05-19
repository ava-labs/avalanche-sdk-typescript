import {
  Account,
  Chain,
  Client,
  CreatePublicClientErrorType,
  Prettify,
  rpcSchema,
  RpcSchema,
  Transport,
  walletActions,
  WalletActions,
  WalletRpcSchema,
} from "viem";
import { XPAccount } from "../accounts/avalancheAccount";
import { AvalancheWalletRpcSchema } from "../methods/wallet/avalancheWalletRPCSchema.js";
import { AvalancheCoreClient } from "./createAvalancheCoreClient";
import {
  AvalancheWalletCoreClient,
  AvalancheWalletCoreClientConfig,
  createAvalancheWalletCoreClient,
} from "./createAvalancheWalletCoreClient";
import {
  avalancheWalletActions,
  AvalancheWalletActions,
} from "./decorators/avalancheWallet.js";
import { Erc20Actions, erc20Actions } from "./decorators/erc20";

export type AvalancheWalletClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheWalletCoreClientConfig<transport, chain, account, rpcSchema, raw>
>;

export type AvalancheWalletClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...WalletRpcSchema, ...AvalancheWalletRpcSchema, ...rpcSchema]
      : [...WalletRpcSchema, ...AvalancheWalletRpcSchema],
    WalletActions<chain, account> & AvalancheWalletActions
  > & {
    xpAccount?: XPAccount;
    pChainClient: AvalancheCoreClient;
    cChainClient: AvalancheCoreClient;
    xChainClient: AvalancheCoreClient;
  } & {
    erc20: AvalancheWalletCoreClient<
      transport,
      chain,
      account,
      rpcSchema,
      Erc20Actions
    >;
  }
>;

export type CreateAvalancheWalletClientErrorType = CreatePublicClientErrorType;

export function createAvalancheWalletClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: AvalancheWalletClientConfig<transport, chain, account, rpcSchema>
): AvalancheWalletClient<transport, chain, account, rpcSchema> {
  const { key = "avalancheWallet", name = "Avalanche Wallet Client" } =
    parameters;

  const client = createAvalancheWalletCoreClient({
    ...parameters,
    key,
    name,
    type: "avalancheWalletClient",
    rpcSchema: rpcSchema<AvalancheWalletRpcSchema & WalletRpcSchema>(),
  });
  const erc20Methods = erc20Actions(client);
  const avalancheWalletClient = client
    .extend(walletActions)
    .extend(avalancheWalletActions as any);
  return {
    ...(avalancheWalletClient as any),
    erc20: erc20Methods,
  };
}
