import { concatBytes } from "@noble/hashes/utils";
import { bufferToHex } from "../../utils/common.js";
import { TypeSymbols } from "../typeSymbols.js";
import { Int } from "./int.js";

export type VariableLengthArray = {
  _type: TypeSymbols.VariableLengthArray;
  value: () => Uint8Array[];
  toBytes: () => Uint8Array;
  toJSON: (parser?: (e: Uint8Array) => any) => any[];
  toString: (parser?: (e: Uint8Array) => any) => string;
  valueOf: () => Uint8Array[];
  [Symbol.toPrimitive](hint: string): Uint8Array[] | string;
};

// Type guard to check if input is VariableLengthArray
const isVariableLengthArray = (
  input: Uint8Array[] | VariableLengthArray
): input is VariableLengthArray => {
  return (
    "valueOf" in input &&
    "_type" in input &&
    input._type === TypeSymbols.VariableLengthArray
  );
};

export const VariableLengthArray = (
  input: Uint8Array[] | VariableLengthArray
): VariableLengthArray => {
  const value = isVariableLengthArray(input) ? input.valueOf() : [...input];

  return {
    _type: TypeSymbols.VariableLengthArray,

    value: () => value,
    toBytes: () => {
      const lengthBytes = Int(value.length).toBytes();
      return concatBytes(lengthBytes, ...value);
    },

    toJSON: (parser: (e: Uint8Array) => any = bufferToHex) => {
      return value.map((e: Uint8Array) => parser(e));
    },

    toString: (parser: (e: Uint8Array) => any = bufferToHex) => {
      return JSON.stringify(value.map((e: Uint8Array) => parser(e)));
    },

    valueOf: () => value,

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert array to number");
      return JSON.stringify(value.map((e: Uint8Array) => bufferToHex(e)));
    },
  };
};

VariableLengthArray.fromBytes = (
  buf: Uint8Array,
  elemByteLen: number
): [VariableLengthArray, Uint8Array] => {
  // Read array length (first 4 bytes as Int)
  const [lengthInt, remainingBuf] = Int.fromBytes(buf);
  const length = lengthInt.value();

  // Read each element using the appropriate fromBytes method
  const elements: Uint8Array[] = [];
  let currentBuf = remainingBuf;
  for (let i = 0; i < length; i++) {
    const element = currentBuf.slice(0, elemByteLen);
    elements.push(element);
    currentBuf = currentBuf.slice(elemByteLen);
  }
  return [VariableLengthArray(elements), currentBuf];
};
