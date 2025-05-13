import { bufferToNumber, hexToBuffer, padLeft } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";
export const SHORT_LEN = 2;

export type Short = {
  _type: TypeSymbols.Short;
  value: () => number;
  toBytes: () => Uint8Array;
  toJSON: () => string;
  toString: () => string;
  valueOf: () => number;
  [Symbol.toPrimitive](hint: string): string | number;
};

export const Short = (input: number | string): Short => {
  const num = typeof input === "string" ? parseInt(input) : input;

  return {
    _type: TypeSymbols.Short,

    value: () => num,

    toBytes: () => padLeft(hexToBuffer(num.toString(16)), SHORT_LEN),

    toJSON: () => num.toString(),

    toString: () => num.toString(),

    valueOf: () => num,

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") return num;
      if (hint === "string") return num.toString();
      return num.toString(); // 'default' falls back to string form
    },
  };
};

Short.fromBytes = (buf: Uint8Array): [Short, Uint8Array] => {
  const value = bufferToNumber(buf.slice(0, SHORT_LEN));
  return [Short(value), buf.slice(SHORT_LEN)];
};
