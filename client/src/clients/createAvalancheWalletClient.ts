import {
  Account,
  Chain,
  Client,
  CreatePublicClientErrorType,
  Prettify,
  PublicActions,
  publicActions,
  PublicRpcSchema,
  rpcSchema,
  RpcSchema,
  Transport,
  walletActions,
  WalletActions,
  WalletRpcSchema,
} from "viem";
import { XPAccount } from "../accounts/avalancheAccount.js";
import { CChainRpcSchema } from "../methods/cChain/cChainRpcSchema.js";
import { PChainRpcSchema } from "../methods/pChain/pChainRpcSchema.js";
import { AvalanchePublicRpcSchema } from "../methods/public/avalanchePublicRpcSchema.js";
import { AvalancheWalletRpcSchema } from "../methods/wallet/avalancheWalletRPCSchema.js";
import { XChainRpcSchema } from "../methods/xChain/xChainRpcSchema.js";
import { AvalancheCoreClient } from "./createAvalancheCoreClient.js";
import {
  AvalancheWalletCoreClient,
  AvalancheWalletCoreClientConfig,
  createAvalancheWalletCoreClient,
} from "./createAvalancheWalletCoreClient.js";
import {
  AvalanchePublicActions,
  avalanchePublicActions,
} from "./decorators/avalanchePublic.js";
import {
  avalancheWalletActions,
  AvalancheWalletActions,
} from "./decorators/avalancheWallet.js";
import { CChainActions, cChainActions } from "./decorators/cChain.js";
import {
  cChainWalletActions,
  CChainWalletActions,
} from "./decorators/cChainWallet.js";
import { PChainActions, pChainActions } from "./decorators/pChain.js";
import {
  pChainWalletActions,
  PChainWalletActions,
} from "./decorators/pChainWallet.js";
import { XChainActions, xChainActions } from "./decorators/xChain.js";
import {
  xChainWalletActions,
  XChainWalletActions,
} from "./decorators/xChainWallet.js";

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
      ? [
          ...WalletRpcSchema,
          ...AvalancheWalletRpcSchema,
          ...PublicRpcSchema,
          ...AvalanchePublicRpcSchema,
          ...rpcSchema
        ]
      : [
          ...WalletRpcSchema,
          ...AvalancheWalletRpcSchema,
          ...PublicRpcSchema,
          ...AvalanchePublicRpcSchema
        ],
    WalletActions<chain, account> &
      AvalancheWalletActions &
      AvalanchePublicActions &
      PublicActions
  > & {
    xpAccount?: XPAccount;
    pChainClient: AvalancheCoreClient;
    cChainClient: AvalancheCoreClient;
    xChainClient: AvalancheCoreClient;
  } & {
    cChain: AvalancheWalletCoreClient<
      transport,
      chain,
      account,
      rpcSchema extends RpcSchema
        ? [...CChainRpcSchema, ...rpcSchema]
        : [...CChainRpcSchema],
      CChainWalletActions & CChainActions
    >;
    pChain: AvalancheWalletCoreClient<
      transport,
      chain,
      account,
      rpcSchema extends RpcSchema
        ? [...PChainRpcSchema, ...rpcSchema]
        : [...PChainRpcSchema],
      PChainWalletActions & PChainActions
    >;
    xChain: AvalancheWalletCoreClient<
      transport,
      chain,
      account,
      rpcSchema extends RpcSchema
        ? [...XChainRpcSchema, ...rpcSchema]
        : [...XChainRpcSchema],
      XChainWalletActions & XChainActions
    >;
  }
>;

export type CreateAvalancheWalletClientErrorType = CreatePublicClientErrorType;

/**
 * Creates an Avalanche Wallet Client with a given transport configured for a Chain.
 *
 * The Avalanche Wallet Client is an interface to interact with the Core Wallet API through Avalanche-specific JSON-RPC API methods.
 * @see https://docs.core.app/docs/reference/json-rpc-api
 *
 * @param parameters - {@link AvalancheWalletClientConfig}
 * @returns A Avalanche Wallet Client. {@link AvalancheWalletClient}
 *
 * @example
 * ```ts
 * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createAvalancheWalletClient({
 *   chain: avalanche,
 *   transport: { type: "http" },
 * })
 *
 * const pubKey = await client.getAccountPubKey()
 * ```
 */
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

  const avalancheWalletClient = (
    client.extend(walletActions).extend(avalancheWalletActions as any) as any
  )
    .extend(publicActions as any)
    .extend(avalanchePublicActions as any);

  const cChainClient = (
    client.extend(walletActions).extend(cChainWalletActions as any) as any
  ).extend((client: AvalancheWalletCoreClient) =>
    cChainActions(client.cChainClient)
  );

  const pChainClient = (
    client.extend(walletActions).extend(pChainWalletActions as any) as any
  ).extend((client: AvalancheWalletCoreClient) =>
    pChainActions(client.pChainClient)
  );

  const xChainClient = (
    client.extend(walletActions).extend(xChainWalletActions as any) as any
  ).extend((client: AvalancheWalletCoreClient) =>
    xChainActions(client.xChainClient)
  );

  return {
    ...(avalancheWalletClient as any),
    cChain: cChainClient,
    pChain: pChainClient,
    xChain: xChainClient,
  } as AvalancheWalletClient<transport, chain, account, rpcSchema>;
}
