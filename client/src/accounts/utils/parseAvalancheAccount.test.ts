import { Address } from "viem";
import { describe, expect, expectTypeOf, test } from "vitest";
import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import type { AvalancheAccount } from "../avalancheAccount.js";
import { privateKeyToAvalancheAccount } from "../privateKeyToAvalancheAccount.js";
import { parseAvalancheAccount } from "./parseAvalancheAccount.js";

describe("parseAvalancheAccount", () => {
  test("parses string address to AvalancheAccount", () => {
    const address = "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D" as Address;

    const result = parseAvalancheAccount(address);

    expectTypeOf(result).toEqualTypeOf<AvalancheAccount>();
    expect(result).toBeDefined();
    expect(result).toHaveProperty("evmAccount");
    expect(result.evmAccount).toBeDefined();
    expect(result.evmAccount.address.toLowerCase()).toBe(address.toLowerCase());
    expect(result.evmAccount.type).toBe("json-rpc");
  });

  test("returns AvalancheAccount when passed AvalancheAccount", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);

    const result = parseAvalancheAccount(account);

    expectTypeOf(result).toEqualTypeOf<AvalancheAccount>();
    expect(result).toBe(account);
    expect(result).toHaveProperty("evmAccount");
    expect(result).toHaveProperty("xpAccount");
    expect(result).toHaveProperty("getEVMAddress");
    expect(result).toHaveProperty("getXPAddress");
  });

  test("returns undefined when passed undefined", () => {
    const result = parseAvalancheAccount(undefined);

    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("handles different address formats", () => {
    const addresses = [
      "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
      "0x0000000000000000000000000000000000000000",
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      "0x1234567890abcdef1234567890abcdef12345678",
    ] as Address[];

    for (const address of addresses) {
      const result = parseAvalancheAccount(address);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("evmAccount");
      expect(result.evmAccount.address.toLowerCase()).toBe(
        address.toLowerCase()
      );
    }
  });

  test("parsed account has correct evmAccount structure", () => {
    const address = "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D" as Address;

    const result = parseAvalancheAccount(address);

    expect(result.evmAccount).toHaveProperty("address");
    expect(result.evmAccount).toHaveProperty("type");
    expect(result.evmAccount.address.toLowerCase()).toBe(address.toLowerCase());
    expect(result.evmAccount.type).toBe("json-rpc");
  });

  test("parsed account from address does not have xpAccount", () => {
    const address = "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D" as Address;

    const result = parseAvalancheAccount(address);

    expect(result).not.toHaveProperty("xpAccount");
    // Or if it exists, it should be undefined
    if ("xpAccount" in result) {
      expect(result.xpAccount).toBeUndefined();
    }
  });

  test("preserves xpAccount when passing AvalancheAccount", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);

    const result = parseAvalancheAccount(account);

    expect(result.xpAccount).toBeDefined();
    expect(result.xpAccount).toBe(account.xpAccount);
    expect(result.xpAccount?.publicKey).toBe(account.xpAccount?.publicKey);
  });

  test("preserves getEVMAddress and getXPAddress methods", () => {
    const account = privateKeyToAvalancheAccount(privateKey1ForTest);

    const result = parseAvalancheAccount(account);

    expect(result.getEVMAddress).toBe(account.getEVMAddress);
    expect(result.getXPAddress).toBe(account.getXPAddress);
    expect(typeof result.getEVMAddress).toBe("function");
    expect(typeof result.getXPAddress).toBe("function");
  });
});
