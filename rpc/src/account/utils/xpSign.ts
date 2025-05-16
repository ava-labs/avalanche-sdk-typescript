import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";
export async function xpSign(
  message: Hex | Uint8Array,
  privateKey: Hex | Uint8Array,
  to: "hex" | "bytes" = "bytes"
): Promise<Hex | Uint8Array> {
  const signature = await secp256k1.sign(
    message,
    typeof privateKey === "string" ? utils.hexToBuffer(privateKey) : privateKey
  );
  return to === "hex" ? (utils.bufferToHex(signature) as Hex) : signature;
}
