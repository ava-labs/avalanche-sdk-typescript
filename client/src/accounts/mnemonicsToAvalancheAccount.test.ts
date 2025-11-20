import { describe, expect, test } from "vitest";

import { mnemonicsToAvalancheAccount } from "./mnemonicsToAvalancheAccount.js";

const mnemonic = "test test test test test test test test test test test junk";

test("default", () => {
  const account = mnemonicsToAvalancheAccount(mnemonic);
  expect(account).toMatchInlineSnapshot(`
    {
      "evmAccount": {
        "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "getHdKey": [Function],
        "nonceManager": undefined,
        "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "hdKey",
        "type": "local",
      },
      "getEVMAddress": [Function],
      "getXPAddress": [Function],
      "xpAccount": {
        "getHdKey": [Function],
        "publicKey": "0x028964d7de38f4027c9aed8ad64f43a082a84083afffcc2607fdbe8db4de3e2a14",
        "signMessage": [Function],
        "signTransaction": [Function],
        "source": "hdKey",
        "type": "local",
        "verify": [Function],
      },
    }
  `);
});

describe("args: addressIndex", () => {
  Array.from({ length: 5 }).forEach((_, index) => {
    test(`addressIndex: ${index}`, () => {
      const account = mnemonicsToAvalancheAccount(mnemonic, {
        addressIndex: index,
      });
      expect(account.evmAccount.address).toBeDefined();
      expect(account.xpAccount?.publicKey).toBeDefined();
    });
  });
});

describe("args: accountIndex", () => {
  test("accountIndex: 0", () => {
    const account = mnemonicsToAvalancheAccount(mnemonic, {
      accountIndex: 0,
    });
    expect(account.evmAccount.address).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });

  test("accountIndex: 1", () => {
    const account = mnemonicsToAvalancheAccount(mnemonic, {
      accountIndex: 1,
    });
    expect(account.evmAccount.address).toBe(
      "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650"
    );
  });
});

test("getEVMAddress", () => {
  const account = mnemonicsToAvalancheAccount(mnemonic);
  expect(account.getEVMAddress()).toBe(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
});

test("getXPAddress", () => {
  const account = mnemonicsToAvalancheAccount(mnemonic);
  const address = account.getXPAddress();
  expect(address).toBeDefined();
  expect(typeof address).toBe("string");
});

test("xpAccount has getHdKey", () => {
  const account = mnemonicsToAvalancheAccount(mnemonic);
  const hdKey = (account.xpAccount as any)?.getHdKey?.();
  expect(hdKey?.privateKey).toBeDefined();
});

test("evmAccount has getHdKey", () => {
  const account = mnemonicsToAvalancheAccount(mnemonic);
  const hdKey = (account.evmAccount as any)?.getHdKey?.();
  expect(hdKey).toBeDefined();
  expect(hdKey?.privateKey).toBeDefined();
});
