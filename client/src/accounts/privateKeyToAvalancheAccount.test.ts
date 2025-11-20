import { describe, expect, test } from "vitest";

import { utils } from "@avalabs/avalanchejs";
import { privateKey1ForTest } from "../methods/wallet/fixtures/transactions/common.js";
import { removeChecksum } from "../utils/index.js";
import { privateKeyToAvalancheAccount } from "./privateKeyToAvalancheAccount.js";

test("default", () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  expect(account).toMatchInlineSnapshot(`
    {
      "evmAccount": {
        "address": "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
        "nonceManager": undefined,
        "publicKey": "0x0445ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208ccffed354a77ebefbfc904d0deedc31c21d79a165fff2dd94e862ed7dc15a736",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "getEVMAddress": [Function],
      "getXPAddress": [Function],
      "xpAccount": {
        "publicKey": "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
        "signMessage": [Function],
        "signTransaction": [Function],
        "source": "privateKey",
        "type": "local",
        "verify": [Function],
      },
    }
  `);
});

test("getEVMAddress", () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  expect(account.getEVMAddress()).toBe(
    "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D"
  );
});

describe("getXPAddress", () => {
  test("default hrp", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);
    const address = account.getXPAddress();
    expect(address).toMatch(/^[a-z0-9]+$/);
    expect(address.length).toBeGreaterThan(0);
  });

  test("with chain prefix", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);
    const xAddress = account.getXPAddress("X");
    const pAddress = account.getXPAddress("P");
    const cAddress = account.getXPAddress("C");

    expect(xAddress).toMatch(/^X-/);
    expect(pAddress).toMatch(/^P-/);
    expect(cAddress).toMatch(/^C-/);
  });

  test("with custom hrp", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);
    const address = account.getXPAddress(undefined, "fuji");
    expect(address).toMatch(/^fuji/);
  });

  test("with chain and custom hrp", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);
    const address = account.getXPAddress("X", "fuji");
    expect(address).toMatch(/^X-fuji/);
  });
});

test("xpAccount signMessage", async () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  const signature = await account.xpAccount?.signMessage?.("hello world")!;
  expect(signature).toBeDefined();
  expect(typeof signature).toBe("string");
  expect(signature.length).toBeGreaterThan(0);
});

test("xpAccount signTransaction", async () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  const txHash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const signature = await account.xpAccount?.signTransaction?.(txHash);
  expect(signature).toBeDefined();
  expect(signature).toMatch(/^0x/);
});

test("xpAccount verify", async () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  const message = "hello world";
  const signature = await account.xpAccount?.signMessage?.(message);
  const actualSignature = removeChecksum(
    removeChecksum(utils.base58.decode(signature!))
  );
  const isValid = account.xpAccount?.verify?.(
    message,
    utils.bufferToHex(actualSignature)
  );
  expect(isValid).toBe(true);
});

test("evmAccount signMessage", async () => {
  const account = privateKeyToAvalancheAccount(privateKey1ForTest);
  const signature = await account.evmAccount?.signMessage?.({
    message: "hello world",
  });
  expect(signature).toBeDefined();
  expect(signature).toMatch(/^0x/);
});
