import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Prettify,
  RpcSchema,
  Transport,
} from "viem";
import { ProposerVMRpcSchema } from "../methods/proposervm/proposervmRpcSchema.js";
import {
  AvalancheCoreClient,
  createAvalancheCoreClient,
  CreateAvalancheCoreClientErrorType,
} from "./createAvalancheCoreClient.js";
import {
  proposerVMAPIActions,
  ProposerVMAPIActions,
} from "./decorators/proposervmApi.js";
import { AvalancheClientConfig } from "./types/createAvalancheClient.js";

export type ProposerVMApiClientConfig<
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

export type ProposerVMApiClient<
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
      ? [...ProposerVMRpcSchema, ...rpcSchema]
      : ProposerVMRpcSchema,
    ProposerVMAPIActions
  >
>;

export type CreateProposerVMApiClientErrorType =
  CreateAvalancheCoreClientErrorType;

/**
 * Creates a ProposerVM API Client with a given transport configured for a Chain.
 *
 * The ProposerVM API Client is an interface to interact with the ProposerVM API through Avalanche-specific JSON-RPC API methods.
 *
 * @param parameters - {@link ProposerVMApiClientConfig}
 * @returns A ProposerVM API Client. {@link ProposerVMApiClient}
 *
 * @example
 * ```ts
 * import { createProposerVMApiClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 *
 * const client = createProposerVMApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * // Get proposer VM height
 * const height = await client.getProposedHeight()
 *
 * // Get current epoch
 * const epoch = await client.getCurrentEpoch()
 * ```
 */
export function createProposerVMApiClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: ProposerVMApiClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): ProposerVMApiClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
> {
  const {
    key = "proposervm",
    name = "ProposerVM API Client",
    clientType,
  } = parameters;

  const client = createAvalancheCoreClient({
    ...parameters,
    key,
    name,
    clientType,
  });

  return client.extend(proposerVMAPIActions) as any;
}
