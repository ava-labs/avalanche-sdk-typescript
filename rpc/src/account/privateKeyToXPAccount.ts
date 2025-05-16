import { Hex } from "viem";
import { XPAccount } from "./avalancheAccount";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";
import { xpSign } from "./utils/xpSign";
import { xpVerifySignature } from "./utils/xpVerifySignature";

export function privateKeyToXPAccount(privateKey: Hex): XPAccount {
  return {
    publicKey: privateKeyToXPPublicKey(privateKey),
    sign: (message: Hex | Uint8Array, to: "hex" | "bytes" = "bytes") =>
      xpSign(message, privateKey, to),
    verify: (message: Hex | Uint8Array, signature: Hex | Uint8Array) =>
      xpVerifySignature(
        message,
        signature,
        privateKeyToXPPublicKey(privateKey)
      ),
    type: "local",
    source: "privateKey",
  };
}
