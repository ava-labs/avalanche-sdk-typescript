import { Chain, Client, Transport } from "viem";
import { baseFee } from "../../methods/public/baseFee.js";
import { feeConfig } from "../../methods/public/feeConfig.js";
import { getActiveRulesAt } from "../../methods/public/getActiveRulesAt.js";
import { getChainConfig } from "../../methods/public/getChainConfig.js";
import { maxPriorityFeePerGas } from "../../methods/public/maxPriorityFeePerGas.js";
import { BaseFeeReturnType } from "../../methods/public/types/baseFee.js";
import {
  FeeConfigParameters,
  FeeConfigReturnType,
} from "../../methods/public/types/feeConfig.js";
import {
  GetActiveRulesAtParameters,
  GetActiveRulesAtReturnType,
} from "../../methods/public/types/getActiveRulesAt.js";
import { GetChainConfigReturnType } from "../../methods/public/types/getChainConfig.js";
import { MaxPriorityFeePerGasReturnType } from "../../methods/public/types/maxPriorityFeePerGas.js";
export type AvalanchePublicActions = {
  /**
   * Get the base fee for the next block.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_basefee
   *
   * @returns The base fee for the next block as a hex value. {@link BaseFeeReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const baseFee = await client.baseFee()
   * ```
   */
  baseFee: () => Promise<BaseFeeReturnType>;

  /**
   * Get the chain configuration for the C-Chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_getchainconfig
   *
   * @returns The chain configuration including chainId, block numbers for various forks,
   * and timestamps for Avalanche-specific upgrades. {@link GetChainConfigReturnType}
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
   * const chainConfig = await client.getChainConfig()
   * ```
   */
  getChainConfig: () => Promise<GetChainConfigReturnType>;

  /**
   * Get the priority fee needed to be included in a block.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_maxpriorityfeepergas
   *
   * @returns The priority fee needed to be included in a block as a hex value. {@link MaxPriorityFeePerGasReturnType}
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
   * const maxPriorityFee = await client.maxPriorityFeePerGas()
   * ```
   */
  maxPriorityFeePerGas: () => Promise<MaxPriorityFeePerGasReturnType>;

  /**
   * Get the fee config for a specific block.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_feeconfig
   *
   * @param args - The parameters for the fee config for a specific block. {@link FeeConfigParameters}
   * @returns The fee config for the specified block. {@link FeeConfigReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const feeConfig = await client.feeConfig({ blk: "0x1" })
   * ```
   */
  feeConfig: (args: FeeConfigParameters) => Promise<FeeConfigReturnType>;

  /**
   * Get the active rules at a specific timestamp.
   *
   * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_getactiverulesat
   *
   * @param args - The parameters for the active rules at a specific timestamp. {@link GetActiveRulesAtParameters}
   * @returns The active rules at the specified timestamp. {@link GetActiveRulesAtReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const activeRules = await client.getActiveRulesAt({ timestamp: "0x1" })
   * ```
   */
  getActiveRulesAt: (
    args: GetActiveRulesAtParameters
  ) => Promise<GetActiveRulesAtReturnType>;
};

export function avalanchePublicActions<
  chain extends Chain | undefined = Chain | undefined
>(client: Client<Transport, chain>): AvalanchePublicActions {
  return {
    baseFee: () => baseFee(client),
    getChainConfig: () => getChainConfig(client),
    maxPriorityFeePerGas: () => maxPriorityFeePerGas(client),
    feeConfig: (args) => feeConfig(client, args),
    getActiveRulesAt: (args) => getActiveRulesAt(client, args),
  };
}
