import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common.js";
import { Bytes } from "../../../primitives/bytes.js";
import { Int } from "../../../primitives/int.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { TypeSchema } from "../../typeSchema.js";
import { PChainTransferInput } from "./transferInput.js";

export const PChainTransferableInputSchema: TypeSchema = [
  { key: "txId", type: Bytes, length: 32 },
  { key: "utxoIndex", type: Int },
  { key: "assetId", type: Bytes, length: 32 },
  { key: "input", type: PChainTransferInput },
] as const;

export type PChainTransferableInput = {
  _type: PChainTransactionTypeSymbols.TransferableInput;
  value: () => {
    txId: Bytes;
    utxoIndex: Int;
    assetId: Bytes;
    input: PChainTransferInput;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    txId: Bytes;
    utxoIndex: Int;
    assetId: Bytes;
    input: PChainTransferInput;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainTransferableInput = (json: {
  txId: string | Bytes;
  utxoIndex: number | Int;
  assetId: string | Bytes;
  input: PChainTransferInput;
}) => {
  const txId =
    typeof json.txId === "string" ? Bytes(hexToBuffer(json.txId)) : json.txId;
  const utxoIndex =
    typeof json.utxoIndex === "number" ? Int(json.utxoIndex) : json.utxoIndex;
  const assetId =
    typeof json.assetId === "string"
      ? Bytes(hexToBuffer(json.assetId))
      : json.assetId;

  return {
    _type: PChainTransactionTypeSymbols.TransferableInput,
    value: () => ({
      txId,
      utxoIndex,
      assetId,
      input: json.input,
    }),

    toBytes: () => {
      return concatBytes(
        txId.toBytes(),
        utxoIndex.toBytes(),
        assetId.toBytes(),
        json.input.toBytes()
      );
    },

    toJSON: () => {
      return {
        txId: txId.toJSON(),
        utxoIndex: utxoIndex.toJSON(),
        assetId: assetId.toJSON(),
        input: json.input.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        txId: txId.toString(),
        utxoIndex: utxoIndex.toString(),
        assetId: assetId.toString(),
        input: json.input.toString(),
      });
    },

    valueOf: () => {
      return {
        txId,
        utxoIndex,
        assetId,
        input: json.input,
      };
    },

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainTransferableInput.fromBytes = (
  buf: Uint8Array
): [PChainTransferableInput, Uint8Array] => {
  let currBuf = buf.slice();
  let json: {
    txId?: Bytes;
    utxoIndex?: Int;
    assetId?: Bytes;
    input?: PChainTransferInput;
  } = {};

  for (const { key, type, length } of PChainTransferableInputSchema) {
    const [value, rest] = type.fromBytes(currBuf, length);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }
  return [PChainTransferableInput(json as any) as any, currBuf];
};
