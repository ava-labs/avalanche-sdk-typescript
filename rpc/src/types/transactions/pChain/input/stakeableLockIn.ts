import { concatBytes } from "@noble/hashes/utils";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Int } from "../../../primitives/int.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { TypeSchema } from "../../typeSchema.js";
import { PChainTransferableInput } from "./transferableInput.js";

export const PChainStakeableLockInSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "locktime", type: BigIntPr },
  { key: "transferableIn", type: PChainTransferableInput },
] as const;

export type PChainStakeableLockIn = {
  _type: PChainTransactionTypeSymbols.StakeableLockIn;
  value: () => {
    typeId: Int;
    locktime: BigIntPr;
    transferableIn: PChainTransferableInput;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    locktime: BigIntPr;
    transferableIn: PChainTransferableInput;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainStakeableLockIn = (json: {
  typeId?: number | Int | undefined;
  locktime: number | bigint | BigIntPr;
  transferableIn: PChainTransferableInput;
}): PChainStakeableLockIn => {
  const typeId = !json.typeId
    ? Int(21)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const locktime =
    typeof json.locktime === "number" || typeof json.locktime === "bigint"
      ? BigIntPr(json.locktime)
      : json.locktime;

  return {
    _type: PChainTransactionTypeSymbols.StakeableLockIn,
    value: () => ({
      typeId,
      locktime,
      transferableIn: json.transferableIn,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        locktime.toBytes(),
        json.transferableIn.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        locktime: locktime.toJSON(),
        transferableIn: json.transferableIn.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        locktime: locktime.toString(),
        transferableIn: json.transferableIn.toString(),
      });
    },

    valueOf: () => ({
      typeId,
      locktime,
      transferableIn: json.transferableIn,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainStakeableLockIn.fromBytes = (
  buf: Uint8Array
): [PChainStakeableLockIn, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type } of PChainStakeableLockInSchema) {
    const [value, rest] = type.fromBytes(currBuf);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }

  return [PChainStakeableLockIn(json as any), currBuf];
};

PChainStakeableLockIn.typeId = "21";
