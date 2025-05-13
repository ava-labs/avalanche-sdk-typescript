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
import { PChainTransferableOutput } from "./output/transferableOutput.js";

export const PChainExportTxSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "baseTx", type: PChainBaseTx },
  { key: "destinationChain", type: Bytes, length: 32 },
  { key: "outs", type: PChainTransferableOutput, isArray: true },
] as const;

export type PChainExportTx = {
  _type: PChainTransactionTypeSymbols.ExportTx;
  value: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    destinationChain: Bytes;
    outs: PChainTransferableOutput[];
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    destinationChain: Bytes;
    outs: PChainTransferableOutput[];
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainExportTx = (json: {
  typeId?: number | Int;
  baseTx: PChainBaseTx;
  destinationChain: string | Bytes;
  outs: PChainTransferableOutput[];
}): PChainExportTx => {
  const typeId = !json.typeId
    ? Int(18)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const destinationChain =
    typeof json.destinationChain === "string"
      ? Bytes(hexToBuffer(json.destinationChain))
      : json.destinationChain;

  return {
    _type: PChainTransactionTypeSymbols.ExportTx,
    value: () => ({
      typeId,
      baseTx: json.baseTx,
      destinationChain,
      outs: json.outs,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        removeTypeIdFromBytes(json.baseTx.toBytes()),
        destinationChain.toBytes(),
        concatBytes(
          Int(json.outs.length).toBytes(),
          ...json.outs.map((e) => e.toBytes())
        )
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        baseTx: json.baseTx.toJSON(),
        destinationChain: destinationChain.toJSON(),
        outs: json.outs.map((e) => e.toJSON()),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        baseTx: json.baseTx.toString(),
        destinationChain: destinationChain.toString(),
        outs: json.outs.map((e) => e.toString()),
      });
    },

    valueOf: () => ({
      typeId,
      baseTx: json.baseTx,
      destinationChain,
      outs: json.outs,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainExportTx.fromBytes = (buf: Uint8Array): [PChainExportTx, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, length, isArray } of PChainExportTxSchema) {
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

  return [PChainExportTx(json as any), currBuf];
};

PChainExportTx.typeId = "18";
