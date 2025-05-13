import { bufferToBigInt, hexToBuffer, padLeft } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";

const BIGINT_LEN = 8;

export type BigIntPr = {
  _type: TypeSymbols.BigIntPr;
  value: () => bigint;
  toBytes: () => Uint8Array;
  toJSON: () => bigint;
  toString: () => string;
  valueOf: () => bigint;
  [Symbol.toPrimitive](hint: string): string | bigint;
};

export const BigIntPr = (
  input: bigint | string | number | BigIntPr
): BigIntPr => {
  const val =
    typeof input === "string" ? BigInt(input) : BigInt(input.valueOf());

  return {
    _type: TypeSymbols.BigIntPr,

    value: () => val,

    toBytes: () => padLeft(hexToBuffer(val.toString(16)), BIGINT_LEN),

    toJSON: () => val,

    toString: () => val.toString(),

    valueOf: () => val,

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") return val;
      return val.toString();
    },
  };
};

BigIntPr.fromBytes = (buf: Uint8Array): [BigIntPr, Uint8Array] => {
  const value = bufferToBigInt(buf.slice(0, BIGINT_LEN));
  return [BigIntPr(value), buf.slice(BIGINT_LEN)];
};
