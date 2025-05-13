import { concatBytes } from "@noble/hashes/utils";
import {
  addTypeIdToBytes,
  hexToBuffer,
  removeTypeIdFromBytes,
} from "../../../utils/common.js";
import { Bytes } from "../../primitives/bytes.js";
import { Int } from "../../primitives/int.js";
import { PChainTransactionTypeSymbols } from "../../typeSymbols.js";
import { parseTypedArraySchema } from "../parseTypedSchema.js";
import { TypeSchema } from "../typeSchema.js";
import { PChainBaseTx } from "./baseTx.js";
import { PChainTransferableInput } from "./input/transferableInput.js";

export const PChainImportTxSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "baseTx", type: PChainBaseTx },
  { key: "sourceChain", type: Bytes, length: 32 },
  { key: "ins", type: PChainTransferableInput, isArray: true },
] as const;

export type PChainImportTx = {
  _type: PChainTransactionTypeSymbols.ImportTx;
  value: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    sourceChain: Bytes;
    ins: PChainTransferableInput[];
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    sourceChain: Bytes;
    ins: PChainTransferableInput[];
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainImportTx = (json: {
  typeId?: number | Int;
  baseTx: PChainBaseTx;
  sourceChain: string | Bytes;
  ins: PChainTransferableInput[];
}): PChainImportTx => {
  const typeId = !json.typeId
    ? Int(17)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const sourceChain =
    typeof json.sourceChain === "string"
      ? Bytes(hexToBuffer(json.sourceChain))
      : json.sourceChain;

  return {
    _type: PChainTransactionTypeSymbols.ImportTx,
    value: () => ({
      typeId,
      baseTx: json.baseTx,
      sourceChain,
      ins: json.ins,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        removeTypeIdFromBytes(json.baseTx.toBytes()),
        sourceChain.toBytes(),
        concatBytes(
          Int(json.ins.length).toBytes(),
          ...json.ins.map((e) => e.toBytes())
        )
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        baseTx: json.baseTx.toJSON(),
        sourceChain: sourceChain.toJSON(),
        ins: json.ins.map((e) => e.toJSON()),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        baseTx: json.baseTx.toString(),
        sourceChain: sourceChain.toString(),
        ins: json.ins.map((e) => e.toString()),
      });
    },

    valueOf: () => ({
      typeId,
      baseTx: json.baseTx,
      sourceChain,
      ins: json.ins,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainImportTx.fromBytes = (buf: Uint8Array): [PChainImportTx, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, length, isArray } of PChainImportTxSchema) {
    if (isArray) {
      const [value, rest] = parseTypedArraySchema(currBuf, type);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    } else {
      if (key === "baseTx") {
        currBuf = addTypeIdToBytes(currBuf, 0).slice();
      }
      const [value, rest] = type.fromBytes(currBuf, length);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    }
  }

  return [PChainImportTx(json as any), currBuf];
};

PChainImportTx.typeId = "17";
