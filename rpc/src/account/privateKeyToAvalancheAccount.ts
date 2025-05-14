import { Hex } from "viem";
import { privateKeyToAccount, PrivateKeyToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";
import { xpRecoverPublicKey } from "./utils/XPRecoverPublicKey";
import { xpSign } from "./utils/XPSign";
import { xpVerifySignature } from "./utils/XPVerifySignature";

export function privateKeyToAvalancheAccount(
  privateKey: Hex,
  options: PrivateKeyToAccountOptions = {}
): AvalancheAccount {
  return {
    evmAccount: privateKeyToAccount(privateKey, options),
    xpAccount: {
      publicKey: privateKeyToXPPublicKey(privateKey),
      sign: (message: Hex | Uint8Array, to: "hex" | "bytes" = "bytes") =>
        xpSign(message, privateKey, to),
      verify: (message: Hex | Uint8Array, signature: Hex | Uint8Array) =>
        xpVerifySignature(
          message,
          signature,
          privateKeyToXPPublicKey(privateKey)
        ),
      recoverPublicKey: (
        message: Hex | Uint8Array,
        signature: Hex | Uint8Array,
        to: "hex" | "bytes" = "bytes"
      ) => xpRecoverPublicKey(message, signature, to),
      type: "local",
      source: "privateKey",
    },
  };
}
