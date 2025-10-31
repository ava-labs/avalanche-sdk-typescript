import { Chain, Transport } from "viem";
import { getCurrentEpoch } from "../../methods/proposervm/getCurrentEpoch.js";
import { getProposedHeight } from "../../methods/proposervm/getProposedHeight.js";
import { GetCurrentEpochReturnType } from "../../methods/proposervm/types/getCurrentEpoch.js";
import { GetProposedHeightReturnType } from "../../methods/proposervm/types/getProposedHeight.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type ProposerVMAPIActions = {
  /**
   * Returns this node's current proposer VM height.
   *
   * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetproposedheight
   *
   * @returns This node's current proposer VM height. {@link GetProposedHeightReturnType}
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
   * const height = await client.proposervm.getProposedHeight()
   * ```
   */
  getProposedHeight: () => Promise<GetProposedHeightReturnType>;

  /**
   * Returns the current epoch information.
   *
   * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetcurrentepoch
   *
   * @returns The current epoch information. {@link GetCurrentEpochReturnType}
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
   * const epoch = await client.proposervm.getCurrentEpoch()
   * ```
   */
  getCurrentEpoch: () => Promise<GetCurrentEpochReturnType>;
};

export function proposerVMAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): ProposerVMAPIActions {
  return {
    getProposedHeight: () => getProposedHeight(client),
    getCurrentEpoch: () => getCurrentEpoch(client),
  };
}
