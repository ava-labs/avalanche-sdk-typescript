import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer, padLeft } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";
import { Short, SHORT_LEN } from "./short.js";
export type StringPr = {
  _type: TypeSymbols.StringPr;
  value: () => string;
  toBytes: () => Uint8Array;
  toJSON: () => string;
  toString: () => string;
  valueOf: () => string;
  [Symbol.toPrimitive](hint: string): string;
};

export const StringPr = (input: string): StringPr => {
  return {
    _type: TypeSymbols.StringPr,

    value: () => input,

    toBytes: () =>
      concatBytes(
        padLeft(hexToBuffer(input.length.toString(16)), SHORT_LEN),
        new TextEncoder().encode(input)
      ),

    toJSON: () => input,

    toString: () => input,

    valueOf: () => input,

    [Symbol.toPrimitive](hint: string) {
      return input;
    },
  };
};

StringPr.fromBytes = (buf: Uint8Array): [StringPr, Uint8Array] => {
  const [length, remaining] = Short.fromBytes(buf);
  const strBytes = remaining.slice(0, +length);
  const decoded = new TextDecoder().decode(strBytes);
  return [StringPr(decoded), remaining.slice(+length)];
};
