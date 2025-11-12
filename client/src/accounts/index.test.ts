import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "HDKey",
      "czech",
      "english",
      "french",
      "italian",
      "japanese",
      "korean",
      "portuguese",
      "simplifiedChinese",
      "spanish",
      "traditionalChinese",
      "generateMnemonic",
      "generatePrivateKey",
      "hdKeyToAccount",
      "mnemonicToAccount",
      "privateKeyToAccount",
      "toAccount",
      "createNonceManager",
      "nonceManager",
      "parseAccount",
      "privateKeyToAddress",
      "publicKeyToAddress",
      "serializeSignature",
      "setSignEntropy",
      "sign",
      "signatureToHex",
      "signAuthorization",
      "signMessage",
      "signTransaction",
      "signTypedData",
      "privateKeyToAvalancheAccount",
      "mnemonicsToAvalancheAccount",
      "privateKeyToXPAddress",
      "publicKeyToXPAddress",
      "xpSignMessage",
      "xpSignTransaction",
      "xpVerifySignature",
      "xpRecoverPublicKey",
      "privateKeyToXPPublicKey",
      "hdKeyToAvalancheAccount",
      "parseAvalancheAccount",
      "privateKeyToXPAccount",
    ]
  `);
});
