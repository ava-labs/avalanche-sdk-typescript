import { concatBytes } from "@noble/hashes/utils";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Int } from "../../../primitives/int.js";
import { VariableLengthArray } from "../../../primitives/variablelengtharray.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { TypeSchema } from "../../typeSchema.js";
export const PChainTransferInputSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "amount", type: BigIntPr },
  { key: "signatureIndices", type: VariableLengthArray, elemByteLen: 4 },
] as const;

export type PChainTransferInput = {
  _type: PChainTransactionTypeSymbols.TransferInput;
  value: () => {
    typeId: Int;
    amount: BigIntPr;
    signatureIndices: VariableLengthArray;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    amount: BigIntPr;
    signatureIndices: VariableLengthArray;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainTransferInput = (json: {
  typeId?: number | Int | undefined;
  amount: number | BigIntPr;
  signatureIndices: number[] | VariableLengthArray;
}) => {
  const typeId = !json.typeId
    ? Int(5)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const amount =
    typeof json.amount === "number" ? BigIntPr(json.amount) : json.amount;
  const signatureIndices = !Array.isArray(json.signatureIndices)
    ? (json.signatureIndices as VariableLengthArray)
    : VariableLengthArray(json.signatureIndices.map((x) => Int(x).toBytes()));

  return {
    _type: PChainTransactionTypeSymbols.TransferInput,
    value: () => ({
      typeId,
      amount,
      signatureIndices,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        amount.toBytes(),
        signatureIndices.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        amount: amount.toJSON(),
        signatureIndices: signatureIndices.value().map((e: Uint8Array) => {
          const [int] = Int.fromBytes(e);
          return int.valueOf();
        }),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        amount: amount.toString(),
        signatureIndices: signatureIndices.toString(),
      });
    },

    valueOf: () => {
      return {
        typeId,
        amount,
        signatureIndices,
      };
    },

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainTransferInput.fromBytes = (
  buf: Uint8Array
): [PChainTransferInput, Uint8Array] => {
  let currBuf = buf.slice();
  let json: {
    typeId?: Int;
    amount?: BigIntPr;
    signatureIndices?: VariableLengthArray;
  } = {};

  for (const { key, type, elemByteLen } of PChainTransferInputSchema) {
    const [value, rest] =
      key === "signatureIndices"
        ? type.fromBytes(currBuf, elemByteLen)
        : type.fromBytes(currBuf);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }
  return [PChainTransferInput(json as any) as any, currBuf];
};

PChainTransferInput.typeId = "5";
