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
