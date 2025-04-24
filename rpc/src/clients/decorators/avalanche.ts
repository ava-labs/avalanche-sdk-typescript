import { Chain, Transport } from "viem";
import { pChainActions, PChainActions } from "./pChain.js";
import { AvalancheClient } from "../types/createAvalancheClient.js";
import { publicActions } from "viem";

export type AvalancheActions = {
  pchain?: PChainActions;
};

export function avalancheActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheClient<transport, chain>): AvalancheActions {
  const { pChain: pChainClient, ...publicClient } = client;
  return {
    ...publicActions(publicClient),
    ...(pChainClient ? { pchain: pChainActions(pChainClient) } : {}),
  };
}
