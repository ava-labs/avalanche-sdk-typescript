import { evm, evmSerial, utils } from "@avalabs/avalanchejs";
import { getTransactionCount } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { baseFee as getBaseFee } from "../../public/index.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  avaxToNanoAvax,
  bech32AddressToBytes,
  getChainIdFromAlias,
  weiToNanoAvax,
} from "../utils.js";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "./types/prepareExportTxn.js";

/**
 * Prepares an export transaction for the C-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareExportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareExportTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/c-chain/txn-format#exporttx
 *
 * @example
 * ```ts
 * import { prepareExportTxn } from "@avalanche-sdk/client/methods/wallet/cChain/prepareExportTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const cChainExportTxnRequest = await prepareExportTxn(walletClient, {
 *   destinationChain: "P",
 *   fromAddress: "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
 *   exportedOutput: {
 *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *     amount: 0.0001,
 *   },
 * });
 *
 * console.log(cChainExportTxnRequest);
 * ```
 */
export async function prepareExportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareExportTxnParameters
): Promise<PrepareExportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const [txCount, baseFeeInWei] = await Promise.all([
    getTransactionCount(client, {
      address: `0x${utils.strip0x(params.fromAddress)}`,
    }),
    getBaseFee(client),
  ]);
  const pAddressBytes = params.exportedOutput.addresses.map((address) =>
    bech32AddressToBytes(address)
  );

  let baseFeeInNanoAvax = weiToNanoAvax(BigInt(baseFeeInWei));
  if (baseFeeInNanoAvax === 0n) {
    baseFeeInNanoAvax = 1n;
  }

  const unsignedTx = evm.newExportTxFromBaseFee(
    context,
    baseFeeInNanoAvax,
    avaxToNanoAvax(params.exportedOutput.amount),
    getChainIdFromAlias(params.destinationChain, context.networkID),
    utils.hexToBuffer(params.fromAddress),
    pAddressBytes,
    BigInt(txCount)
  );

  return {
    tx: unsignedTx,
    exportTx: unsignedTx.getTx() as evmSerial.ExportTx,
    chainAlias: "C",
  };
}
