import { XPAccount } from "./avalancheAccount.js";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey.js";
import { xpSignMessage } from "./utils/xpSignMessage.js";
import { xpSignTransaction } from "./utils/xpSignTransaction.js";
import { xpVerifySignature } from "./utils/xpVerifySignature.js";

/**
 * Converts a private key to an XP account.
 *
 * @param privateKey - The private key.
 * @returns The XP account {@link XPAccount}.
 */
export function privateKeyToXPAccount(privateKey: string): XPAccount {
  return {
    publicKey: privateKeyToXPPublicKey(privateKey),
    signMessage: (message: string) => xpSignMessage(message, privateKey),
    signTransaction: (txHash: string | Uint8Array<ArrayBufferLike>) =>
      xpSignTransaction(txHash, privateKey),
    verify: (message: string, signature: string) =>
      xpVerifySignature(
        signature,
        message,
        privateKeyToXPPublicKey(privateKey)
      ),
    type: "local",
    source: "privateKey",
  };
}
