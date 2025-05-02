import { Chain, Client, Transport } from "viem";
import { baseFee } from "../../methods/public/baseFee.js";
import { getChainConfig } from "../../methods/public/getChainConfig.js";
import { maxPriorityFeePerGas } from "../../methods/public/maxPriorityFeePerGas.js";
import { BaseFeeReturnType } from "../../methods/public/types/baseFee.js";
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
   * import { createAvalancheClient} from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
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
   * import { createAvalancheClient} from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
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
   * import { createAvalancheClient} from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
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
};

export function avalanchePublicActions<
  chain extends Chain | undefined = Chain | undefined
>(client: Client<Transport, chain>): AvalanchePublicActions {
  return {
    baseFee: () => baseFee(client),
    getChainConfig: () => getChainConfig(client),
    maxPriorityFeePerGas: () => maxPriorityFeePerGas(client),
  };
}
