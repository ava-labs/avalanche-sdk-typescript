import { Hex } from "viem";
import { XPAccount } from "./avalancheAccount";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";
import { xpSignMessage } from "./utils/xpSignMessage";
import { xpSignTransaction } from "./utils/xpSignTransaction";
import { xpVerifySignature } from "./utils/xpVerifySignature";

export function privateKeyToXPAccount(privateKey: Hex): XPAccount {
  return {
    publicKey: privateKeyToXPPublicKey(privateKey),
    signMessage: (message: string) => xpSignMessage(message, privateKey),
    signTransaction: (txHash: Hex) => xpSignTransaction(txHash, privateKey),
    verify: (message: Hex, signature: Hex) =>
      xpVerifySignature(
        message,
        signature,
        privateKeyToXPPublicKey(privateKey)
      ),
    type: "local",
    source: "privateKey",
  };
}
