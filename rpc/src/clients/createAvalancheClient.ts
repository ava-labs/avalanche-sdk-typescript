import {
  Account,
  Address,
  Chain,
  createPublicClient,
  ParseAccount,
  RpcSchema,
  Transport,
} from "viem";
import { createTransportClient } from "./utils.js";
import {
  AvalancheClient,
  AvalancheClientConfig,
} from "./types/createAvalancheClient.js";
import { pChainActions } from "./decorators/pChain.js";
import { createPChainClient } from "./createPChainClient.js";

export function createAvalancheClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  parameters: AvalancheClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema,
    raw
  >
): AvalancheClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
> {
  const {
    key = "avalanche",
    name = "Avalanche Client",
    transport: transportParam,
  } = parameters;
  const publicTransport = createTransportClient<transport, rpcSchema, raw>(
    transportParam
  );
  const client = createPublicClient({
    ...parameters,
    key,
    name,
    transport: publicTransport,
  });
  const extendedClient = client as any;

  return {
    ...extendedClient,
    pChain: createPChainClient({
      ...parameters,
      key: "pChain",
      name: "P-Chain Client",
    }).extend(pChainActions) as any,
  };
}
