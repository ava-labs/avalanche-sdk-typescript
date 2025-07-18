import { evm, utils } from "@avalabs/avalanchejs";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { getUtxosForAddress } from "../../../utils/getUtxosForAddress.js";
import { C_CHAIN_ALIAS } from "../../consts.js";
import { baseFee as getBaseFee } from "../../public/index.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  bech32AddressToBytes,
  getBech32AddressFromAccountOrClient,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "./types/prepareImportTxn.js";

export async function prepareImportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareImportTxnParameters
): Promise<PrepareImportTxnReturnType> {
  const { account } = params;
  const context = params.context || (await getContextFromURI(client));
  const baseFee = await getBaseFee(client);

  const fromAddresses = params.fromAddresses || [];

  if (fromAddresses.length === 0) {
    const paramAc = parseAvalancheAccount(account);
    const address = getBech32AddressFromAccountOrClient(
      client,
      paramAc,
      C_CHAIN_ALIAS,
      context.hrp
    );
    fromAddresses.push(address);
  }
  console.log("fromAddresses", fromAddresses);
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
  console.log("utxos", utxos);
  const unsignedTx = evm.newImportTxFromBaseFee(
    context,
    utils.hexToBuffer(params.toAddress),
    fromAddressesBytes,
    utxos,
    params.sourceChain,
    BigInt(baseFee)
  );

  return {
    tx: unsignedTx,
    chainAlias: C_CHAIN_ALIAS,
  };
}
