import { concatBytes } from "@noble/hashes/utils";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Int } from "../../../primitives/int.js";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols.js";
import { TypeSchema } from "../../typeSchema.js";
import { PChainTransferableOutput } from "./transferableOutput.js";

export const PChainStakeableLockOutSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "locktime", type: BigIntPr },
  { key: "transferableOut", type: PChainTransferableOutput },
] as const;

export type PChainStakeableLockOut = {
  _type: PChainTransactionTypeSymbols.StakeableLockOut;
  value: () => {
    typeId: Int;
    locktime: BigIntPr;
    transferableOut: PChainTransferableOutput;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    locktime: BigIntPr;
    transferableOut: PChainTransferableOutput;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainStakeableLockOut = (json: {
  typeId?: number | Int | undefined;
  locktime: number | bigint | BigIntPr;
  transferableOut: PChainTransferableOutput;
}): PChainStakeableLockOut => {
  const typeId = !json.typeId
    ? Int(22)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const locktime =
    typeof json.locktime === "number" || typeof json.locktime === "bigint"
      ? BigIntPr(json.locktime)
      : json.locktime;

  return {
    _type: PChainTransactionTypeSymbols.StakeableLockOut,
    value: () => ({
      typeId,
      locktime,
      transferableOut: json.transferableOut,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        locktime.toBytes(),
        json.transferableOut.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        locktime: locktime.toJSON(),
        transferableOut: json.transferableOut.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        locktime: locktime.toString(),
        transferableOut: json.transferableOut.toString(),
      });
    },

    valueOf: () => ({
      typeId,
      locktime,
      transferableOut: json.transferableOut,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainStakeableLockOut.fromBytes = (
  buf: Uint8Array
): [PChainStakeableLockOut, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type } of PChainStakeableLockOutSchema) {
    const [value, rest] = type.fromBytes(currBuf);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }

  return [PChainStakeableLockOut(json as any), currBuf];
};

PChainStakeableLockOut.typeId = "22";
