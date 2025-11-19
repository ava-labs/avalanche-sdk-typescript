import { HDKey } from "@scure/bip32";
import { toBytes } from "viem";
import { describe, expect, test } from "vitest";

import { hdKeyToAvalancheAccount } from "./hdKeyToAvalancheAccount.js";

const hdKey = HDKey.fromMasterSeed(
  toBytes(
    "0x9dfc3c64c2f8bede1533b6a79f8570e5943e0b8fd1cf77107adf7b72cef42185d564a3aee24cab43f80e3c4538087d70fc824eabbad596a23c97b6ee8322ccc0"
  )
);

test("default", () => {
  const account = hdKeyToAvalancheAccount(hdKey);
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
      const account = hdKeyToAvalancheAccount(hdKey, {
        addressIndex: index,
      });
      expect(account.evmAccount.address).toBeDefined();
      expect(account.xpAccount?.publicKey).toBeDefined();
    });
  });
});

describe("args: accountIndex", () => {
  test("accountIndex: 0", () => {
    const account = hdKeyToAvalancheAccount(hdKey, {
      accountIndex: 0,
    });
    expect(account.evmAccount.address).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });

  test("accountIndex: 1", () => {
    const account = hdKeyToAvalancheAccount(hdKey, {
      accountIndex: 1,
    });
    expect(account.evmAccount.address).toBe(
      "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650"
    );
  });
});

describe("args: xpAccountIndex", () => {
  test("xpAccountIndex: 0", () => {
    const account = hdKeyToAvalancheAccount(hdKey, {
      xpAccountIndex: 0,
    });
    expect(account.xpAccount?.publicKey).toBeDefined();
  });

  test("xpAccountIndex: 1", () => {
    const account = hdKeyToAvalancheAccount(hdKey, {
      xpAccountIndex: 1,
    });
    expect(account.xpAccount?.publicKey).toBeDefined();
  });
});

test("getEVMAddress", () => {
  const account = hdKeyToAvalancheAccount(hdKey);
  expect(account.getEVMAddress()).toBe(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
});

test("getXPAddress", () => {
  const account = hdKeyToAvalancheAccount(hdKey);
  const address = account.getXPAddress();
  const cAddress = account.getXPAddress("C");
  expect(address).toBeDefined();
  expect(typeof address).toBe("string");
  expect(cAddress).toBeDefined();
  expect(typeof cAddress).toBe("string");
  expect(cAddress.startsWith("C-")).toBe(true);
});

test("xpAccount has getHdKey", () => {
  const account = hdKeyToAvalancheAccount(hdKey);
  const hdKey_ = (account.xpAccount as any)?.getHdKey?.();
  expect(hdKey_?.privateKey).toBeDefined();
});

test("evmAccount has getHdKey", () => {
  const account = hdKeyToAvalancheAccount(hdKey);
  const hdKey_ = (account.evmAccount as any)?.getHdKey?.();
  expect(hdKey_?.privateKey).toBeDefined();
});
