import { Chain, PublicActions, publicActions, Transport } from "viem";
import { AvalancheClient } from "../types/createAvalancheClient.js";
import { AdminAPIActions, adminAPIActions } from "./adminApi.js";
import {
  AvalanchePublicActions,
  avalanchePublicActions,
} from "./avalanchePublic.js";
import { CChainActions, cChainActions } from "./cChain.js";
import { healthAPIActions, HealthAPIActions } from "./healthApi.js";
import { IndexAPIActions, indexAPIActions } from "./indexApi.js";
import { InfoAPIActions, infoAPIActions } from "./infoApi.js";
import { pChainActions, PChainActions } from "./pChain.js";
import { XChainActions, xChainActions } from "./xChain.js";

export type AvalancheActions = PublicActions &
  AvalanchePublicActions & {
    pChain?: PChainActions;
    cChain?: CChainActions;
    xChain?: XChainActions;
    public?: AvalanchePublicActions;
    admin?: AdminAPIActions;
    info?: InfoAPIActions;
    health?: HealthAPIActions;
    indexPChainBlock?: IndexAPIActions;
    indexCChainBlock?: IndexAPIActions;
    indexXChainBlock?: IndexAPIActions;
    indexXChainTx?: IndexAPIActions;
  };

export function avalancheActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheClient<transport, chain>): AvalancheActions {
  const {
    pChain: pChainClient,
    cChain: cChainClient,
    xChain: xChainClient,
    admin: adminClient,
    info: infoClient,
    health: healthClient,
    indexPChainBlock: indexPChainBlockClient,
    indexCChainBlock: indexCChainBlockClient,
    indexXChainBlock: indexXChainBlockClient,
    indexXChainTx: indexXChainTxClient,
    ...publicClient
  } = client as any;

  return {
    ...publicActions(publicClient),
    ...avalanchePublicActions(publicClient),
    ...(pChainClient ? { pChain: pChainActions(pChainClient) } : {}),
    ...(cChainClient ? { cChain: cChainActions(cChainClient) } : {}),
    ...(xChainClient ? { xChain: xChainActions(xChainClient) } : {}),
    ...(infoClient ? { info: infoAPIActions(infoClient) } : {}),
    ...(healthClient ? { health: healthAPIActions(healthClient) } : {}),
    ...(adminClient ? { admin: adminAPIActions(adminClient) } : {}),
    ...(indexPChainBlockClient
      ? { indexPChainBlock: indexAPIActions(indexPChainBlockClient) }
      : {}),
    ...(indexCChainBlockClient
      ? { indexCChainBlock: indexAPIActions(indexCChainBlockClient) }
      : {}),
    ...(indexXChainBlockClient
      ? { indexXChainBlock: indexAPIActions(indexXChainBlockClient) }
      : {}),
    ...(indexXChainTxClient
      ? { indexXChainTx: indexAPIActions(indexXChainTxClient) }
      : {}),
  };
}
