import { bufferToHex } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";

const BYTE_LEN = 1;

export type Byte = {
  _type: TypeSymbols.Byte;
  value: () => Uint8Array;
  toBytes: () => Uint8Array;
  toJSON: () => string;
  toString: () => string;
  valueOf: () => Uint8Array;
  [Symbol.toPrimitive](hint: string): string;
};

export const Byte = (input: Uint8Array): Byte => {
  const byte = input.slice(0, BYTE_LEN);

  return {
    _type: TypeSymbols.Byte,

    value: () => byte,

    toBytes: () => byte,

    toJSON: () => bufferToHex(byte),

    toString: () => bufferToHex(byte),

    valueOf: () => byte,

    [Symbol.toPrimitive](hint: string) {
      return bufferToHex(byte);
    },
  };
};

Byte.fromBytes = (buf: Uint8Array): [Byte, Uint8Array] => {
  return [Byte(buf.slice(0, BYTE_LEN)), buf.slice(BYTE_LEN)];
};
