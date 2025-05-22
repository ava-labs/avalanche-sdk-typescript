import { Hex, NonceManager } from "viem";
import { XPAccount } from "./avalancheAccount";
import { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";
import { xpSignMessage } from "./utils/xpSignMessage";
import { xpSignTransaction } from "./utils/xpSignTransaction";
import { xpVerifySignature } from "./utils/xpVerifySignature";

export type PrivateKeyToXPAccountOptions = {
  nonceManager?: NonceManager | undefined;
};

export function privateKeyToXPAccount(
  privateKey: Hex,
  params: PrivateKeyToXPAccountOptions = {}
): XPAccount {
  const { nonceManager } = params;
  return {
    nonceManager,
    publicKey: privateKeyToXPPublicKey(privateKey),
    signMessage: (message: string) => xpSignMessage(message, privateKey),
    signTransaction: (txHash: Hex | Uint8Array<ArrayBufferLike>) =>
      xpSignTransaction(txHash, privateKey),
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
