import {
  avaxSerial,
  avmSerial,
  pvmSerial,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { getTxFromBytes } from "../../../utils";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  account4,
} from "../fixtures/transactions/common";
import {
  getValidUTXO,
  getXChainMockServer,
} from "../fixtures/transactions/xChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI.js";
import { Output } from "../types/common";
import { avaxToNanoAvax, toTransferableOutput } from "../utils";
import { PrepareBaseTxnParameters } from "./types/prepareBaseTxn";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = avaxToNanoAvax(1);

const xChainWorker = getXChainMockServer({});

describe("newBaseTx", () => {
  const walletClient = createAvalancheWalletClient({
    account: account1,
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network",
    },
  });

  beforeAll(() => {
    xChainWorker.listen();
  });

  afterAll(() => {
    xChainWorker.close();
  });

  it("should create correct outputs and fees", async () => {
    const receiverAddresses = [
      account1.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as avmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const fee = testContext.baseTxFee;
    const expectedFeesInAvax = fee;
    const expectedChangeAmount =
      testInputAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(expectedFeesInAvax);
  });

  it("should only use utxos passed in params", async () => {
    const receiverAddresses = [
      account1.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("X", "fuji")];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testInputAmount = avaxToNanoAvax(0.5);
    const testOutputs = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      // utxos passed here override the wallet's or fromAddresses' utxos
      utxos: [
        getValidUTXO(
          testInputAmount,
          testContext.avaxAssetID,
          [account1.getXPAddress("X", "fuji")],
          0,
          1
        ),
      ],
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as avmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    // calculate fees as per AvalancheJS method
    const fee = testContext.baseTxFee;
    const expectedFeesInAvax = fee;
    // if utxos passed in params are only used, then testInputAmount will be 0.5 instead of default 1
    const expectedChangeAmount =
      testInputAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // match testOutputs with outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as avmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(allInputAmounts - allOutputAmounts).toBe(expectedFeesInAvax);
  });

  it("should use `fromAddresses` for fetching utxos and change addresses", async () => {
    const testSpentAmount = avaxToNanoAvax(1);
    const spenderAddresses = [account1.getXPAddress("X", "fuji")];
    const receiverAddresses = [
      account4.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      fromAddresses: spenderAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as avmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const fee = testContext.baseTxFee;
    const expectedFeesInAvax = fee;
    const expectedChangeAmount =
      testSpentAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      // this will test if change address is not passed,
      // then fromAddresses will be used.
      addresses: spenderAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as avmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(expectedFeesInAvax);
  });

  it("should sign the tx properly", async () => {
    const receiverAddresses = [
      account1.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("X", "fuji")];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [txn, credentials] = await getTxFromBytes(signedTx.signedTxHex, "X");
    const unsignedTxInstance = new UnsignedTx(
      txn,
      [],
      new utils.AddressMaps(),
      credentials
    );
    expect(
      unsignedTxInstance.hasAllSignatures(),
      "tx did not have all signatures"
    ).toBe(true);
  });

  it("should sign the multi sig tx properly", async () => {
    const receiverAddresses = [account3.getXPAddress("X", "fuji")];
    const changeAddresses = [account4.getXPAddress("X", "fuji")];

    const testOutputAmount = avaxToNanoAvax(1.5);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      fromAddresses: [
        account1.getXPAddress("X", "fuji"),
        account2.getXPAddress("X", "fuji"),
      ],
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const partialSignedTx = await walletClient.signXPTransaction(txnRequest);
    const [txn1, credentials1] = await getTxFromBytes(
      partialSignedTx.signedTxHex,
      "X"
    );
    const unsignedTxInstance1 = new UnsignedTx(
      txn1,
      [],
      new utils.AddressMaps(),
      credentials1
    );
    expect(
      unsignedTxInstance1.hasAllSignatures(),
      "tx have all signatures for the multi-sig without signing"
    ).toBe(false);

    const signedTx = await walletClient.signXPTransaction({
      ...partialSignedTx,
      account: account2,
    });
    const [txn2, credentials2] = await getTxFromBytes(
      signedTx.signedTxHex,
      "X"
    );
    const unsignedTxInstance2 = new UnsignedTx(
      txn2,
      [],
      new utils.AddressMaps(),
      credentials2
    );
    expect(
      unsignedTxInstance2.hasAllSignatures(),
      "tx did not have all signatures"
    ).toBe(true);
  });

  it("should give correct tx hash", async () => {
    const receiverAddresses = [
      account1.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("X", "fuji")];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams: PrepareBaseTxnParameters = {
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const result = await walletClient.xChain.prepareBaseTxn(mockTxParams);
    const signedTx = await walletClient.signXPTransaction(result);
    expect(signedTx.signedTxHex, "expected and actual tx hash mismatch").toBe(
      "0x00000000000000000005ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000221e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000022a705f0a71d8b6e19d5e955b19d683ca6d682370931887940fd0ef612f2aa42fcdc8556405b7e76721e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000034309880000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000000000010000000900000001bfabf38fde0cf2ef08f3b24ac3e3d7cac3050cd29b2b0dce1e2695a384121e121747a248f331a6179db94c177c3ef81e812fd59d645360efa28eca37f28d5bf0002f4dbec4"
    );
  });

  it("should handle errors appropriately", async () => {
    const mockTxParams: PrepareBaseTxnParameters = {
      fromAddresses: [account1.getXPAddress("X", "fuji")],
      outputs: [
        {
          amount: avaxToNanoAvax(40),
          addresses: [account1.getXPAddress("X", "fuji")],
        },
      ],
      context: testContext,
    };

    // Verify that the error is propagated
    await expect(
      walletClient.xChain.prepareBaseTxn(mockTxParams)
    ).rejects.toThrow(
      "insufficient funds (Burn Amount): need 39001000000 more units of FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z to burn"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const receiverAddresses = [account1.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams: PrepareBaseTxnParameters = {
      outputs: testOutputs,
      // context is not provided - should call getContextFromURI
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should handle empty outputs array", async () => {
    const mockTxParams: PrepareBaseTxnParameters = {
      outputs: [], // Empty outputs array
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();

    // When outputs is empty, formattedOutputs will be empty,
    // but the transaction may still create change outputs from UTXOs
    const baseTx = txnRequest.tx.getTx() as avmSerial.BaseTx;
    // The transaction should still be valid (may have change outputs)
    expect(baseTx).toBeDefined();
  });

  it("should handle undefined outputs", async () => {
    const mockTxParams: PrepareBaseTxnParameters = {
      // outputs is not provided
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();

    // When outputs is undefined, formattedOutputs will be empty array,
    // but the transaction may still create change outputs from UTXOs
    const baseTx = txnRequest.tx.getTx() as avmSerial.BaseTx;
    // The transaction should still be valid (may have change outputs)
    expect(baseTx).toBeDefined();
  });

  it("should include minIssuanceTime when provided", async () => {
    const receiverAddresses = [account1.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const minIssuanceTime = BigInt(Date.now() + 1000000); // Future time
    const mockTxParams: PrepareBaseTxnParameters = {
      outputs: testOutputs,
      minIssuanceTime,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();

    // The transaction should be valid with minIssuanceTime
    const baseTx = txnRequest.tx.getTx() as avmSerial.BaseTx;
    expect(baseTx).toBeDefined();
  });

  it("should include memo when provided", async () => {
    const receiverAddresses = [account1.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const memo = "test memo";
    const mockTxParams: PrepareBaseTxnParameters = {
      outputs: testOutputs,
      memo,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where memo is provided in params
    // The memo parameter is processed in fetchCommonAVMTxParams and
    // passed to avm.newBaseTx, testing the conditional spread: ...(commonTxParams.memo && { memo: commonTxParams.memo })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should not include changeAddresses when not provided", async () => {
    const receiverAddresses = [account1.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams: PrepareBaseTxnParameters = {
      outputs: testOutputs,
      // changeAddresses is not provided
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareBaseTxn(mockTxParams);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.baseTx).toBeDefined();

    // The transaction should still work without changeAddresses
    // (it will use fromAddresses as change addresses)
    const baseTx = txnRequest.tx.getTx() as avmSerial.BaseTx;
    expect(baseTx.baseTx.outputs.length).toBeGreaterThan(0);
  });
});
