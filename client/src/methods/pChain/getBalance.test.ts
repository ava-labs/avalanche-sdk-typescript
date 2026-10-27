import { createTransport, EIP1193RequestFn } from "viem";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  test,
  vi,
} from "vitest";
import { avalancheFuji } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { buildUtxoBytes } from "../../utils/buildUtxoBytes.js";
import { getBalance } from "./getBalance.js";
import type { GetBalanceReturnType } from "./types/getBalance.js";

const NOW = 1_800_000_000;
const AVAX = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
const OTHER_ASSET = "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z";
const PRIMARY_NETWORK_ID = "11111111111111111111111111111111LpoYY";
const ADDRESS = "P-fuji15jqujkeksqtdlc90524ehf5tz77arc3vnfdkl6";
const TX_ID = "Mo9TnvrRSoippmEtLqkTyP8p8GX1oZTtF43Xxuk2qVqM1PTS8";

function utxo(
  outputIndex: number,
  amount: number,
  { assetID = AVAX, locktime = 0, stakeableLocktime = 0 } = {}
) {
  return buildUtxoBytes(
    TX_ID,
    outputIndex,
    assetID,
    String(amount),
    [ADDRESS],
    String(locktime),
    1,
    String(stakeableLocktime)
  );
}

type Page = {
  numFetched: string;
  utxos: string[];
  endIndex: { address: string; utxo: string };
};

let pages: Page[];
let stakingAssetID: string;

const mockRequest = vi.fn(async ({ method }: { method: string }) => {
  if (method === "platform.getStakingAssetID") {
    return { assetID: stakingAssetID };
  }
  if (method === "platform.getUTXOs") {
    const page = pages.shift();
    if (page === undefined) {
      throw new Error("no more pages");
    }
    return { ...page, encoding: "hex" };
  }
  throw new Error(`Unexpected method: ${method}`);
});

const client = createAvalancheBaseClient({
  chain: avalancheFuji,
  transport: () =>
    createTransport({
      key: "mock",
      name: "Mock Transport",
      request: mockRequest as unknown as EIP1193RequestFn,
      type: "mock",
    }),
});

function onePage(utxos: string[]): Page[] {
  return [
    {
      numFetched: String(utxos.length),
      utxos,
      endIndex: { address: ADDRESS, utxo: TX_ID },
    },
  ];
}

describe("getBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW * 1000);
    stakingAssetID = AVAX;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("sorts UTXOs into buckets with the rules of platform.getBalance", async () => {
    pages = onePage([
      // TransferOutput without a locktime: unlocked.
      utxo(0, 100),
      // TransferOutput locked after now: locked, not stakeable.
      utxo(1, 200, { locktime: NOW + 1 }),
      // TransferOutput with locktime now: unlocked.
      utxo(2, 1, { locktime: NOW }),
      // StakeableLockOut locked after now: locked, stakeable.
      utxo(3, 300, { stakeableLocktime: NOW + 1 }),
      // StakeableLockOut with locktime now: unlocked.
      utxo(4, 400, { stakeableLocktime: NOW }),
      // StakeableLockOut unlocked, inner output locked: locked, not stakeable.
      utxo(5, 500, { stakeableLocktime: NOW - 1, locktime: NOW + 1 }),
      // Not AVAX: only in the per-asset maps.
      utxo(6, 7, { assetID: OTHER_ASSET }),
    ]);

    const result = await getBalance(client, { addresses: [ADDRESS] });

    expect(result).toEqual({
      balance: 1501n,
      unlocked: 501n,
      lockedStakeable: 300n,
      lockedNotStakeable: 700n,
      balances: { [AVAX]: "1501", [OTHER_ASSET]: "7" },
      unlockeds: { [AVAX]: "501", [OTHER_ASSET]: "7" },
      lockedStakeables: { [AVAX]: "300" },
      lockedNotStakeables: { [AVAX]: "700" },
      utxoIDs: [0, 1, 2, 3, 4, 5, 6].map((outputIndex) => ({
        txID: TX_ID,
        outputIndex,
      })),
    });
    expectTypeOf(result).toEqualTypeOf<GetBalanceReturnType>();
  });

  test("calls platform.getUTXOs and platform.getStakingAssetID, not platform.getBalance", async () => {
    pages = onePage([utxo(0, 100)]);

    await getBalance(client, { addresses: [ADDRESS] });

    const methods = mockRequest.mock.calls.map(([args]) => args.method);
    expect(methods.sort()).toEqual([
      "platform.getStakingAssetID",
      "platform.getUTXOs",
    ]);
    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getStakingAssetID",
      params: { subnetID: PRIMARY_NETWORK_ID },
    });
    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getUTXOs",
      params: { addresses: [ADDRESS], encoding: "hex" },
    });
  });

  test("reads the next page while a page has 1024 UTXOs, and counts a UTXO on 2 pages once", async () => {
    const endIndex = { address: ADDRESS, utxo: TX_ID };
    pages = [
      { numFetched: "1024", utxos: [utxo(0, 100), utxo(1, 200)], endIndex },
      {
        numFetched: "2",
        utxos: [utxo(1, 200), utxo(2, 300)],
        endIndex: { address: ADDRESS, utxo: TX_ID },
      },
    ];

    const result = await getBalance(client, { addresses: [ADDRESS] });

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getUTXOs",
      params: { addresses: [ADDRESS], encoding: "hex", startIndex: endIndex },
    });
    expect(result.unlocked).toBe(600n);
    expect(result.utxoIDs).toEqual([
      { txID: TX_ID, outputIndex: 0 },
      { txID: TX_ID, outputIndex: 1 },
      { txID: TX_ID, outputIndex: 2 },
    ]);
  });

  test("uses the staking asset of the Primary Network for the top-level amounts", async () => {
    stakingAssetID = OTHER_ASSET;
    pages = onePage([utxo(0, 100), utxo(1, 7, { assetID: OTHER_ASSET })]);

    const result = await getBalance(client, { addresses: [ADDRESS] });

    expect(result.balance).toBe(7n);
    expect(result.unlocked).toBe(7n);
  });

  test("returns 0 for an empty address list without calling platform.getUTXOs", async () => {
    pages = [];

    const result = await getBalance(client, { addresses: [] });

    expect(result).toEqual({
      balance: 0n,
      unlocked: 0n,
      lockedStakeable: 0n,
      lockedNotStakeable: 0n,
      balances: {},
      unlockeds: {},
      lockedStakeables: {},
      lockedNotStakeables: {},
      utxoIDs: [],
    });
    const methods = mockRequest.mock.calls.map(([args]) => args.method);
    expect(methods).not.toContain("platform.getUTXOs");
  });
});
