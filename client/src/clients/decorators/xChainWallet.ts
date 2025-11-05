import { Chain, Transport } from "viem";
import { prepareBaseTxn } from "../../methods/wallet/xChain/prepareBaseTxn.js";
import { prepareExportTxn } from "../../methods/wallet/xChain/prepareExportTxn.js";
import { prepareImportTxn } from "../../methods/wallet/xChain/prepareImportTxn.js";
import {
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
} from "../../methods/wallet/xChain/types/prepareBaseTxn";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "../../methods/wallet/xChain/types/prepareExportTxn";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "../../methods/wallet/xChain/types/prepareImportTxn";
import { AvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";

export type XChainWalletActions = {
  /**
   * Prepares a base transaction for the X-chain.
   *
   * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-basetx
   *
   * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
   * @param params - The parameters for the transaction. {@link PrepareBaseTxnParameters}
   * @returns The unsigned transaction. {@link PrepareBaseTxnReturnType}
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
   * const baseTxn = await client.xChain.prepareBaseTxn({
   *   outputs: [{
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *     amount: avaxToNanoAvax(0.0001),
   *   }],
   * })
   * ```
   */
  prepareBaseTxn: (
    args: PrepareBaseTxnParameters
  ) => Promise<PrepareBaseTxnReturnType>;

  /**
   * Prepares an export transaction for the X-chain.
   *
   * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-exporttx
   *
   * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
   * @param params - The parameters for the transaction. {@link PrepareExportTxnParameters}
   * @returns The unsigned transaction. {@link PrepareExportTxnReturnType}
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
   * const exportTxn = await client.xChain.prepareExportTxn({
   *   destinationChain: "P",
   *   exportedOutput: {
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *     amount: avaxToNanoAvax(0.0001),
   *   },
   * })
   * ```
   */
  prepareExportTxn: (
    args: PrepareExportTxnParameters
  ) => Promise<PrepareExportTxnReturnType>;

  /**
   * Prepares an import transaction for the X-chain.
   *
   * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-importtx
   *
   * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
   * @param params - The parameters for the transaction. {@link PrepareImportTxnParameters}
   * @returns The unsigned transaction. {@link PrepareImportTxnReturnType}
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
   * const importTxn = await client.xChain.prepareImportTxn({
   *   sourceChain: "P",
   *   importedOutput: {
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *   },
   * })
   * ```
   */
  prepareImportTxn: (
    args: PrepareImportTxnParameters
  ) => Promise<PrepareImportTxnReturnType>;
};

export function xChainWalletActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): XChainWalletActions {
  return {
    prepareBaseTxn: (args) => prepareBaseTxn(client, args),
    prepareExportTxn: (args) => prepareExportTxn(client, args),
    prepareImportTxn: (args) => prepareImportTxn(client, args),
  };
}
