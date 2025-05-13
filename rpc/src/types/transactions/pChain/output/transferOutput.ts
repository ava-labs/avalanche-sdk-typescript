import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common.js";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Int } from "../../../primitives/int.js";
import { VariableLengthArray } from "../../../primitives/variablelengtharray.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { type TypeSchema } from "../../typeSchema.js";

export const PChainTransferOutputSchema: TypeSchema = [
  {
    key: "typeId",
    type: Int,
  },
  {
    key: "amount",
    type: BigIntPr,
  },
  {
    key: "locktime",
    type: BigIntPr,
  },
  {
    key: "threshold",
    type: Int,
  },
  {
    key: "addresses",
    type: VariableLengthArray,
    elemByteLen: 20,
  },
] as const;

export type PChainTransferOutput = {
  _type: PChainTransactionTypeSymbols.TransferOutput;
  value: () => {
    typeId: Int;
    amount: BigIntPr;
    locktime: BigIntPr;
    threshold: Int;
    // Length of each address is 20 bytes
    addresses: VariableLengthArray;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    amount: BigIntPr;
    locktime: BigIntPr;
    threshold: Int;
    // Length of each address is 20 bytes
    addresses: VariableLengthArray;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainTransferOutput = (json: {
  typeId?: number | Int | undefined;
  amount: number | BigIntPr;
  locktime: number | BigIntPr;
  threshold: number | Int;
  addresses: string[] | VariableLengthArray;
}): PChainTransferOutput => {
  const typeId = !json.typeId
    ? Int(7)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const amount =
    typeof json.amount === "number" ? BigIntPr(json.amount) : json.amount;
  const locktime =
    typeof json.locktime === "number" ? BigIntPr(json.locktime) : json.locktime;
  const threshold =
    typeof json.threshold === "number" ? Int(json.threshold) : json.threshold;
  const addresses = !Array.isArray(json.addresses)
    ? (json.addresses as VariableLengthArray)
    : VariableLengthArray((json.addresses as string[]).map(hexToBuffer));

  return {
    _type: PChainTransactionTypeSymbols.TransferOutput,

    value: () => ({
      typeId,
      amount,
      locktime,
      threshold,
      addresses,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        amount.toBytes(),
        locktime.toBytes(),
        threshold.toBytes(),
        addresses.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        amount: amount.toJSON(),
        locktime: locktime.toJSON(),
        threshold: threshold.toJSON(),
        addresses: addresses.toJSON(),
      };
    },

    toString: () => {
      const val = {
        typeId: typeId.toString(),
        amount: amount.toString(),
        locktime: locktime.toString(),
        threshold: threshold.toString(),
        addresses: addresses.toString(),
      };
      return JSON.stringify(val);
    },

    valueOf: () => {
      return {
        typeId,
        amount,
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

PChainTransferOutput.fromBytes = (
  buf: Uint8Array
): [PChainTransferOutput, Uint8Array] => {
  let currBuf = buf.slice();
  let json: {
    typeId?: Int;
    amount?: BigIntPr;
    locktime?: BigIntPr;
    threshold?: Int;
    addresses?: VariableLengthArray;
  } = {};

  for (const { key, type, elemByteLen } of PChainTransferOutputSchema) {
    const [value, rest] =
      key === "addresses"
        ? type.fromBytes(currBuf, elemByteLen)
        : type.fromBytes(currBuf);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }
  return [PChainTransferOutput(json as any) as any, currBuf];
};

PChainTransferOutput.typeId = "7";
