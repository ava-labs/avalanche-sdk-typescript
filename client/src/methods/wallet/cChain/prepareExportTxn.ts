import { evm, utils } from "@avalabs/avalanchejs";
import { getTransactionCount } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { baseFee as getBaseFee } from "../../public/index.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  avaxToNanoAvax,
  bech32AddressToBytes,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "./types/prepareExportTxn.js";

export async function prepareExportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareExportTxnParameters
): Promise<PrepareExportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const [txCount, baseFee] = await Promise.all([
    getTransactionCount(client, {
      address: `0x${utils.strip0x(params.fromAddress)}`,
    }),
    getBaseFee(client),
  ]);
  const pAddressBytes = params.exportedOutput.addresses.map((address) =>
    bech32AddressToBytes(address)
  );

  const unsignedTx = evm.newExportTxFromBaseFee(
    context,
    BigInt(baseFee),
    avaxToNanoAvax(params.exportedOutput.amountInAvax),
    getChainIdFromAlias(params.destinationChain, context.networkID),
    utils.hexToBuffer(params.fromAddress),
    pAddressBytes,
    BigInt(txCount)
  );

  return {
    tx: unsignedTx,
    chainAlias: "C",
  };
}
