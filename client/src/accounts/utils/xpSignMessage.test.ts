import { expect, test } from "vitest";

import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { xpSignMessage } from "./xpSignMessage.js";

test("sign message", async () => {
  const signature = await xpSignMessage("hello world", privateKey1ForTest);
  expect(signature).toBeDefined();
  expect(typeof signature).toBe("string");
  expect(signature.length).toBeGreaterThan(0);
});

test("sign empty message", async () => {
  const signature = await xpSignMessage("", privateKey1ForTest);
  expect(signature).toBeDefined();
  expect(typeof signature).toBe("string");
});

test("deterministic signature", async () => {
  const message = "test message";
  const signature1 = await xpSignMessage(message, privateKey1ForTest);
  const signature2 = await xpSignMessage(message, privateKey1ForTest);
  expect(signature1).toBe(signature2);
});

test("different messages produce different signatures", async () => {
  const signature1 = await xpSignMessage("message 1", privateKey1ForTest);
  const signature2 = await xpSignMessage("message 2", privateKey1ForTest);
  expect(signature1).not.toBe(signature2);
});
