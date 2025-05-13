import { Int } from "../primitives/int";
import { OutputTypeIdToTypeMap } from "./pChain/output/outputTypeIdToTypeMap";

export function parseBufferToOutputTypedSchema<T>(
  buf: Uint8Array
): [T, Uint8Array] {
  const [typeId] = Int.fromBytes(buf);
  const type = OutputTypeIdToTypeMap[typeId.toString()];
  if (!type) {
    throw new Error(`Unknown type id: ${typeId}`);
  }
  return type.fromBytes(buf) as [T, Uint8Array];
}

export function parseTypedArraySchema<T>(
  buf: Uint8Array,
  type: { fromBytes: (buf: Uint8Array) => [any, Uint8Array] }
): [T[], Uint8Array] {
  const [length, rest] = Int.fromBytes(buf);
  let len = length.value();
  const arr: T[] = [];
  let currBuf = rest;
  for (let i = 0; i < len; i++) {
    const [value, rest] = type.fromBytes(currBuf);
    arr.push(value);
    currBuf = rest;
  }
  return [arr, currBuf];
}
