import { bufferToNumber, hexToBuffer, padLeft } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";
export const INT_LEN = 4;

export type Int = {
  _type: TypeSymbols.Int;
  value: () => number;
  toBytes: () => Uint8Array;
  toJSON: () => number;
  toString: () => string;
  valueOf: () => number;
  [Symbol.toPrimitive](hint: string): number | string;
};

export const Int = (input: number | string | Int): Int => {
  const num = typeof input === "string" ? parseInt(input) : input.valueOf();

  return {
    _type: TypeSymbols.Int,

    value: () => num,

    toBytes: () => padLeft(hexToBuffer(num.toString(16)), INT_LEN),

    toJSON: () => num,

    toString: () => num.toString(),

    valueOf: () => num,

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") return num;
      return num.toString(); // 'string' or 'default'
    },
  };
};

Int.fromBytes = (buf: Uint8Array): [Int, Uint8Array] => {
  const value = bufferToNumber(buf.slice(0, INT_LEN));
  return [Int(value), buf.slice(INT_LEN)];
};
