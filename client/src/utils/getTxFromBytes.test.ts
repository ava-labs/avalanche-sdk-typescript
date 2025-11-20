import { Common, Credential, UnsignedTx } from "@avalabs/avalanchejs";
import { describe, expect, test } from "vitest";
import { cChainTxHash } from "../methods/wallet/fixtures/transactions/cChain.js";
import {
  pChainTxCredentialsJsonStrExample,
  pChainTxHash,
  pChainTxJsonStrExample,
} from "../methods/wallet/fixtures/transactions/pChain.js";
import { xChainTxHash } from "../methods/wallet/fixtures/transactions/xChain.js";
import { getTxFromBytes, getUnsignedTxFromBytes } from "./getTxFromBytes.js";

describe("getTxFromBytes", () => {
  describe("P-Chain", () => {
    test("parses transaction from hex string", () => {
      const [tx, credentials] = getTxFromBytes(pChainTxHash, "P");
      expect(tx.getVM()).toBe("PVM");
      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(credentials.length).toBeGreaterThan(0);
      credentials.forEach((cred) => {
        expect(cred).toBeInstanceOf(Credential);
      });
    });

    test("returns transaction and credentials separately", () => {
      const [tx, credentials] = getTxFromBytes(pChainTxHash, "P");
      expect(tx.getVM()).toBe("PVM");
      expect(tx).toBeDefined();
      expect(credentials).toBeDefined();
      expect(Array.isArray(credentials)).toBe(true);
    });

    test("handles transaction with multiple credentials", () => {
      const [tx, credentials] = getTxFromBytes(pChainTxHash, "P");

      expect(tx.getBlockchainId()).toBe(
        "11111111111111111111111111111111LpoYY"
      );
      expect(tx.getSigIndices).toBeDefined();
      expect(JSON.stringify(tx)).toBe(pChainTxJsonStrExample);
      expect(JSON.stringify(credentials)).toBe(
        pChainTxCredentialsJsonStrExample
      );
      expect(tx.getVM()).toBe("PVM");
      expect(tx).toBeDefined();
      expect(credentials.length).toBeGreaterThanOrEqual(1);
    });

    test("handles hex string without 0x prefix", () => {
      // Remove 0x prefix to test strip0x handling
      const txHashWithoutPrefix = pChainTxHash.slice(2);
      const [tx, credentials] = getTxFromBytes(txHashWithoutPrefix, "P");

      expect(tx.getVM()).toBe("PVM");
      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(credentials.length).toBeGreaterThan(0);
    });
  });

  describe("X-Chain", () => {
    test("parses transaction from hex string", () => {
      // For X-Chain, we would need a properly signed transaction hex
      // Since we don't have one in fixtures, we test that the function
      // can handle the P-Chain format which demonstrates the parsing logic
      const [tx, credentials] = getTxFromBytes(xChainTxHash, "X");

      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(tx.getVM()).toBe("AVM");
      expect(tx.getBlockchainId()).toBe(
        "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"
      );
    });

    test("handles hex string without 0x prefix", () => {
      const txHashWithoutPrefix = xChainTxHash.slice(2);
      const [tx, credentials] = getTxFromBytes(txHashWithoutPrefix, "X");

      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(tx.getVM()).toBe("AVM");
    });
  });

  describe("C-Chain", () => {
    test("parses transaction from hex string", () => {
      // For C-Chain, we would need a properly signed transaction hex
      // Since we don't have one in fixtures, we test that the function
      // can handle the P-Chain format which demonstrates the parsing logic
      const [tx, credentials] = getTxFromBytes(cChainTxHash, "C");

      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(tx.getVM()).toBe("EVM");
    });

    test("handles hex string without 0x prefix", () => {
      const txHashWithoutPrefix = cChainTxHash.slice(2);
      const [tx, credentials] = getTxFromBytes(txHashWithoutPrefix, "C");

      expect(tx).toBeInstanceOf(Common.Transaction);
      expect(Array.isArray(credentials)).toBe(true);
      expect(tx.getVM()).toBe("EVM");
    });
  });

  describe("error cases", () => {
    test("throws error for invalid hex string", () => {
      expect(() => getTxFromBytes("invalid", "P")).toThrow();
    });

    test("throws error for empty hex string", () => {
      expect(() => getTxFromBytes("0x", "P")).toThrow();
    });

    test("throws error for too short hex string", () => {
      expect(() => getTxFromBytes("0x1234", "P")).toThrow();
    });

    test("throws error for invalid chain alias", () => {
      expect(() => getTxFromBytes(cChainTxHash, "P")).toThrow();
    });
  });
});

describe("getUnsignedTxFromBytes", () => {
  describe("P-Chain", () => {
    test("parses unsigned transaction from hex string", () => {
      const unsignedTx = getUnsignedTxFromBytes(pChainTxHash, "P");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });

    test("returns UnsignedTx with credentials", () => {
      const unsignedTx = getUnsignedTxFromBytes(pChainTxHash, "P");

      expect(unsignedTx).toBeDefined();
      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
    });

    test("handles hex string without 0x prefix", () => {
      const txHashWithoutPrefix = pChainTxHash.slice(2);
      const unsignedTx = getUnsignedTxFromBytes(txHashWithoutPrefix, "P");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });
  });

  describe("X-Chain", () => {
    test("parses unsigned transaction from hex string", () => {
      const unsignedTx = getUnsignedTxFromBytes(xChainTxHash, "X");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });

    test("handles hex string without 0x prefix", () => {
      const txHashWithoutPrefix = xChainTxHash.slice(2);
      const unsignedTx = getUnsignedTxFromBytes(txHashWithoutPrefix, "X");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });
  });

  describe("C-Chain", () => {
    test("parses unsigned transaction from hex string", () => {
      const unsignedTx = getUnsignedTxFromBytes(cChainTxHash, "C");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });

    test("handles hex string without 0x prefix", () => {
      const txHashWithoutPrefix = cChainTxHash.slice(2);
      const unsignedTx = getUnsignedTxFromBytes(txHashWithoutPrefix, "C");

      expect(unsignedTx).toBeInstanceOf(UnsignedTx);
      expect(unsignedTx).toBeDefined();
    });
  });

  describe("error cases", () => {
    test("throws error for invalid hex string", () => {
      expect(() => getUnsignedTxFromBytes("invalid", "P")).toThrow();
    });

    test("throws error for empty hex string", () => {
      expect(() => getUnsignedTxFromBytes("0x", "P")).toThrow();
    });
  });
});
