import { Context, evm, utils } from "@avalabs/avalanchejs";
import { getTransactionCount } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { baseFee as getBaseFee } from "../../public/index.js";
import {
  avaxToNanoAvax,
  bech32AddressToBytes,
  getBaseUrl,
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
  const baseUrl = getBaseUrl(client);

  const context = params.context || (await Context.getContextFromURI(baseUrl));
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
