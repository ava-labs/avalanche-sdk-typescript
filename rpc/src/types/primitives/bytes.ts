import { bufferToHex } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";

export type Bytes = {
  _type: TypeSymbols.Bytes;
  value: () => Uint8Array;
  toBytes: () => Uint8Array;
  toJSON: () => string;
  toString: (encoding?: "utf8" | "hex") => string;
  length: number;
  valueOf: () => Uint8Array;
  [Symbol.toPrimitive](hint: string): string;
};

export const Bytes = (input: Uint8Array): Bytes => {
  const slice = input.slice(); // copy to ensure immutability

  return {
    _type: TypeSymbols.Bytes,

    value: () => slice,

    toBytes: () => slice,

    toJSON: () => bufferToHex(slice),

    toString: (encoding: "utf8" | "hex" = "utf8") => {
      if (encoding === "utf8") {
        return new TextDecoder("utf-8").decode(slice);
      }
      return bufferToHex(slice);
    },

    length: slice.length,

    valueOf: () => slice,

    [Symbol.toPrimitive](hint: string) {
      return bufferToHex(slice);
    },
  };
};

Bytes.fromBytes = (
  buf: Uint8Array,
  length: number | undefined = 0
): [Bytes, Uint8Array] => {
  const chunk = length ? buf.slice(0, length) : Uint8Array.from([]);
  const rest = buf.slice(length);
  return [Bytes(chunk), rest];
};
