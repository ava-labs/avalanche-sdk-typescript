import { Short, utils, Utxo } from "@avalabs/avalanchejs";
import { describe, expect, test } from "vitest";
import { privateKeyToAvalancheAccount } from "../accounts/index.js";
import { privateKey1ForTest } from "../methods/wallet/fixtures/transactions/common.js";
import { getValidUTXO } from "../methods/wallet/fixtures/transactions/pChain.js";
import { getUtxoFromBytes } from "./getUtxoFromBytes.js";

const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);

describe("getUtxoFromBytes", () => {
  describe("P-Chain", () => {
    test("parses UTXO from hex string", () => {
      const utxo = getValidUTXO(
        BigInt(50 * 1e9),
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
        [account1.getXPAddress("P", "fuji")]
      );
      const manager = utils.getManagerForVM("PVM");
      const utxoHex = utils.bufferToHex(
        utils.addChecksum(
          utils.concatBytes(
            new Short(0).toBytes(),
            utxo.toBytes(manager.getDefaultCodec())
          )
        )
      );

      const result = getUtxoFromBytes(utxoHex, "P");

      expect(result).toBeInstanceOf(Utxo);
      expect(result.getAssetId().toString()).toBe(
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
      );
    });

    test("parses UTXO from Uint8Array", () => {
      const utxo = getValidUTXO(
        BigInt(50 * 1e9),
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
        [account1.getXPAddress("P", "fuji")]
      );
      const manager = utils.getManagerForVM("PVM");
      const utxoBytes = utils.addChecksum(
        utils.concatBytes(
          new Short(0).toBytes(),
          utxo.toBytes(manager.getDefaultCodec())
        )
      );

      const result = getUtxoFromBytes(utxoBytes, "P");

      expect(result).toBeInstanceOf(Utxo);
      expect(result.getAssetId().toString()).toBe(
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
      );
    });

    test("handles UTXO with multiple addresses", () => {
      const utxo = getValidUTXO(
        BigInt(100 * 1e9),
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
        [
          account1.getXPAddress("P", "fuji"),
          account1.getXPAddress("P", "fuji"),
        ],
        0,
        2
      );
      const manager = utils.getManagerForVM("PVM");
      const utxoHex = utils.bufferToHex(
        utils.addChecksum(
          utils.concatBytes(
            new Short(0).toBytes(),
            utxo.toBytes(manager.getDefaultCodec())
          )
        )
      );

      const result = getUtxoFromBytes(utxoHex, "P");

      expect(result).toBeInstanceOf(Utxo);
    });
  });

  describe("X-Chain", () => {
    test("parses UTXO from hex string", () => {
      const utxo = getValidUTXO(
        BigInt(50 * 1e9),
        "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
        [account1.getXPAddress("X", "fuji")]
      );
      const manager = utils.getManagerForVM("AVM");
      const utxoHex = utils.bufferToHex(
        utils.addChecksum(
          utils.concatBytes(
            new Short(0).toBytes(),
            utxo.toBytes(manager.getDefaultCodec())
          )
        )
      );

      const result = getUtxoFromBytes(utxoHex, "X");

      expect(result).toBeInstanceOf(Utxo);
      expect(result.getAssetId().toString()).toBe(
        "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
      );
    });
  });

  describe("C-Chain", () => {
    test("parses UTXO from hex string", () => {
      const utxo = getValidUTXO(
        BigInt(50 * 1e9),
        "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
        [account1.getXPAddress("C", "fuji")]
      );
      const manager = utils.getManagerForVM("EVM");
      const utxoHex = utils.bufferToHex(
        utils.addChecksum(
          utils.concatBytes(
            new Short(0).toBytes(),
            utxo.toBytes(manager.getDefaultCodec())
          )
        )
      );

      const result = getUtxoFromBytes(utxoHex, "C");

      expect(result).toBeInstanceOf(Utxo);
    });
  });

  describe("error cases", () => {
    test("throws error for invalid hex string", () => {
      expect(() => getUtxoFromBytes("invalid", "P")).toThrow();
    });

    test("throws error for invalid bytes", () => {
      const invalidBytes = new Uint8Array([1, 2, 3]);
      expect(() => getUtxoFromBytes(invalidBytes, "P")).toThrow();
    });

    test("throws error for empty hex string", () => {
      expect(() => getUtxoFromBytes("0x", "P")).toThrow();
    });

    test("throws error for empty Uint8Array", () => {
      expect(() => getUtxoFromBytes(new Uint8Array(0), "P")).toThrow();
    });
  });
});
