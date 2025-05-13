import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../utils/common.js";
import { Bytes } from "../primitives/bytes.js";
import { Int } from "../primitives/int.js";
import { Short } from "../primitives/short.js";
import { PChainTransferableOutput } from "../transactions/pChain/output/transferableOutput.js";
import { TypeSchema } from "../transactions/typeSchema.js";

export const UTXOSchema: TypeSchema = [
  {
    key: "codecId",
    type: Short,
    length: 2,
  },
  {
    key: "txId",
    type: Bytes,
    length: 32,
  },
  {
    key: "UTXOIndex",
    type: Int,
    length: 4,
  },
  {
    key: "output",
    type: PChainTransferableOutput,
  },
] as const;

export type UTXO = {
  value: () => {
    codecId: Int;
    txId: Bytes;
    UTXOIndex: Int;
    output: PChainTransferableOutput;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    codecId: Int;
    txId: Bytes;
    UTXOIndex: Int;
    output: PChainTransferableOutput;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const UTXO = (json: {
  codecId?: number | Int;
  txId: string | Bytes;
  UTXOIndex: number | Int;
  output: PChainTransferableOutput;
}): UTXO => {
  const codecId = !json.codecId
    ? Int(0)
    : typeof json.codecId === "number"
    ? Int(json.codecId)
    : json.codecId;
  const txId =
    typeof json.txId === "string" ? Bytes(hexToBuffer(json.txId)) : json.txId;
  const UTXOIndex =
    typeof json.UTXOIndex === "number" ? Int(json.UTXOIndex) : json.UTXOIndex;
  const output = json.output;

  return {
    value: () => ({
      codecId,
      txId,
      UTXOIndex: UTXOIndex,
      output,
    }),

    toBytes: () => {
      return concatBytes(
        codecId.toBytes(),
        txId.toBytes(),
        UTXOIndex.toBytes(),
        output.toBytes()
      );
    },

    toJSON: () => {
      return {
        codecId: codecId.toJSON(),
        txId: txId.toJSON(),
        UTXOIndex: UTXOIndex.toJSON(),
        output: output.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        codecId: codecId.toString(),
        txId: txId.toString(),
        UTXOIndex: UTXOIndex.toString(),
        output: output.toString(),
      });
    },

    valueOf: () => ({
      codecId,
      txId,
      UTXOIndex,
      output,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

UTXO.fromBytes = (buf: Uint8Array): [UTXO, Uint8Array] => {
  const json: Record<string, any> = {};
  let currBuf = buf.slice();

  for (const { key, type, length } of UTXOSchema) {
    const [value, rest] = type.fromBytes(currBuf, length);
    json[key] = value;
    currBuf = rest;
  }

  return [UTXO(json as any), currBuf];
};
