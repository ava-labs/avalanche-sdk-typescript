import { Context as ContextType, evm, utils, Utxo } from "@avalabs/avalanchejs";
import { weiToNanoAvax } from "../utils";

export function estimateImportCost(
  context: ContextType.Context,
  toAddress: Uint8Array,
  fromAddressesBytes: Uint8Array[],
  atomics: Utxo[],
  sourceChain: string,
  baseFee = 0n,
  feeAssetId?: string,
) {
  const dummyImportTx = evm.newImportTx(
    context,
    toAddress,
    fromAddressesBytes,
    atomics,
    sourceChain,
    baseFee,
    feeAssetId,
  );

  const importCost = utils.costCorethTx(dummyImportTx);
  return baseFee * importCost;
}

export function newImportTxFromBaseFee(
  context: ContextType.Context,
  toAddress: Uint8Array,
  fromAddressesBytes: Uint8Array[],
  atomics: Utxo[],
  sourceChain: string,
  baseFee = 0n,
) {
  const feeInWei = estimateImportCost(
    context,
    toAddress,
    fromAddressesBytes,
    atomics,
    sourceChain,
    baseFee,
  );
  let feeInNanoAvax = weiToNanoAvax(feeInWei);
  if (feeInNanoAvax === 0n) {
    feeInNanoAvax = 1n;
  }

  return evm.newImportTx(
    context,
    toAddress,
    fromAddressesBytes,
    atomics,
    sourceChain,
    feeInNanoAvax,
  );
}

export function newExportTxFromBaseFee(
  context: ContextType.Context,
  baseFee: bigint,
  amount: bigint,
  destinationChain: string,
  fromAddress: Uint8Array,
  toAddresses: Uint8Array[],
  nonce: bigint,
) {
  const feeInWei = evm.estimateExportCost(
    context,
    baseFee,
    amount,
    destinationChain,
    fromAddress,
    toAddresses,
    nonce,
  );
  let feeInNanoAvax = weiToNanoAvax(feeInWei);
  if (feeInNanoAvax === 0n) {
    feeInNanoAvax = 1n;
  }

  return evm.newExportTx(
    context,
    amount,
    destinationChain,
    fromAddress,
    toAddresses,
    feeInNanoAvax,
    nonce,
  );
}
