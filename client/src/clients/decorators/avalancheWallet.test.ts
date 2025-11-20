import { beforeEach, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";
import { avalancheWalletActions } from "./avalancheWallet.js";

// Mock all the underlying functions
vi.mock("../../methods/wallet/sendXPTransaction.js", () => ({
  sendXPTransaction: vi.fn(),
}));

vi.mock("../../methods/wallet/signXPMessage.js", () => ({
  signXPMessage: vi.fn(),
}));

vi.mock("../../methods/wallet/signXPTransaction.js", () => ({
  signXPTransaction: vi.fn(),
}));

vi.mock("../../methods/wallet/getAccountPubKey.js", () => ({
  getAccountPubKey: vi.fn(),
}));

vi.mock("../../methods/wallet/waitForTxn.js", () => ({
  waitForTxn: vi.fn(),
}));

vi.mock("../../methods/wallet/send.js", () => ({
  send: vi.fn(),
}));

import { getAccountPubKey } from "../../methods/wallet/getAccountPubKey.js";
import { send } from "../../methods/wallet/send.js";
import { sendXPTransaction } from "../../methods/wallet/sendXPTransaction.js";
import { signXPMessage } from "../../methods/wallet/signXPMessage.js";
import { signXPTransaction } from "../../methods/wallet/signXPTransaction.js";
import { waitForTxn } from "../../methods/wallet/waitForTxn.js";

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const avalancheWalletClient = avalancheWalletActions(client);

beforeEach(() => {
  vi.clearAllMocks();
});

test("default", async () => {
  expect(avalancheWalletClient).toMatchInlineSnapshot(`{
  "getAccountPubKey": [Function],
  "send": [Function],
  "sendXPTransaction": [Function],
  "signXPMessage": [Function],
  "signXPTransaction": [Function],
  "waitForTxn": [Function],
}`);
});

test("sendXPTransaction calls underlying function with correct parameters", async () => {
  const mockParams = {
    tx: "0x123456",
    chainAlias: "P" as const,
  };
  const mockReturn = {
    txHash: "0xabcdef",
    chainAlias: "P" as const,
  };

  vi.mocked(sendXPTransaction).mockResolvedValueOnce(mockReturn);

  const result = await avalancheWalletClient.sendXPTransaction(mockParams);

  expect(sendXPTransaction).toHaveBeenCalledTimes(1);
  expect(sendXPTransaction).toHaveBeenCalledWith(client, mockParams);
  expect(result).toEqual(mockReturn);
});

test("signXPMessage calls underlying function with correct parameters", async () => {
  const mockParams = {
    message: "Hello Avalanche",
    address: "X-avax1test",
  };
  const mockReturn = {
    signature: "0xsigned",
  };

  vi.mocked(signXPMessage).mockResolvedValueOnce(mockReturn);

  const result = await avalancheWalletClient.signXPMessage(mockParams);

  expect(signXPMessage).toHaveBeenCalledTimes(1);
  expect(signXPMessage).toHaveBeenCalledWith(client, mockParams);
  expect(result).toEqual(mockReturn);
});

test("signXPTransaction calls underlying function with correct parameters", async () => {
  const mockParams = {
    tx: "0x123456",
    chainAlias: "X" as const,
  };
  const mockReturn = {
    signedTxHex: "0xsigned",
    signatures: [
      {
        signature: "0xsig",
        sigIndices: [0, 1],
      },
    ],
    chainAlias: "X" as const,
  };

  vi.mocked(signXPTransaction).mockResolvedValueOnce(mockReturn);

  const result = await avalancheWalletClient.signXPTransaction(mockParams);

  expect(signXPTransaction).toHaveBeenCalledTimes(1);
  expect(signXPTransaction).toHaveBeenCalledWith(client, mockParams);
  expect(result).toEqual(mockReturn);
});

test("getAccountPubKey calls underlying function with correct parameters", async () => {
  const mockReturn = {
    evm: "0xevmpublickey",
    xp: "0xxppublickey",
  };

  vi.mocked(getAccountPubKey).mockResolvedValueOnce(mockReturn);

  const result = await avalancheWalletClient.getAccountPubKey();

  expect(getAccountPubKey).toHaveBeenCalledTimes(1);
  expect(getAccountPubKey).toHaveBeenCalledWith(client);
  expect(result).toEqual(mockReturn);
});

test("waitForTxn calls underlying function with correct parameters", async () => {
  const mockParams = {
    txHash: "0x123456",
    chainAlias: "P" as const,
  };

  vi.mocked(waitForTxn).mockResolvedValueOnce(undefined);

  await avalancheWalletClient.waitForTxn(mockParams);

  expect(waitForTxn).toHaveBeenCalledTimes(1);
  expect(waitForTxn).toHaveBeenCalledWith(client, mockParams);
});

test("send calls underlying function with correct parameters", async () => {
  const mockParams = {
    amount: 1000000000000000000n,
    to: "0x0000000000000000000000000000000000000000",
  };
  const mockReturn = {
    txHashes: [
      {
        txHash: "0xexport",
        chainAlias: "P" as const,
      },
      {
        txHash: "0ximport",
        chainAlias: "C" as const,
      },
    ],
  };

  vi.mocked(send).mockResolvedValueOnce(mockReturn);

  const result = await avalancheWalletClient.send(mockParams);

  expect(send).toHaveBeenCalledTimes(1);
  expect(send).toHaveBeenCalledWith(client, mockParams);
  expect(result).toEqual(mockReturn);
});
