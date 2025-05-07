import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { PChainRpcSchema } from "../methods/pChain/pChainRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { pChainActions, PChainActions } from "./decorators/pChain.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";
import { createAvalancheTransportClient } from "./utils.js";

export type PChainClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type PChainClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  AvalancheCoreClient<
    transport,
    chain,
    accountOrAddress,
    rpcSchema extends RpcSchema
      ? [...PChainRpcSchema, ...rpcSchema]
      : PChainRpcSchema,
    PChainActions
  >
>;

export type CreatePChainClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates a P-Chain (Platform Chain) Client with a given transport configured for a Chain.
 *
 * The P-Chain Client is an interface to interact with the Avalanche Platform Chain through JSON-RPC API methods.
 * The Platform Chain is responsible for:
 * - Coordinating validators
 * - Managing subnets
 * - Creating and managing blockchains
 * - Handling staking operations
 *
 * @param config - {@link PChainClientConfig}
 * @returns A P-Chain Client. {@link PChainClient}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get the current validators
 * const validators = await client.getCurrentValidators({})
 *
 * // Get subnet information
 * const subnet = await client.getSubnet({ subnetID: 'subnet-id' })
 * ```
 */
export function createPChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: PChainClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): PChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const {
    key = "pChain",
    name = "P-Chain Client",
    transport: transportParam,
    chain: chainConfig,
    apiKey = "",
    rlToken = "",
  } = parameters;
  const customTransport = createAvalancheTransportClient<
    transport,
    chain,
    rpcSchema,
    raw
  >(transportParam, chainConfig, { apiKey, rlToken }, "pChain");
  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    transport: customTransport,
  });
  return client.extend(pChainActions) as any;
}
