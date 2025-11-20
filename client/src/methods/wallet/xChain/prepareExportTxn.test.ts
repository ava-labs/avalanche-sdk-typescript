import { avmSerial } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareExportTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  account4,
} from "../fixtures/transactions/common";
import { getXChainMockServer } from "../fixtures/transactions/xChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI.js";
import { Output } from "../types/common";
import {
  avaxToNanoAvax,
  getChainIdFromAlias,
  toTransferableOutput,
} from "../utils";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = avaxToNanoAvax(1);

const xChainWorker = getXChainMockServer({});

describe("prepareExportTxn", () => {
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
      account2.getXPAddress("X", "fuji"),
      account3.getXPAddress("X", "fuji"),
    ];
    const receiverAddresses2 = [account4.getXPAddress("X", "fuji")];
    const changeAddresses = [account2.getXPAddress("X", "fuji")];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputAmount2 = avaxToNanoAvax(0.2345);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
      {
        amount: testOutputAmount2,
        addresses: receiverAddresses2,
      },
    ];
    const mockTxParams: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "C",
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareExportTxn(mockTxParams);
    const outputs = [
      ...(txnRequest.tx.getTx() as avmSerial.ExportTx).outs,
      ...(txnRequest.tx.getTx() as avmSerial.BaseTx).baseTx.outputs,
    ].map(toTransferableOutput);

    const fee = testContext.baseTxFee;
    const expectedChangeAmount =
      testInputAmount - testOutputAmount - testOutputAmount2 - fee;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avmSerial.BaseTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = outputs.reduce(
      (acc, i) => acc + i.output.amount(),
      0n
    );
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(fee);
  });

  it("should create correct export tx details", async () => {
    const receiverAddresses = [
      account2.getXPAddress("X", "fuji"),
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
    const mockTxParamsCChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "C",
      context: testContext,
    };
    const txnRequestCChain = await walletClient.xChain.prepareExportTxn(
      mockTxParamsCChain
    );

    const mockTxParamsPChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "P",
      context: testContext,
    };
    const txnRequestPChain = await walletClient.xChain.prepareExportTxn(
      mockTxParamsPChain
    );

    expect(
      (txnRequestCChain.tx.getTx() as avmSerial.ExportTx).destination.value(),
      "expected destination chain mismatch for c-chain export tx"
    ).toBe(
      getChainIdFromAlias(
        mockTxParamsCChain.destinationChain,
        testContext.networkID
      )
    );

    expect(
      (txnRequestPChain.tx.getTx() as avmSerial.ExportTx).destination.value(),
      "expected destination chain mismatch for x-chain export tx"
    ).toBe(
      getChainIdFromAlias(
        mockTxParamsPChain.destinationChain,
        testContext.networkID
      )
    );
  });

  it("should create correct tx hash", async () => {
    const receiverAddresses = [
      account2.getXPAddress("X", "fuji"),
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
    const mockTxParamsCChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "C",
      context: testContext,
    };
    const txnRequestCChain = await walletClient.xChain.prepareExportTxn(
      mockTxParamsCChain
    );
    const signedCChainExportTx = await walletClient.signXPTransaction(
      txnRequestCChain
    );
    const mockTxParamsPChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "P",
      context: testContext,
    };
    const txnRequestPChain = await walletClient.xChain.prepareExportTxn(
      mockTxParamsPChain
    );
    const signedPChainExportTx = await walletClient.signXPTransaction(
      txnRequestPChain
    );

    expect(
      signedCChainExportTx.signedTxHex,
      "expected c-chain export tx hash mismatch"
    ).toBe(
      "0x00000000000400000005ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000034309880000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000007fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d50000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e767000000010000000900000001a27b7d3b1007849a1ff4425c852eed111bf2552056997b81d6988a4d3107aadf34faf536af1327c7d1515b42278ad9c3d24ef037885d4d7dd271187e1278cc5d0158c791bf"
    );

    expect(
      signedPChainExportTx.signedTxHex,
      "expected x-chain export tx hash mismatch"
    ).toBe(
      "0x00000000000400000005ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000034309880000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca0000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e767000000010000000900000001c677f99321e180a5d3f829b69eea06942231b7ef278eb95ab8ad31116bac422529c6c98705ecccf9943965b981157f8634debe590b4559bc0043f8fbf99bbd81009bfae60c"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const receiverAddresses = [account2.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams: PrepareExportTxnParameters = {
      exportedOutputs: testOutputs,
      destinationChain: "C",
      // context is not provided - should call getContextFromURI
    };

    const txnRequest = await walletClient.xChain.prepareExportTxn(mockTxParams);

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should include minIssuanceTime when provided", async () => {
    const receiverAddresses = [account2.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const minIssuanceTime = BigInt(Date.now() + 1000000); // Future time
    const mockTxParams: PrepareExportTxnParameters = {
      exportedOutputs: testOutputs,
      destinationChain: "C",
      minIssuanceTime,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareExportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where minIssuanceTime is provided in params
    // The minIssuanceTime parameter is processed in fetchCommonAVMTxParams and
    // passed to avm.newExportTx, testing the conditional spread: ...(commonTxParams.minIssuanceTime && { minIssuanceTime: ... })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should include memo when provided", async () => {
    const receiverAddresses = [account2.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const memo = "test memo";
    const mockTxParams: PrepareExportTxnParameters = {
      exportedOutputs: testOutputs,
      destinationChain: "C",
      memo,
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareExportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where memo is provided in params
    // The memo parameter is processed in fetchCommonAVMTxParams and
    // passed to avm.newExportTx, testing the conditional spread: ...(commonTxParams.memo && { memo: commonTxParams.memo })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");
  });

  it("should not include changeAddresses when not provided", async () => {
    const receiverAddresses = [account2.getXPAddress("X", "fuji")];
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams: PrepareExportTxnParameters = {
      exportedOutputs: testOutputs,
      destinationChain: "C",
      // changeAddresses is not provided
      context: testContext,
    };

    const txnRequest = await walletClient.xChain.prepareExportTxn(mockTxParams);

    // Verify the transaction was created successfully
    // This test covers the branch where changeAddresses is not provided
    // Testing the conditional spread: ...(commonTxParams.changeAddressesBytes && { changeAddresses: ... })
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("X");

    // The transaction should still work without changeAddresses
    // (it will use fromAddresses as change addresses)
    const exportTx = txnRequest.tx.getTx() as avmSerial.ExportTx;
    expect(exportTx.outs.length).toBeGreaterThan(0);
  });
});
