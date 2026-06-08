import { pvmSerial } from "@avalabs/avalanchejs";

type AddAutoRenewedValidatorTx = pvmSerial.AddAutoRenewedValidatorTx;
type AddAutoRenewedValidatorCodec = Parameters<
  AddAutoRenewedValidatorTx["toBytes"]
>[0];

const NODE_ID_BYTE_LENGTH = 20;
const NODE_ID_LENGTH_PREFIX = new Uint8Array([0, 0, 0, NODE_ID_BYTE_LENGTH]);
const UINT32_BYTE_LENGTH = 4;
const UINT64_BYTE_LENGTH = 8;
const WEIGHT_TAIL_OFFSET =
  UINT64_BYTE_LENGTH + UINT32_BYTE_LENGTH + UINT64_BYTE_LENGTH;

const patchedAddAutoRenewedValidatorTxs =
  new WeakSet<AddAutoRenewedValidatorTx>();

const bytesEqual = (left: Uint8Array, right: Uint8Array) =>
  left.length === right.length && left.every((byte, i) => byte === right[i]);

const insertNodeIDLengthPrefix = (
  bytes: Uint8Array,
  baseTxLength: number
) => {
  if (
    bytesEqual(
      bytes.slice(baseTxLength, baseTxLength + UINT32_BYTE_LENGTH),
      NODE_ID_LENGTH_PREFIX
    )
  ) {
    return bytes;
  }

  const prefixed = new Uint8Array(bytes.length + UINT32_BYTE_LENGTH);
  prefixed.set(bytes.slice(0, baseTxLength), 0);
  prefixed.set(NODE_ID_LENGTH_PREFIX, baseTxLength);
  prefixed.set(bytes.slice(baseTxLength), baseTxLength + UINT32_BYTE_LENGTH);
  return prefixed;
};

const removeSerializedWeight = (
  tx: AddAutoRenewedValidatorTx,
  bytes: Uint8Array
) => {
  const weightStart = bytes.length - WEIGHT_TAIL_OFFSET;
  if (weightStart < 0) {
    return bytes;
  }

  const weightBytes = tx.weight.toBytes();
  if (
    !bytesEqual(
      bytes.slice(weightStart, weightStart + UINT64_BYTE_LENGTH),
      weightBytes
    )
  ) {
    return bytes;
  }

  const withoutWeight = new Uint8Array(bytes.length - UINT64_BYTE_LENGTH);
  withoutWeight.set(bytes.slice(0, weightStart), 0);
  withoutWeight.set(
    bytes.slice(weightStart + UINT64_BYTE_LENGTH),
    weightStart
  );
  return withoutWeight;
};

export function useAvalancheGoAddAutoRenewedValidatorTxSerialization(
  tx: AddAutoRenewedValidatorTx
) {
  if (patchedAddAutoRenewedValidatorTxs.has(tx)) {
    return;
  }

  const avalancheJSToBytes = tx.toBytes.bind(tx);
  tx.toBytes = (codec: AddAutoRenewedValidatorCodec) => {
    const baseTxLength = tx.baseTx.toBytes(codec).length;
    const nodeIDPrefixed = insertNodeIDLengthPrefix(
      avalancheJSToBytes(codec),
      baseTxLength
    );
    return removeSerializedWeight(tx, nodeIDPrefixed);
  };

  patchedAddAutoRenewedValidatorTxs.add(tx);
}
