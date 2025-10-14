import { evmSerial, utils } from "@avalabs/avalanchejs";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { getUtxosForAddress } from "../../../utils/getUtxosForAddress.js";
import { C_CHAIN_ALIAS } from "../../consts.js";
import { baseFee as getBaseFee } from "../../public/index.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  addOrModifyXPAddressesAlias,
  bech32AddressToBytes,
  getBech32AddressFromAccountOrClient,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "./types/prepareImportTxn.js";
import { newImportTxFromBaseFee } from "./utils.js";

/**
 * Prepares an import transaction for the C-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareImportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareImportTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/c-chain/txn-format#importtx
 *
 * @example
 * ```ts
 * import { prepareImportTxn } from "@avalanche-sdk/client/methods/wallet/cChain/prepareImportTxn";
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
 * const cChainImportTxnRequest = await prepareImportTxn(walletClient, {
 *   sourceChain: "P",
 *   toAddress: "0x1234567890123456789012345678901234567890",
 * });
 *
 * console.log(cChainImportTxnRequest);
 * ```
 */
export async function prepareImportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareImportTxnParameters
): Promise<PrepareImportTxnReturnType> {
  const { account } = params;
  const context = params.context || (await getContextFromURI(client));
  const baseFeeInWei = await getBaseFee(client);

  const fromAddresses =
    addOrModifyXPAddressesAlias(params.fromAddresses, C_CHAIN_ALIAS) || [];
  if (fromAddresses.length === 0) {
    const paramAc = parseAvalancheAccount(account);
    const address = await getBech32AddressFromAccountOrClient(
      client,
      paramAc,
      C_CHAIN_ALIAS,
      context.hrp
    );
    fromAddresses.push(address);
  }

  const fromAddressesBytes = fromAddresses.map((address) =>
    bech32AddressToBytes(address)
  );

  let utxos = params.utxos || [];
  if (!utxos.length) {
    utxos = (
      await Promise.all(
        fromAddresses.map(
          async (address) =>
            await getUtxosForAddress(client, {
              address,
              chainAlias: "C",
              sourceChain: getChainIdFromAlias(
                params.sourceChain,
                context.networkID
              ),
            })
        )
      )
    ).flat();
  }
  const unsignedTx = newImportTxFromBaseFee(
    context,
    utils.hexToBuffer(params.toAddress),
    fromAddressesBytes,
    utxos,
    getChainIdFromAlias(params.sourceChain, context.networkID),
    BigInt(baseFeeInWei)
  );

  return {
    tx: unsignedTx,
    importTx: unsignedTx.getTx() as evmSerial.ImportTx,
    chainAlias: C_CHAIN_ALIAS,
  };
}
