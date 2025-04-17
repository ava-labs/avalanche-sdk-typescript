import {
  Transport,
  Chain,
  Account,
  Address,
  RpcSchema,
  Prettify,
  ClientConfig,
  Client,
  ParseAccount,
  createClient,
  CreatePublicClientErrorType,
} from "viem";
import { PlatformChainRpcSchema } from "../methods/platformChain/platformChainSchema.js";
import { platformChainActions, PlatformChainActions } from "./decorators/platformChain.js";

export type PlatformChainClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | "batch"
    | "cacheTime"
    | "ccipRead"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "transport"
  >
>;

export type PlatformChainClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain,
    accountOrAddress,
    rpcSchema extends RpcSchema
      ? [...PlatformChainRpcSchema]
      : PlatformChainRpcSchema,
    PlatformChainActions
  >
>;

export type CreatePlatformChainClientErrorType = CreatePublicClientErrorType;

/**
 * Creates a Platform Chain Client with a given [Transport](https://viem.sh/docs/clients/intro) configured for a [Chain](https://viem.sh/docs/clients/chains).
 *
 * - Docs: https://viem.sh/docs/clients/public
 *
 * A Platform Chain Client is an interface to "Platform Chain" [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods such as retrieving block numbers, transactions, reading from smart contracts, etc through [Platform Chain Actions](/docs/actions/public/introduction).
 *
 * @param config - {@link PlatformChainClientConfig}
 * @returns A Platform Chain Client. {@link PlatformChainClient}
 *
 * @example
 * import { createPlatformChainClient, http } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/chains'
 *
 * const client = createPlatformChainClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export function createPlatformChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: PlatformChainClientConfig<transport, chain, accountOrAddress, rpcSchema>
): PlatformChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "platform", name = "Platform Chain Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "platformChainClient",
  });
  return client.extend(platformChainActions) as any;
}
