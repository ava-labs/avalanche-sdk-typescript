import { XPAccount } from "src/accounts/avalancheAccount";
import { AvalancheWalletRpcSchema } from "src/methods/wallet/avalancheWalletRPCSchema.js";
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
import { AvalancheCoreClient } from "./createAvalancheCoreClient";
import {
  AvalancheWalletCoreClientConfig,
  createAvalancheWalletCoreClient,
} from "./createAvalancheWalletCoreClient";
import {
  avalancheWalletActions,
  AvalancheWalletActions,
} from "./decorators/avalancheWallet.js";

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

  const avalancheWalletClient = client
    .extend(walletActions)
    .extend(avalancheWalletActions as any);
  return avalancheWalletClient;
}
