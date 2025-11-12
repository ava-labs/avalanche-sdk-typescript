import { expect, test } from "vitest";

import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { xpSignTransaction } from "./xpSignTransaction.js";

const txHash =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

test("sign transaction hash string", async () => {
  const signature = await xpSignTransaction(txHash, privateKey1ForTest);
  expect(signature).toBeDefined();
  expect(signature).toMatch(/^0x/);
  expect(signature.length).toBe(132);
});

test("sign transaction hash Uint8Array", async () => {
  const txHashBytes = new Uint8Array([
    0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78,
    0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
    0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
  ]);
  const signature = await xpSignTransaction(txHashBytes, privateKey1ForTest);
  expect(signature).toBeDefined();
  expect(signature).toBe(
    "0x6ae58ca3a513c96a40f96adbcb66f85ef2ac5536541c803837b31d4406fa5bac12a3149b5c76c734f0caa9be8b499f63ed91c0f65ebd39bf14f10ca167ab5ba401"
  );
});

test("sign with private key as Uint8Array", async () => {
  const privateKeyBytes = new Uint8Array(32);
  // Fill with test data
  for (let i = 0; i < 32; i++) {
    privateKeyBytes[i] = i;
  }
  const signature = await xpSignTransaction(txHash, privateKeyBytes);
  expect(signature).toBeDefined();
  expect(signature).toMatch(
    "0x0e1a201cdd70d55314979aaf36eaf4d4c917d8c683f5b9676a8800c57aa73384532d4b6cdbeb5be54357c94a101673548a1fd9840b10411e244877ae2833879700"
  );
});

test("deterministic signature", async () => {
  const signature1 = await xpSignTransaction(txHash, privateKey1ForTest);
  const signature2 = await xpSignTransaction(txHash, privateKey1ForTest);
  expect(signature1).toBe(signature2);
});

test("different hashes produce different signatures", async () => {
  const txHash2 =
    "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
  const signature1 = await xpSignTransaction(txHash, privateKey1ForTest);
  const signature2 = await xpSignTransaction(txHash2, privateKey1ForTest);
  expect(signature1).not.toBe(signature2);
});
