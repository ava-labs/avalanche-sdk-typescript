import { secp256k1 } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { bufferToHex, hexToBuffer } from "../../utils/common.js";

export function xpRecoverPublicKey(
  message: Hex | Uint8Array,
  signature: Hex | Uint8Array,
  to: "hex" | "bytes" = "bytes"
): Hex | Uint8Array {
  const publicKey = secp256k1.recoverPublicKey(
    message,
    typeof signature === "string" ? hexToBuffer(signature) : signature
  );
  return to === "hex" ? (bufferToHex(publicKey) as Hex) : publicKey;
}
