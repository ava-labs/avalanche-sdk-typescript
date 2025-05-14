import { secp256k1 } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { hexToBuffer } from "../../utils/common.js";

export function xpVerifySignature(
  message: Hex | Uint8Array,
  signature: Hex | Uint8Array,
  publicKey: Hex | Uint8Array
): boolean {
  return secp256k1.verify(
    typeof message === "string" ? hexToBuffer(message) : message,
    signature,
    typeof publicKey === "string" ? hexToBuffer(publicKey) : publicKey
  );
}
