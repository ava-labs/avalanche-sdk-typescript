import { Chain, Transport } from "viem";
import { getCurrentEpoch } from "../../methods/proposervm/getCurrentEpoch.js";
import { getProposedHeight } from "../../methods/proposervm/getProposedHeight.js";
import { GetCurrentEpochReturnType } from "../../methods/proposervm/types/getCurrentEpoch.js";
import { GetProposedHeightReturnType } from "../../methods/proposervm/types/getProposedHeight.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type ProposervmAPIActions = {
  /**
   * Returns this node's current proposer VM height for the requested chain (C-Chain, P-Chain, X-Chain).
   *
   * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetproposedheight
   *
   * @returns This node's current proposer VM height for the requested chain. {@link GetProposedHeightReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const cChainHeight = await client.proposervm.cChain.getProposedHeight()
   * const pChainHeight = await client.proposervm.pChain.getProposedHeight()
   * const xChainHeight = await client.proposervm.xChain.getProposedHeight()
   * ```
   */
  getProposedHeight: () => Promise<GetProposedHeightReturnType>;

  /**
   * Returns the current epoch information for the requested chain (C-Chain, P-Chain, X-Chain).
   *
   * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetcurrentepoch
   *
   * @returns The current epoch information for the requested chain. {@link GetCurrentEpochReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const cChainEpoch = await client.proposervm.cChain.getCurrentEpoch()
   * const pChainEpoch = await client.proposervm.pChain.getCurrentEpoch()
   * const xChainEpoch = await client.proposervm.xChain.getCurrentEpoch()
   * ```
   */
  getCurrentEpoch: () => Promise<GetCurrentEpochReturnType>;
};

export function proposervmAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): ProposervmAPIActions {
  return {
    getProposedHeight: () => getProposedHeight(client),
    getCurrentEpoch: () => getCurrentEpoch(client),
  };
}
