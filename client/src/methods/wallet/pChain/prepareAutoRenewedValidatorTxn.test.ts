import {
  Address,
  avaxSerial,
  BigIntPr,
  Id,
  Int,
  NodeId,
  OutputOwners,
  pvmSerial,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { HttpResponse } from "msw";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { avaxToNanoAvax, getTxFromBytes } from "../../../utils";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  account4,
  popSignatureHex,
} from "../fixtures/transactions/common";
import { getPChainMockServer } from "../fixtures/transactions/pChain";
import { getContextFromURI } from "../getContextFromURI";
import { useAvalancheGoAddAutoRenewedValidatorTxSerialization } from "./addAutoRenewedValidatorTxCompat";

vi.mock("../getContextFromURI.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../getContextFromURI.js")>();
  return {
    ...actual,
    getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
  };
});

const blsPublicKey =
  "0x85025bca6a302dc61338ff49c8baa572ded3e86f3759304c7f618a2a2593c187e080a3cfdec95040309ad1f158953067";
const validatorTxId = "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH";

const makeMockAddAutoRenewedValidatorTx = (
  bytes: Uint8Array,
  baseTxLength: number,
  weightBytes = bytes.slice(-20, -12),
) =>
  ({
    baseTx: {
      toBytes: vi.fn(() => new Uint8Array(baseTxLength)),
    },
    toBytes: vi.fn(() => bytes),
    weight: {
      toBytes: vi.fn(() => weightBytes),
    },
  }) as unknown as pvmSerial.AddAutoRenewedValidatorTx;

const getAddAutoRenewedValidatorTxHex = () => {
  const ownerAddress = Address.fromString(account1.getXPAddress("P", "fuji"));
  const owner = new OutputOwners(new BigIntPr(0n), new Int(1), [ownerAddress]);
  const addAutoRenewedValidatorTx = new pvmSerial.AddAutoRenewedValidatorTx(
    avaxSerial.BaseTx.fromNative(
      testContext.networkID,
      testContext.pBlockchainID,
      [],
      [],
      new Uint8Array(),
    ),
    NodeId.fromString("NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ"),
    new pvmSerial.Signer(
      new pvmSerial.ProofOfPossession(
        utils.hexToBuffer(blsPublicKey),
        utils.hexToBuffer(popSignatureHex),
      ),
    ),
    [],
    owner,
    owner,
    owner,
    new Int(20_000),
    new BigIntPr(avaxToNanoAvax(2000)),
    new Int(300_000),
    new BigIntPr(1209600n),
  );

  return utils.bufferToHex(
    utils.addChecksum(
      new avaxSerial.SignedTx(addAutoRenewedValidatorTx, []).toBytes(),
    ),
  );
};

const getRewardAutoRenewedValidatorTxHex = () =>
  utils.bufferToHex(
    utils.addChecksum(
      new avaxSerial.SignedTx(
        new pvmSerial.RewardAutoRenewedValidatorTx(
          Id.fromString(validatorTxId),
          new BigIntPr(1780576200n),
        ),
        [],
      ).toBytes(),
    ),
  );

let getTxCalls = 0;
let getCurrentValidatorsCalls = 0;
let getTxHex = getAddAutoRenewedValidatorTxHex;
let currentValidators: any[] = [
  {
    txID: validatorTxId,
    validatorAuthority: {
      locktime: "0",
      threshold: "1",
      addresses: [account1.getXPAddress("P", "fuji")],
    },
  },
];
let getCurrentValidatorsError: HttpResponse<any> | undefined;

const pChainWorker = getPChainMockServer({
  overrideMocker: {
    "platform.getTx": (reqBody) => {
      getTxCalls += 1;
      return HttpResponse.json({
        jsonrpc: "2.0",
        result: {
          tx: getTxHex(),
          encoding: reqBody?.["params"]?.["encoding"] || "hex",
        },
        id: reqBody?.["id"] || 1,
      });
    },
    "platform.getCurrentValidators": (reqBody) => {
      getCurrentValidatorsCalls += 1;
      if (getCurrentValidatorsError) {
        return getCurrentValidatorsError;
      }
      return HttpResponse.json({
        jsonrpc: "2.0",
        result: {
          validators: currentValidators,
        },
        id: reqBody?.["id"] || 1,
      });
    },
  },
});

describe("auto-renewed validator P-Chain transactions", () => {
  const walletClient = createAvalancheWalletClient({
    account: account1,
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network",
    },
  });

  beforeAll(() => {
    pChainWorker.listen();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getTxCalls = 0;
    getCurrentValidatorsCalls = 0;
    getTxHex = getAddAutoRenewedValidatorTxHex;
    getCurrentValidatorsError = undefined;
    currentValidators = [
      {
        txID: validatorTxId,
        validatorAuthority: {
          locktime: "0",
          threshold: "1",
          addresses: [account1.getXPAddress("P", "fuji")],
        },
      },
    ];
  });

  afterAll(() => {
    pChainWorker.close();
  });

  it("prepares add auto-renewed validator transaction details", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const ownerAddresses = [account4.getXPAddress("P", "fuji")];

    const txnRequest =
      await walletClient.pChain.prepareAddAutoRenewedValidatorTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        stakeInNanoAvax: avaxToNanoAvax(0.5),
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        period: 1209600n,
        rewardAddresses,
        delegatorRewardAddresses,
        ownerAddresses,
        publicKey: blsPublicKey,
        signature: popSignatureHex,
        delegatorRewardPercentage: 2.5,
        autoCompoundRewardPercentage: 30,
        context: testContext,
      });

    const tx = txnRequest.addAutoRenewedValidatorTx;
    const toFujiAddresses = (owner: OutputOwners) =>
      owner.addrs.map((addr) => addr.toString("fuji"));

    expect(tx.nodeId.value(), "nodeId mismatch").toBe(
      "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
    );
    expect(
      Array.from(tx.signer.proof.publicKey),
      "BLS public key mismatch",
    ).toEqual(Array.from(utils.hexToBuffer(blsPublicKey)));
    expect(
      Array.from(tx.signer.proof.signature),
      "BLS proof of possession mismatch",
    ).toEqual(Array.from(utils.hexToBuffer(popSignatureHex)));
    expect(tx.weight.value(), "weight mismatch").toBe(avaxToNanoAvax(0.5));
    expect(tx.shares.value(), "delegation shares mismatch").toBe(25_000);
    expect(
      tx.autoCompoundRewardShares.value(),
      "auto-compound shares mismatch",
    ).toBe(300_000);
    expect(tx.period.value(), "period mismatch").toBe(1209600n);
    expect(
      toFujiAddresses(tx.getValidatorRewardsOwner()),
      "validation reward owner addresses mismatch",
    ).toEqual(rewardAddresses.map((addr) => addr.replace("P-", "")));
    expect(
      tx.getDelegatorRewardsOwner().locktime.value(),
      "delegation reward owner locktime mismatch",
    ).toBe(0n);
    expect(
      tx.getDelegatorRewardsOwner().threshold.value(),
      "delegation reward owner threshold mismatch",
    ).toBe(1);
    expect(
      toFujiAddresses(tx.getDelegatorRewardsOwner()),
      "delegation reward owner addresses mismatch",
    ).toEqual(delegatorRewardAddresses.map((addr) => addr.replace("P-", "")));
    expect(
      tx.getOwner().locktime.value(),
      "validator authority locktime mismatch",
    ).toBe(0n);
    expect(
      tx.getOwner().threshold.value(),
      "validator authority threshold mismatch",
    ).toBe(1);
    expect(toFujiAddresses(tx.getOwner()), "owner addresses mismatch").toEqual(
      ownerAddresses.map((addr) => addr.replace("P-", "")),
    );
    expect(
      tx.getValidatorRewardsOwner().locktime.value(),
      "validation reward owner locktime mismatch",
    ).toBe(0n);
    expect(
      tx.getValidatorRewardsOwner().threshold.value(),
      "validation reward owner threshold mismatch",
    ).toBe(1);

    const codec = utils.getManagerForVM("PVM").getDefaultCodec();
    const txBytes = tx.toBytes(codec);
    const baseTxLength = tx.baseTx.toBytes(codec).length;
    expect(
      Array.from(txBytes.slice(baseTxLength, baseTxLength + 4)),
      "nodeID length prefix mismatch",
    ).toEqual([0, 0, 0, 20]);
    expect(
      Array.from(txBytes.slice(-16)),
      "auto-renewed validator tail mismatch",
    ).toEqual([
      ...Array.from(tx.shares.toBytes()),
      ...Array.from(tx.autoCompoundRewardShares.toBytes()),
      ...Array.from(tx.period.toBytes()),
    ]);

    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex, "signed tx hex mismatch").toMatch(/^0x/);
  });

  it("does not double-patch add auto-renewed validator serialization", () => {
    const tx = makeMockAddAutoRenewedValidatorTx(
      new Uint8Array([
        1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 20, 11, 12, 13, 14, 15, 16, 17, 18, 21,
        22, 23, 24, 25, 26, 27, 28,
      ]),
      8,
    );

    useAvalancheGoAddAutoRenewedValidatorTxSerialization(tx);
    const patchedToBytes = tx.toBytes;
    useAvalancheGoAddAutoRenewedValidatorTxSerialization(tx);

    expect(tx.toBytes).toBe(patchedToBytes);
  });

  it("keeps defensive add auto-renewed serialization branches stable", () => {
    const tooShortTx = makeMockAddAutoRenewedValidatorTx(
      new Uint8Array([1, 2, 3]),
      0,
    );
    useAvalancheGoAddAutoRenewedValidatorTxSerialization(tooShortTx);
    expect(Array.from(tooShortTx.toBytes({} as any))).toEqual([
      0, 0, 0, 20, 1, 2, 3,
    ]);

    const mismatchedWeightTx = makeMockAddAutoRenewedValidatorTx(
      new Uint8Array([
        1, 2, 3, 4, 0, 0, 0, 20, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24,
        25, 26, 27, 28,
      ]),
      4,
      new Uint8Array([99, 99, 99, 99, 99, 99, 99, 99]),
    );
    useAvalancheGoAddAutoRenewedValidatorTxSerialization(mismatchedWeightTx);
    expect(Array.from(mismatchedWeightTx.toBytes({} as any))).toEqual([
      1, 2, 3, 4, 0, 0, 0, 20, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24,
      25, 26, 27, 28,
    ]);
  });

  it("prepares and signs set auto-renewed validator config transaction", async () => {
    const txnRequest =
      await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      });

    const tx = txnRequest.setAutoRenewedValidatorConfigTx;
    expect(tx.txId.value(), "validator txID mismatch").toBe(validatorTxId);
    expect(tx.getAuth().values(), "auth mismatch").toEqual([0]);
    expect(
      tx.autoCompoundRewardShares.value(),
      "auto-compound shares mismatch",
    ).toBe(250_000);
    expect(tx.period.value(), "period mismatch").toBe(604800n);
    expect(txnRequest.autoRenewedValidatorOwners.addresses).toHaveLength(1);
    expect(
      txnRequest.autoRenewedValidatorOwners.addresses.map((addr) =>
        addr.toString("fuji"),
      ),
    ).toEqual([account1.getXPAddress("P", "fuji").replace("P-", "")]);
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(0);

    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [parsedTx, credentials] = getTxFromBytes(signedTx.signedTxHex, "P");
    expect(pvmSerial.isSetAutoRenewedValidatorConfigTx(parsedTx)).toBe(true);
    const unsignedTx = new UnsignedTx(
      parsedTx,
      [],
      new utils.AddressMaps(),
      credentials,
    );
    expect(unsignedTx.hasAllSignatures(), "transaction is not signed").toBe(
      true,
    );
  });

  it("prepares set auto-renewed validator config with unprefixed current-validator authority", async () => {
    currentValidators = [
      {
        txID: validatorTxId,
        validatorAuthority: {
          locktime: "0",
          threshold: "1",
          addresses: [account1.getXPAddress("P", "fuji").replace("P-", "")],
        },
      },
    ];

    const txnRequest =
      await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      });

    expect(
      txnRequest.autoRenewedValidatorOwners.addresses.map((addr) =>
        addr.toString("fuji"),
      ),
    ).toEqual([account1.getXPAddress("P", "fuji").replace("P-", "")]);
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(0);
  });

  it("uses validatorAuthority instead of reward owners from current validators", async () => {
    currentValidators = [
      {
        txID: validatorTxId,
        validationRewardOwner: {
          locktime: "0",
          threshold: "1",
          addresses: [account2.getXPAddress("P", "fuji")],
        },
        delegationRewardOwner: {
          locktime: "0",
          threshold: "1",
          addresses: [account3.getXPAddress("P", "fuji")],
        },
        validatorAuthority: {
          locktime: "0",
          threshold: "1",
          addresses: [account4.getXPAddress("P", "fuji")],
        },
      },
    ];

    const txnRequest =
      await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      });

    expect(
      txnRequest.autoRenewedValidatorOwners.addresses.map((addr) =>
        addr.toString("fuji"),
      ),
    ).toEqual([account4.getXPAddress("P", "fuji").replace("P-", "")]);
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(0);
  });

  it("falls back to the original add tx for set auto-renewed validator config owners", async () => {
    currentValidators = [];

    const txnRequest =
      await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      });

    expect(txnRequest.autoRenewedValidatorOwners.addresses).toHaveLength(1);
    expect(
      txnRequest.autoRenewedValidatorOwners.addresses.map((addr) =>
        addr.toString("fuji"),
      ),
    ).toEqual([account1.getXPAddress("P", "fuji").replace("P-", "")]);
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(1);
  });

  it("falls back to the original add tx when current validator authority is missing", async () => {
    currentValidators = [
      {
        txID: validatorTxId,
      },
    ];

    const txnRequest =
      await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      });

    expect(
      txnRequest.autoRenewedValidatorOwners.addresses.map((addr) =>
        addr.toString("fuji"),
      ),
    ).toEqual([account1.getXPAddress("P", "fuji").replace("P-", "")]);
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(1);
  });

  it("rejects set auto-renewed validator config when current validator lookup fails", async () => {
    getCurrentValidatorsError = HttpResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "current validators unavailable",
        },
        id: 1,
      },
      { status: 500 },
    );

    await expect(
      walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      }),
    ).rejects.toThrow();
    expect(getCurrentValidatorsCalls).toBeGreaterThan(0);
    expect(getTxCalls).toBe(0);
  });

  it("rejects malformed current-validator authority addresses", async () => {
    currentValidators = [
      {
        txID: validatorTxId,
        validatorAuthority: {
          locktime: "0",
          threshold: "1",
          addresses: ["not-an-address"],
        },
      },
    ];

    await expect(
      walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      }),
    ).rejects.toThrow();
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(0);
  });

  it("throws when set auto-renewed validator config owners are not found", async () => {
    currentValidators = [];
    getTxHex = getRewardAutoRenewedValidatorTxHex;

    await expect(
      walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [account1.getXPAddress("P", "fuji")],
        validatorTxId,
        auth: [0],
        period: 604800n,
        autoCompoundRewardPercentage: 25,
        context: testContext,
      }),
    ).rejects.toThrow("Auto-renewed validator owners not found");
    expect(getCurrentValidatorsCalls).toBe(1);
    expect(getTxCalls).toBe(1);
  });

  it("prepares reward auto-renewed validator issue-ready hex", async () => {
    const txnRequest =
      await walletClient.pChain.prepareRewardAutoRenewedValidatorTxn({
        validatorTxId,
        timestamp: 1780576200n,
      });

    expect(
      txnRequest.rewardAutoRenewedValidatorTx.txId.value(),
      "validator txID mismatch",
    ).toBe(validatorTxId);
    expect(
      txnRequest.rewardAutoRenewedValidatorTx.timestamp.value(),
      "timestamp mismatch",
    ).toBe(1780576200n);
    expect(txnRequest.chainAlias).toBe("P");

    const [parsedTx, credentials] = getTxFromBytes(txnRequest.txHex, "P");
    expect(pvmSerial.isRewardAutoRenewedValidatorTx(parsedTx)).toBe(true);
    expect(credentials).toHaveLength(0);
  });
});
