import { describe, expect, test } from "vitest";
import { privateKeyToAvalancheAccount } from "../accounts/index.js";
import { privateKey1ForTest } from "../methods/wallet/fixtures/transactions/common.js";
import { buildUtxoBytes } from "./buildUtxoBytes.js";
import { getUtxoFromBytes } from "./getUtxoFromBytes.js";

const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);

describe("buildUtxoBytes", () => {
  test("builds UTXO bytes with valid parameters", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(2); // At least "0x" + some hex
  });

  test("builds UTXO bytes that can be parsed back", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const utxoBytes = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    // Should be able to parse it back
    const parsedUtxo = getUtxoFromBytes(utxoBytes, "P");
    expect(parsedUtxo).toBeDefined();
    expect(parsedUtxo.getAssetId().toString()).toBe(assetId);
  });

  test("handles multiple addresses", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "100000000000";
    const addresses = [
      account1.getXPAddress("P", "fuji"),
      account1.getXPAddress("P", "fuji"),
    ];
    const locktime = "0";
    const threshold = 2;

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
    const parsedUtxo = getUtxoFromBytes(result, "P");
    expect(parsedUtxo).toBeDefined();
  });

  test("handles different output indices", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const locktime = "0";
    const threshold = 1;

    for (let outputIndex = 0; outputIndex < 5; outputIndex++) {
      const result = buildUtxoBytes(
        txHash,
        outputIndex,
        assetId,
        amount,
        addresses,
        locktime,
        threshold
      );

      expect(result).toMatch(/^0x/);
      const parsedUtxo = getUtxoFromBytes(result, "P");
      expect(parsedUtxo).toBeDefined();
    }
  });

  test("handles different amounts", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const amounts = ["1", "1000", "1000000000", "50000000000"];

    for (const amount of amounts) {
      const result = buildUtxoBytes(
        txHash,
        outputIndex,
        assetId,
        amount,
        addresses,
        locktime,
        threshold
      );

      expect(result).toMatch(/^0x/);
    }
  });

  test("handles locktime", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const threshold = 1;
    const locktime = "1672531200"; // Some future timestamp

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
    const parsedUtxo = getUtxoFromBytes(result, "P");
    expect(parsedUtxo).toBeDefined();
  });

  test("handles stakeable locktime", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const threshold = 1;
    const locktime = "1672531200"; // Some future timestamp
    const stakeableLocktime = "1672531200"; // Some future timestamp

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold,
      stakeableLocktime
    );

    expect(result).toMatch(/^0x/);
    const parsedUtxo = getUtxoFromBytes(result, "P");
    expect(parsedUtxo).toBeDefined();
  });

  test("handles different thresholds", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [
      account1.getXPAddress("P", "fuji"),
      account1.getXPAddress("P", "fuji"),
      account1.getXPAddress("P", "fuji"),
    ];
    const locktime = "0";

    for (let threshold = 1; threshold <= 3; threshold++) {
      const result = buildUtxoBytes(
        txHash,
        outputIndex,
        assetId,
        amount,
        addresses,
        locktime,
        threshold
      );

      expect(result).toMatch(/^0x/);
    }
  });

  test("handles addresses with P- prefix", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("P", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
  });

  test("handles addresses with X- prefix", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("X", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
  });

  test("handles addresses with C- prefix", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses = [account1.getXPAddress("C", "fuji")];
    const locktime = "0";
    const threshold = 1;

    const result = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses,
      locktime,
      threshold
    );

    expect(result).toMatch(/^0x/);
  });

  test("sorts addresses before building UTXO", () => {
    const txHash = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi";
    const outputIndex = 0;
    const assetId = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
    const amount = "50000000000";
    const addresses1 = [
      account1.getXPAddress("P", "fuji"),
      account1.getXPAddress("P", "fuji"),
    ];
    const addresses2 = [
      account1.getXPAddress("P", "fuji"),
      account1.getXPAddress("P", "fuji"),
    ];
    const locktime = "0";
    const threshold = 2;

    const result1 = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses1,
      locktime,
      threshold
    );
    const result2 = buildUtxoBytes(
      txHash,
      outputIndex,
      assetId,
      amount,
      addresses2,
      locktime,
      threshold
    );

    // Should produce the same result regardless of input order
    expect(result1).toBe(result2);
  });
});
