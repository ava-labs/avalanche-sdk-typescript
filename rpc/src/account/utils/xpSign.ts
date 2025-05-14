import { secp256k1 } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { bufferToHex, hexToBuffer } from "../../utils/common.js";

export async function xpSign(
  message: Hex | Uint8Array,
  privateKey: Hex | Uint8Array,
  to: "hex" | "bytes" = "bytes"
): Promise<Hex | Uint8Array> {
  const signature = await secp256k1.sign(
    message,
    typeof privateKey === "string" ? hexToBuffer(privateKey) : privateKey
  );
  return to === "hex" ? (bufferToHex(signature) as Hex) : signature;
}
