import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { ProposervmRpcSchema } from "../methods/proposervm/proposervmRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import {
  proposervmAPIActions,
  ProposervmAPIActions,
} from "./decorators/proposervmApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type ProposervmApiClientConfig<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> = Prettify<
  AvalancheClientConfig<transport, chain, accountOrAddress, rpcSchema, raw> & {
    clientType: "proposervmCChain" | "proposervmPChain" | "proposervmXChain";
  }
>;

export type ProposervmApiClient<
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
      ? [...ProposervmRpcSchema, ...rpcSchema]
      : ProposervmRpcSchema,
    ProposervmAPIActions
  >
>;

export type CreateProposervmApiClientErrorType =
  CreateAvalancheCoreClientErrorType;

/**
 * Creates a proposervm API Client with a given transport configured for a Chain.
 *
 * The proposervm API Client is an interface to interact with the proposervm API through Avalanche-specific JSON-RPC API methods.
 *
 * @param parameters - {@link ProposervmApiClientConfig}
 * @returns A proposervm API Client. {@link ProposervmApiClient}
 *
 * @example
 * ```ts
 * import { createProposervmApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const cChainClient = createProposervmApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 *   clientType: "proposervmCChain",
 * })
 *
 * // Get proposer VM height for C-Chain
 * const cChainHeight = await cChainClient.getProposedHeight()
 *
 * const pChainClient = createProposervmApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 *   clientType: "proposervmPChain",
 * })
 *
 * // Get proposer VM height for P-Chain
 * const pChainHeight = await pChainClient.getProposedHeight()
 * ```
 */
export function createProposervmApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: ProposervmApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): ProposervmApiClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
> {
  const {
    key = "proposervm",
    name = "proposervm API Client",
    clientType,
  } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType,
  });

  return client.extend(proposervmAPIActions) as any;
}
