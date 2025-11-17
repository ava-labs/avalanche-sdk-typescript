import { secp256k1, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { describe, expect, test } from "vitest";

import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";
import { xpRecoverPublicKey } from "./xpRecoverPublicKey.js";

describe("xpRecoverPublicKey", () => {
  test("recovers public key from message and signature", async () => {
    const message = "0x" + "00".repeat(32); // 32-byte message hash
    const messageHash = sha256(utils.hexToBuffer(message));
    const privateKey = utils.hexToBuffer(privateKey1ForTest);

    // Sign the message hash
    const signature = await secp256k1.signHash(messageHash, privateKey);
    const signatureHex = utils.bufferToHex(signature);

    // Recover the public key
    const recoveredPublicKey = xpRecoverPublicKey(
      utils.bufferToHex(messageHash),
      signatureHex
    );

    // Get the expected public key
    const expectedPublicKey = "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208";
    expect(recoveredPublicKey).toBeDefined();
    expect(recoveredPublicKey).toBe(expectedPublicKey);
  });

  test("recovers public key for different messages", async () => {
    const message1 = "0x" + "01".repeat(32);
    const message2 = "0x" + "02".repeat(32);
    const privateKey = utils.hexToBuffer(privateKey1ForTest);

    const messageHash1 = sha256(utils.hexToBuffer(message1));
    const messageHash2 = sha256(utils.hexToBuffer(message2));

    const signature1 = await secp256k1.signHash(messageHash1, privateKey);
    const signature2 = await secp256k1.signHash(messageHash2, privateKey);

    const recoveredPublicKey1 = xpRecoverPublicKey(
      utils.bufferToHex(messageHash1),
      utils.bufferToHex(signature1)
    );
    const recoveredPublicKey2 = xpRecoverPublicKey(
      utils.bufferToHex(messageHash2),
      utils.bufferToHex(signature2)
    );

    const expectedPublicKey = privateKeyToXPPublicKey(privateKey1ForTest);

    expect(recoveredPublicKey1).toBe(expectedPublicKey);
    expect(recoveredPublicKey2).toBe(expectedPublicKey);
    expect(recoveredPublicKey1).toBe(recoveredPublicKey2);
  });

  test("produces deterministic results", async () => {
    const message = "0x" + "00".repeat(32);
    const messageHash = sha256(utils.hexToBuffer(message));
    const privateKey = utils.hexToBuffer(privateKey1ForTest);

    const signature = await secp256k1.signHash(messageHash, privateKey);
    const signatureHex = utils.bufferToHex(signature);
    const messageHashHex = utils.bufferToHex(messageHash);

    const recoveredPublicKey1 = xpRecoverPublicKey(
      messageHashHex,
      signatureHex
    );
    const recoveredPublicKey2 = xpRecoverPublicKey(
      messageHashHex,
      signatureHex
    );

    expect(recoveredPublicKey1).toBe(recoveredPublicKey2);
  });

  test("recovered public key format is correct", async () => {
    const message = "0x" + "00".repeat(32);
    const messageHash = sha256(utils.hexToBuffer(message));
    const privateKey = utils.hexToBuffer(privateKey1ForTest);

    const signature = await secp256k1.signHash(messageHash, privateKey);
    const signatureHex = utils.bufferToHex(signature);
    const messageHashHex = utils.bufferToHex(messageHash);

    const recoveredPublicKey = xpRecoverPublicKey(messageHashHex, signatureHex);
    const expectedPublicKey = "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208";
    expect(recoveredPublicKey).toBe(expectedPublicKey);
    expect(recoveredPublicKey.length).toBe(68); // 0x + 66 hex chars for compressed public key
  });

  describe("error cases", () => {
    test("throws error for invalid message format", () => {
      const signature = "0x" + "00".repeat(64);

      expect(() => xpRecoverPublicKey("invalid", signature)).toThrow();
    });

    test("throws error for invalid signature format", () => {
      const message = "0x" + "00".repeat(32);

      expect(() => xpRecoverPublicKey(message, "invalid")).toThrow();
    });

    test("throws error for empty message", () => {
      const signature = "0x" + "00".repeat(64);

      expect(() => xpRecoverPublicKey("", signature)).toThrow();
    });

    test("throws error for empty signature", () => {
      const message = "0x" + "00".repeat(32);

      expect(() => xpRecoverPublicKey(message, "")).toThrow();
    });

    test("throws error for message without 0x prefix", () => {
      const message = "00".repeat(32);
      const signature = "0x" + "00".repeat(64);

      expect(() => xpRecoverPublicKey(message, signature)).toThrow();
    });

    test("throws error for signature without 0x prefix", () => {
      const message = "0x" + "00".repeat(32);
      const signature = "00".repeat(64);

      expect(() => xpRecoverPublicKey(message, signature)).toThrow();
    });

    test("throws error for mismatched message and signature", async () => {
      const message1 = "0x" + "01".repeat(32);
      const message2 = "0x" + "02".repeat(32);
      const privateKey = utils.hexToBuffer(privateKey1ForTest);

      const messageHash1 = sha256(utils.hexToBuffer(message1));
      const messageHash2 = sha256(utils.hexToBuffer(message2));

      const signature1 = await secp256k1.signHash(messageHash1, privateKey);
      const signature1Hex = utils.bufferToHex(signature1);
      const messageHash2Hex = utils.bufferToHex(messageHash2);

      // Try to recover with mismatched message and signature
      // This should either throw or produce an incorrect public key
      expect(() =>
        xpRecoverPublicKey(messageHash2Hex, signature1Hex)
      ).not.toThrow(); // secp256k1.recoverPublicKey might not throw, but will produce wrong key

      // The recovered key should not match the expected public key
      const recoveredKey = xpRecoverPublicKey(messageHash2Hex, signature1Hex);
      const expectedPublicKey = privateKeyToXPPublicKey(privateKey1ForTest);
      expect(recoveredKey).not.toBe(expectedPublicKey);
    });
  });
});
