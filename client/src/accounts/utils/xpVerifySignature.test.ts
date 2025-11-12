import { expect, test } from "vitest";

import { utils } from "@avalabs/avalanchejs";
import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { removeChecksum } from "../../utils/index.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";
import { xpSignMessage } from "./xpSignMessage.js";
import { xpVerifySignature } from "./xpVerifySignature.js";

const publicKey = privateKeyToXPPublicKey(privateKey1ForTest);

test("verify valid signature", async () => {
  const message = "hello world";
  const signature = await xpSignMessage(message, privateKey1ForTest);
  const actualSignature = removeChecksum(
    removeChecksum(utils.base58.decode(signature))
  );
  const isValid = xpVerifySignature(
    utils.bufferToHex(actualSignature),
    message,
    publicKey
  );
  expect(isValid).toBe(true);
});

test("verify invalid signature with wrong message", async () => {
  const message = "hello world";
  const wrongMessage = "hello world!";
  const signature = await xpSignMessage(message, privateKey1ForTest);
  const actualSignature = removeChecksum(
    removeChecksum(utils.base58.decode(signature))
  );
  const isValid = xpVerifySignature(
    utils.bufferToHex(actualSignature),
    wrongMessage,
    publicKey
  );
  expect(isValid).toBe(false);
});

test("verify invalid signature with wrong public key", async () => {
  const message = "hello world";
  const signature = await xpSignMessage(message, privateKey1ForTest);
  const wrongPublicKey = "0x04" + "0".repeat(128);
  const signatureBytes = utils.base58.decode(signature);
  const actualSignature = removeChecksum(removeChecksum(signatureBytes));
  const isValid = xpVerifySignature(
    utils.bufferToHex(actualSignature),
    message,
    wrongPublicKey
  );
  expect(isValid).toBe(false);
});

test("verify with different messages", async () => {
  const message1 = "message 1";
  const message2 = "message 2";
  const signature1 = await xpSignMessage(message1, privateKey1ForTest);
  const signature2 = await xpSignMessage(message2, privateKey1ForTest);

  const actualSignature1 = removeChecksum(
    removeChecksum(utils.base58.decode(signature1))
  );
  const actualSignature2 = removeChecksum(
    removeChecksum(utils.base58.decode(signature2))
  );
  expect(
    xpVerifySignature(utils.bufferToHex(actualSignature1), message1, publicKey)
  ).toBe(true);
  expect(
    xpVerifySignature(utils.bufferToHex(actualSignature2), message2, publicKey)
  ).toBe(true);
  expect(
    xpVerifySignature(utils.bufferToHex(actualSignature2), message1, publicKey)
  ).toBe(false);
  expect(
    xpVerifySignature(utils.bufferToHex(actualSignature1), message2, publicKey)
  ).toBe(false);
  expect(
    xpVerifySignature(utils.bufferToHex(actualSignature2), message1, publicKey)
  ).toBe(false);
});
