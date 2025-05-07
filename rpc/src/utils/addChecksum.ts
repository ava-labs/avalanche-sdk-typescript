import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "./buffer.js";

export function addChecksum(data: Uint8Array) {
  return concatBytes(data, sha256(data).subarray(-4));
}
