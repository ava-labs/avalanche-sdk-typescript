import {
  Account,
  Chain,
  CreatePublicClientErrorType,
  Prettify,
  RpcSchema,
  Transport,
  walletActions,
  WalletActions,
  WalletRpcSchema,
} from "viem";
import {
  AvalancheWalletCoreClient,
  AvalancheWalletCoreClientConfig,
  createAvalancheWalletCoreClient,
} from "./createAvalancheWalletCoreClient.js";

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
  AvalancheWalletCoreClient<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...WalletRpcSchema, ...rpcSchema]
      : WalletRpcSchema,
    WalletActions<chain, account>
  >
>;

export type CreateAvalancheWalletClientErrorType = CreatePublicClientErrorType;

export function createAvalancheWalletClient(
  parameters: AvalancheWalletCoreClientConfig
): AvalancheWalletCoreClient {
  const { key = "avalancheWallet", name = "Avalanche Wallet Client" } =
    parameters;

  const client = createAvalancheWalletCoreClient({
    ...parameters,
    key,
    name,
    type: "avalancheWalletClient",
  });

  return client.extend(walletActions) as AvalancheWalletClient;
}
