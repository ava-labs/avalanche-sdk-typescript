import { Common, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha2";
import { NewTxParams } from "../types/common";
import { Transaction } from "../types/transactions";

export function createNewTransaction<TTx = Common.Transaction>(
  params: NewTxParams
): Transaction<TTx> {
  return {
    unsignedTx: params.unsignedTx,
    tx: params.unsignedTx.getTx() as TTx,
  };
}

export function transactionToBytes<TTx = Common.Transaction>(
  tx: Transaction<TTx>,
  signed = false
) {
  return signed
    ? utils.addChecksum(tx.unsignedTx.getSignedTx().toBytes())
    : tx.unsignedTx.toBytes();
}

export function transactionToHex<TTx = Common.Transaction>(
  tx: Transaction<TTx>,
  signed = false
) {
  return utils.bufferToHex(transactionToBytes(tx, signed));
}

export function transactionId<TTx = Common.Transaction>(
  tx: Transaction<TTx>,
  signed = false
) {
  if (!tx.unsignedTx.hasAllSignatures()) {
    throw new Error(
      "Transaction is not completely signed. Cannot generate transaction id"
    );
  }
  const txBuffer = transactionToBytes(tx, signed);
  return utils.base58check.encode(
    sha256(txBuffer.subarray(0, txBuffer.length - 4))
  );
}
