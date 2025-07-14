import { XPAccount } from "./avalancheAccount";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";
import { xpSignMessage } from "./utils/xpSignMessage";
import { xpSignTransaction } from "./utils/xpSignTransaction";
import { xpVerifySignature } from "./utils/xpVerifySignature";

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
        message,
        signature,
        privateKeyToXPPublicKey(privateKey)
      ),
    type: "local",
    source: "privateKey",
  };
}
