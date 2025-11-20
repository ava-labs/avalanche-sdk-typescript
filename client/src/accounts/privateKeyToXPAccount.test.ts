import { expect, test } from "vitest";

import { utils } from "@avalabs/avalanchejs";
import { privateKey1ForTest } from "../methods/wallet/fixtures/transactions/common.js";
import { removeChecksum } from "../utils/index.js";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount.js";

test("default", () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  expect(account).toMatchInlineSnapshot(`
    {
      "publicKey": "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
      "signMessage": [Function],
      "signTransaction": [Function],
      "source": "privateKey",
      "type": "local",
      "verify": [Function],
    }
  `);
});

test("publicKey", () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  expect(account.publicKey).toBeDefined();
  expect(account.publicKey).toMatch(
    "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208"
  );
});

test("signMessage", async () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  const signature = await account.signMessage("hello world");
  expect(signature).toBeDefined();
  expect(typeof signature).toBe("string");
  expect(signature.length).toBeGreaterThan(0);
});

test("signTransaction", async () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  const txHash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const signature = await account.signTransaction(txHash);
  expect(signature).toBeDefined();
  expect(signature).toMatch(/^0x/);
});

test("signTransaction with Uint8Array", async () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  const txHash = new Uint8Array([
    0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78,
    0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
    0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
  ]);
  const signature = await account.signTransaction(txHash);
  expect(signature).toBeDefined();
  expect(signature).toMatch(/^0x/);
});

test("verify", async () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  const message = "hello world";
  const signature = await account.signMessage(message);
  const actualSignature = removeChecksum(
    removeChecksum(utils.base58.decode(signature!))
  );
  const isValid = account.verify(message, utils.bufferToHex(actualSignature));
  expect(isValid).toBe(true);
});

test("verify with wrong message", async () => {
  const account = privateKeyToXPAccount(privateKey1ForTest);
  const message = "hello world";
  const wrongMessage = "hello world!";
  const signature = await account.signMessage(message);
  const actualSignature = removeChecksum(
    removeChecksum(utils.base58.decode(signature))
  );
  const isValid = account.verify(
    wrongMessage,
    utils.bufferToHex(actualSignature)
  );
  expect(isValid).toBe(false);
});
