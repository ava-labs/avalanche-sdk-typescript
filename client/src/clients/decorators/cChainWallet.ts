import { Chain, Transport } from "viem";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
  prepareExportTxn,
  prepareImportTxn,
} from "../../methods/wallet/cChain/index.js";
import { AvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";

export type CChainWalletActions = {
  /**
   * Prepare an export transaction from C-Chain to another chain (X-Chain or P-Chain).
   * This method creates the transaction data needed to export AVAX from the C-Chain.
   *
   * @see https://build.avax.network/docs/api-reference/c-chain/txn-format#exporttx
   *
   * @param args - {@link PrepareExportTxnParameters}
   * @returns Export transaction data. {@link PrepareExportTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const exportTxn = await client.cChain.prepareExportTxn({
   *   to: "P-fuji1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8",
   *   amount: avaxToNanoAvax(1), // 1 AVAX = 1_000_000_000 nAVAX
   *   destinationChain: "X"
   * })
   * ```
   */
  prepareExportTxn: (
    args: PrepareExportTxnParameters
  ) => Promise<PrepareExportTxnReturnType>;
  /**
   * Prepare an import transaction from another chain (X-Chain or P-Chain) to C-Chain.
   * This method creates the transaction data needed to import AVAX to the C-Chain.
   *
   * @see https://build.avax.network/docs/api-reference/c-chain/txn-format#importtx
   *
   * @param args - {@link PrepareImportTxnParameters}
   * @returns Import transaction data. {@link PrepareImportTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const importTxn = await client.cChain.prepareImportTxn({
   *   to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
   *   sourceChain: "X"
   * })
   * ```
   */
  prepareImportTxn: (
    args: PrepareImportTxnParameters
  ) => Promise<PrepareImportTxnReturnType>;
};

export function cChainWalletActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): CChainWalletActions {
  return {
    prepareExportTxn: (args) => prepareExportTxn(client, args),
    prepareImportTxn: (args) => prepareImportTxn(client, args),
  };
}
