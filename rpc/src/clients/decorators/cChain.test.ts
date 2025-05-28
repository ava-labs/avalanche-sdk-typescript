import { createTransport, EIP1193RequestFn } from "viem";
import { expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { cChainActions } from "./cChain.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        // TODO: add proper responses for the rest of the methods
        // The default case is just a placeholder to satisfy the test
        default:
          return {
            result: {
              someKey: 1,
            },
          };
      }
    }) as unknown as EIP1193RequestFn,
    type: "mock",
  });

const client = createAvalancheCoreClient({
  chain: avalanche,
  transport: mockTransport,
});

const cChainClient = cChainActions(client);

test("default", async () => {
  expect(cChainClient).toMatchInlineSnapshot(`{
  "getAtomicTx": [Function],
  "getAtomicTxStatus": [Function],
  "getUTXOs": [Function],
  "issueTx": [Function],
}`);
});
