import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Int } from "../../../primitives/int.js";
import { VariableLengthArray } from "../../../primitives/variablelengtharray.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { TypeSchema } from "../../typeSchema.js";

export const PChainOutputOwnersSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "locktime", type: BigIntPr },
  { key: "threshold", type: Int },
  { key: "addresses", type: VariableLengthArray, elemByteLen: 20 },
];

export type PChainOutputOwners = {
  _type: PChainTransactionTypeSymbols.OutputOwners;
  value: () => {
    typeId: Int;
    locktime: BigIntPr;
    threshold: Int;
    addresses: VariableLengthArray;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    locktime: BigIntPr;
    threshold: Int;
    addresses: VariableLengthArray;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainOutputOwners = (json: {
  typeId?: number | Int | undefined;
  locktime: number | BigIntPr;
  threshold: number | Int;
  addresses: string[] | VariableLengthArray;
}) => {
  const typeId = !json.typeId
    ? Int(11)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const locktime =
    typeof json.locktime === "number" ? BigIntPr(json.locktime) : json.locktime;
  const threshold =
    typeof json.threshold === "number" ? Int(json.threshold) : json.threshold;
  const addresses = !Array.isArray(json.addresses)
    ? (json.addresses as VariableLengthArray)
    : VariableLengthArray((json.addresses as string[]).map(hexToBuffer));

  return {
    _type: PChainTransactionTypeSymbols.OutputOwners,

    value: () => ({
      typeId,
      locktime,
      threshold,
      addresses,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        locktime.toBytes(),
        threshold.toBytes(),
        addresses.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        locktime: locktime.toJSON(),
        threshold: threshold.toJSON(),
        addresses: addresses.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        locktime: locktime.toString(),
        threshold: threshold.toString(),
        addresses: addresses.toString(),
      });
    },

    valueOf: () => {
      return {
        typeId,
        locktime,
        threshold,
        addresses,
      };
    },

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainOutputOwners.fromBytes = (
  buf: Uint8Array
): [PChainOutputOwners, Uint8Array] => {
  let currBuf = buf.slice();
  let json: {
    typeId?: Int;
    locktime?: BigIntPr;
    threshold?: Int;
    addresses?: VariableLengthArray;
  } = {};

  for (const { key, type, elemByteLen } of PChainOutputOwnersSchema) {
    const [value, rest] =
      key === "addresses"
        ? type.fromBytes(currBuf, elemByteLen)
        : type.fromBytes(currBuf);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }
  return [PChainOutputOwners(json as any) as any, currBuf];
};

PChainOutputOwners.typeId = "11";
