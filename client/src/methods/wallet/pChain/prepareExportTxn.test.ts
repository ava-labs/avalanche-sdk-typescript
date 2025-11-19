import { pvm, pvmSerial } from "@avalabs/avalanchejs";
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
  feeState,
} from "../fixtures/transactions/common";
import { getPChainMockServer } from "../fixtures/transactions/pChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI";
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

const pChainWorker = getPChainMockServer({});

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
    pChainWorker.listen();
  });

  afterAll(() => {
    pChainWorker.close();
  });

  it("should create correct outputs and fees", async () => {
    const receiverAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const receiverAddresses2 = [account4.getXPAddress("P", "fuji")];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

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

    const txnRequest = await walletClient.pChain.prepareExportTxn(mockTxParams);
    const outputs = [
      ...(txnRequest.tx.getTx() as pvmSerial.ExportTx).outs,
      ...(txnRequest.tx.getTx() as pvmSerial.BaseTx).baseTx.outputs,
    ].map(toTransferableOutput);

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
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
    const allInputAmounts = (txnRequest.tx.getTx() as pvmSerial.BaseTx)
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
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

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
    const txnRequestCChain = await walletClient.pChain.prepareExportTxn(
      mockTxParamsCChain
    );

    const mockTxParamsXChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "X",
      context: testContext,
    };
    const txnRequestXChain = await walletClient.pChain.prepareExportTxn(
      mockTxParamsXChain
    );

    expect(
      (txnRequestCChain.tx.getTx() as pvmSerial.ExportTx).destination.value(),
      "expected destination chain mismatch for c-chain export tx"
    ).toBe(
      getChainIdFromAlias(
        mockTxParamsCChain.destinationChain,
        testContext.networkID
      )
    );

    expect(
      (txnRequestXChain.tx.getTx() as pvmSerial.ExportTx).destination.value(),
      "expected destination chain mismatch for x-chain export tx"
    ).toBe(
      getChainIdFromAlias(
        mockTxParamsXChain.destinationChain,
        testContext.networkID
      )
    );
  });

  it("should create correct tx hash", async () => {
    const receiverAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

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
    const txnRequestCChain = await walletClient.pChain.prepareExportTxn(
      mockTxParamsCChain
    );
    const signedCChainExportTx = await walletClient.signXPTransaction(
      txnRequestCChain
    );
    const mockTxParamsXChain: PrepareExportTxnParameters = {
      changeAddresses: changeAddresses,
      exportedOutputs: testOutputs,
      destinationChain: "X",
      context: testContext,
    };
    const txnRequestXChain = await walletClient.pChain.prepareExportTxn(
      mockTxParamsXChain
    );
    const signedXChainExportTx = await walletClient.signXPTransaction(
      txnRequestXChain
    );

    expect(
      signedCChainExportTx.signedTxHex,
      "expected c-chain export tx hash mismatch"
    ).toBe(
      "0x0000000000120000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000343fd841000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000007fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d50000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e767000000010000000900000001d70408529946e01b942a20d19a6b81a026094d0d9de1b5ac7d9b8492430af3830a91e2355fdf6374e3b8446d35c7d222f6525db22b01838931767d575c11c6ac01b2e48c44"
    );

    expect(
      signedXChainExportTx.signedTxHex,
      "expected x-chain export tx hash mismatch"
    ).toBe(
      "0x0000000000120000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000343fd841000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000ab68eb1ee142a05cfe768c36e11f0b596db5a3c6c77aabe665dad9e638ca94f70000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e7670000000100000009000000014ed80a1ee47328317b5bb1b67776a057bfee112abf6d6ec1aa49a2f514eba4b938a5afb31e6864b68e22e1422ed84c91b973f5210a329e0d7af020f7252125b60115106a40"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const receiverAddresses = [account2.getXPAddress("P", "fuji")];
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

    const txnRequest = await walletClient.pChain.prepareExportTxn(mockTxParams);

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });

  it("should handle single exported output", async () => {
    const receiverAddress = account2.getXPAddress("P", "fuji");
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: [receiverAddress], // Single address
      },
    ];
    const mockTxParams: PrepareExportTxnParameters = {
      exportedOutputs: testOutputs,
      destinationChain: "C",
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareExportTxn(mockTxParams);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.exportTx).toBeDefined();

    // Verify exported outputs exist
    const exportTx = txnRequest.tx.getTx() as pvmSerial.ExportTx;
    expect(exportTx.outs.length).toBeGreaterThan(0);
  });
});
