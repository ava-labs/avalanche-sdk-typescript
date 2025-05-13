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

export const PChainRemoveL1ValidatorTxSchema: TypeSchema = [
  {
    key: "typeId",
    type: Int,
  },
  {
    key: "baseTx",
    type: PChainBaseTx,
  },
  {
    key: "nodeId",
    type: Bytes,
    length: 20,
  },
  {
    key: "subnetId",
    type: Bytes,
    length: 32,
  },
  {
    key: "subnetAuth",
    type: Int,
    isArray: true,
    elemByteLen: 4,
  },
] as const;

export type PChainRemoveL1ValidatorTx = {
  _type: PChainTransactionTypeSymbols.RemoveL1ValidatorTx;
  value: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    nodeId: Bytes;
    subnetId: Bytes;
    subnetAuth: Int[];
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    nodeId: Bytes;
    subnetId: Bytes;
    subnetAuth: Int[];
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainRemoveL1ValidatorTx = (json: {
  typeId?: number | Int | undefined;
  baseTx: PChainBaseTx;
  nodeId: string | Bytes;
  subnetId: string | Bytes;
  subnetAuth: Int[];
}): PChainRemoveL1ValidatorTx => {
  const typeId = !json.typeId
    ? Int(23)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const nodeId =
    typeof json.nodeId === "string"
      ? Bytes(hexToBuffer(json.nodeId))
      : json.nodeId;
  const subnetId =
    typeof json.subnetId === "string"
      ? Bytes(hexToBuffer(json.subnetId))
      : json.subnetId;
  const subnetAuth = json.subnetAuth;

  return {
    _type: PChainTransactionTypeSymbols.RemoveL1ValidatorTx,
    value: () => ({
      typeId,
      baseTx: json.baseTx,
      nodeId,
      subnetId,
      subnetAuth,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        removeTypeIdFromBytes(json.baseTx.toBytes()),
        nodeId.toBytes(),
        subnetId.toBytes(),
        concatBytes(
          Int(10).toBytes(), // SubnetAuth TypeID
          Int(subnetAuth.length).toBytes(),
          ...subnetAuth.map((e) => e.toBytes())
        )
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        baseTx: json.baseTx.toJSON(),
        nodeId: nodeId.toJSON(),
        subnetId: subnetId.toJSON(),
        subnetAuth: subnetAuth.map((e) => e.toJSON()),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        baseTx: json.baseTx.toString(),
        nodeId: nodeId.toString(),
        subnetId: subnetId.toString(),
        subnetAuth: subnetAuth.map((e) => e.toString()),
      });
    },

    valueOf: () => ({
      typeId,
      baseTx: json.baseTx,
      nodeId,
      subnetId,
      subnetAuth,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainRemoveL1ValidatorTx.fromBytes = (
  buf: Uint8Array
): [PChainRemoveL1ValidatorTx, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, length } of PChainRemoveL1ValidatorTxSchema) {
    if (key === "baseTx") {
      currBuf = addTypeIdToBytes(currBuf, 0).slice();
    }
    if (key === "subnetAuth") {
      currBuf = currBuf.slice(4);
      const [value, rest] = parseTypedArraySchema(currBuf, Int);
      json[key] = value;
      currBuf = rest;
    } else {
      const [value, rest] = type.fromBytes(currBuf, length);
      json[key] = value;
      currBuf = rest;
    }
  }

  return [PChainRemoveL1ValidatorTx(json as any), currBuf];
};

PChainRemoveL1ValidatorTx.typeId = "23";
