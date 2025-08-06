import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { CChainRpcSchema } from "../methods/cChain/cChainRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import { CChainActions, cChainActions } from "./decorators/cChain.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type CChainClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw>
>;

export type CChainClient<
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
      ? [...CChainRpcSchema, ...rpcSchema]
      : CChainRpcSchema,
    CChainActions
  >
>;

export type CreateCChainClientErrorType = CreateAvalancheCoreClientErrorType;

/**
 * Creates a C-Chain (Contract Chain) Client with a given transport configured for a Chain.
 *
 * The C-Chain Client is an interface to interact with the Avalanche Contract Chain through Avalanche-specific JSON-RPC API methods.
 * The Contract Chain is an instance of the Ethereum Virtual Machine (EVM) that supports:
 * - Cross-chain operations (import/export)
 * - Atomic transactions
 * - UTXO management
 * - Dynamic fee calculations
 *
 * @param parameters - {@link CChainClientConfig}
 * @returns A C-Chain Client. {@link CChainClient}
 *
 * @example
 * ```ts
 * import { createCChainClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createCChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get atomic transaction
 * const atomicTx = await client.getAtomicTx({ txID: '0x...' })
 * ```
 */
export function createCChainClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: CChainClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): CChainClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = "cChain", name = "C-Chain Client" } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType: "cChain",
  });

  return client.extend(cChainActions) as any;
}
