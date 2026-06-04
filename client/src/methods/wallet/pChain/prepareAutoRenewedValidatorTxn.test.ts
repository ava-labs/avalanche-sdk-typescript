import {
  Address,
  avaxSerial,
  BigIntPr,
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

vi.mock("../getContextFromURI.js", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../getContextFromURI.js")
  >();
  return {
    ...actual,
    getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
  };
});

const blsPublicKey =
  "0x85025bca6a302dc61338ff49c8baa572ded3e86f3759304c7f618a2a2593c187e080a3cfdec95040309ad1f158953067";
const validatorTxId = "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH";

const getAddAutoRenewedValidatorTxHex = () => {
  const ownerAddress = Address.fromString(account1.getXPAddress("P", "fuji"));
  const owner = new OutputOwners(new BigIntPr(0n), new Int(1), [
    ownerAddress,
  ]);
  const addAutoRenewedValidatorTx =
    new pvmSerial.AddAutoRenewedValidatorTx(
      avaxSerial.BaseTx.fromNative(
        testContext.networkID,
        testContext.pBlockchainID,
        [],
        [],
        new Uint8Array()
      ),
      NodeId.fromString("NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ"),
      new pvmSerial.Signer(
        new pvmSerial.ProofOfPossession(
          utils.hexToBuffer(blsPublicKey),
          utils.hexToBuffer(popSignatureHex)
        )
      ),
      [],
      owner,
      owner,
      owner,
      new Int(20_000),
      new BigIntPr(avaxToNanoAvax(2000)),
      new Int(300_000),
      new BigIntPr(1209600n)
    );

  return utils.bufferToHex(
    utils.addChecksum(
      new avaxSerial.SignedTx(addAutoRenewedValidatorTx, []).toBytes()
    )
  );
};

const pChainWorker = getPChainMockServer({
  overrideMocker: {
    "platform.getTx": (reqBody) =>
      HttpResponse.json({
        jsonrpc: "2.0",
        result: {
          tx: getAddAutoRenewedValidatorTxHex(),
          encoding: reqBody?.["params"]?.["encoding"] || "hex",
        },
        id: reqBody?.["id"] || 1,
      }),
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
    expect(tx.nodeId.value(), "nodeId mismatch").toBe(
      "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ"
    );
    expect(tx.weight.value(), "weight mismatch").toBe(avaxToNanoAvax(0.5));
    expect(tx.shares.value(), "delegation shares mismatch").toBe(25_000);
    expect(
      tx.autoCompoundRewardShares.value(),
      "auto-compound shares mismatch"
    ).toBe(300_000);
    expect(tx.period.value(), "period mismatch").toBe(1209600n);
    expect(
      tx.getOwner().addrs.map((addr) => addr.toString("fuji")),
      "owner addresses mismatch"
    ).toEqual(ownerAddresses.map((addr) => addr.replace("P-", "")));
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
      "auto-compound shares mismatch"
    ).toBe(250_000);
    expect(tx.period.value(), "period mismatch").toBe(604800n);
    expect(txnRequest.autoRenewedValidatorOwners.addresses).toHaveLength(1);

    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [parsedTx, credentials] = getTxFromBytes(signedTx.signedTxHex, "P");
    const unsignedTx = new UnsignedTx(
      parsedTx,
      [],
      new utils.AddressMaps(),
      credentials
    );
    expect(unsignedTx.hasAllSignatures(), "transaction is not signed").toBe(
      true
    );
  });

  it("prepares reward auto-renewed validator issue-ready hex", async () => {
    const txnRequest =
      await walletClient.pChain.prepareRewardAutoRenewedValidatorTxn({
        validatorTxId,
        timestamp: 1780576200n,
      });

    expect(
      txnRequest.rewardAutoRenewedValidatorTx.txId.value(),
      "validator txID mismatch"
    ).toBe(validatorTxId);
    expect(
      txnRequest.rewardAutoRenewedValidatorTx.timestamp.value(),
      "timestamp mismatch"
    ).toBe(1780576200n);

    const [parsedTx, credentials] = getTxFromBytes(txnRequest.txHex, "P");
    expect(pvmSerial.isRewardAutoRenewedValidatorTx(parsedTx)).toBe(true);
    expect(credentials).toHaveLength(0);
  });
});
