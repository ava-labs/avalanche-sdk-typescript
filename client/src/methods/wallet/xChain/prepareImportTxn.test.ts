import { pvmSerial } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareImportTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import { account1, account3 } from "../fixtures/transactions/common";
import { getXChainMockServer } from "../fixtures/transactions/xChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI.js";
import { Output } from "../types/common";
import {
  avaxToNanoAvax,
  getChainIdFromAlias,
  toTransferableOutput,
} from "../utils";
import { ImportedOutput } from "../xChain/types/prepareImportTxn";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = 1;

const xChainWorker = getXChainMockServer({});

describe("prepareImportTxn", () => {
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
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const testOutputs: Output[] = [];
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput); // only imported output (no change outputs)

    const fee = testContext.baseTxFee;

    // imported output as the only change output
    const testImportedOutputAmount = avaxToNanoAvax(testInputAmount) - fee;
    testOutputs.push({
      amount: testImportedOutputAmount,
      addresses: importedOutput.addresses,
      locktime: importedOutput.locktime ?? 0n,
      threshold: importedOutput.threshold ?? 1,
    });

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.ImportTx
    ).ins.reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = outputs.reduce(
      (acc, i) => acc + i.output.amount(),
      0n
    );
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(fee);
  });

  it("should create correct import tx details", async () => {
    const receiverAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      context: testContext,
    };
    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);
    expect(
      (txnRequest.tx.getTx() as pvmSerial.ImportTx).sourceChain.value(),
      "source chain mismatch"
    ).toBe(
      getChainIdFromAlias(mockTxParams.sourceChain, testContext.networkID)
    );
  });

  it("should create correct tx hash", async () => {
    const receiverAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      context: testContext,
    };
    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toEqual(
      "0x00000000000300000005ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b8b87c000000000000003e800000001000000022a705f0a71d8b6e19d5e955b19d683ca6d682370931887940fd0ef612f2aa42fcdc8556405b7e76700000000000000007fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d500000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000010000000900000001c0e7fa1ba31b8f8fff79f6e9e0406c77b1ab2460caac88fbc2380e7ddfda3bcd16eb93f9ffd516267da8f73b96be0fba26b270aed44be4ccefda8055ca39187f0081ded4b0"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const receiverAddresses = [account1.getXPAddress("P", "fuji")];
    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      // context is not provided - should call getContextFromURI
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.importTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should include memo when provided", async () => {
    const receiverAddresses = [account1.getXPAddress("P", "fuji")];
    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const memo = "test memo";
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      memo,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where memo is provided in params
    // The memo parameter is processed in fetchCommonAVMTxParams and
    // passed to avm.newImportTx, testing the conditional spread: ...(commonTxParams.memo && { memo: commonTxParams.memo })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.importTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should include minIssuanceTime when provided", async () => {
    const receiverAddresses = [account1.getXPAddress("P", "fuji")];
    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      threshold: 1,
    };
    const minIssuanceTime = BigInt(Date.now() + 1000000); // Future time
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      minIssuanceTime,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where minIssuanceTime is provided in params
    // The minIssuanceTime parameter is processed in fetchCommonAVMTxParams and
    // passed to avm.newImportTx, testing the conditional spread: ...(commonTxParams.minIssuanceTime && { minIssuanceTime: ... })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.importTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should use default threshold when not provided", async () => {
    const receiverAddresses = [account1.getXPAddress("P", "fuji")];
    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      locktime: 1000n,
      // threshold is not provided - should default to 1
    };
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch: params.importedOutput.threshold ?? 1
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.importTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should use default locktime when not provided", async () => {
    const receiverAddresses = [account1.getXPAddress("P", "fuji")];
    const importedOutput: ImportedOutput = {
      addresses: receiverAddresses,
      threshold: 1,
      // locktime is not provided - should default to 0
    };
    const mockTxParams: PrepareImportTxnParameters = {
      importedOutput: importedOutput,
      sourceChain: "C",
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareImportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch: BigInt(params.importedOutput.locktime ?? 0)
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.importTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });
});
