import { evmSerial } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareExportTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import { getCChainMockServer } from "../fixtures/transactions/cChain";
import { account1, account2, account3 } from "../fixtures/transactions/common";
import { checkOutputs } from "../fixtures/utils";
import {
  avaxToNanoAvax,
  getChainIdFromAlias,
  toTransferableOutput,
} from "../utils";

const cChainWorker = getCChainMockServer({});

describe("prepareExportTxn", () => {
  const walletClient = createAvalancheWalletClient({
    account: account1,
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
  });

  beforeAll(() => {
    cChainWorker.listen();
  });

  afterAll(() => {
    cChainWorker.close();
  });

  it("should create correct outputs and fees", async () => {
    const receiverAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const testOutputs = [
      {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
    ];
    const mockTxParams: PrepareExportTxnParameters = {
      fromAddress: account1.getEVMAddress(),
      exportedOutput: {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
      destinationChain: "P",
      context: testContext,
    };

    const txnRequest = await walletClient.cChain.prepareExportTxn(mockTxParams);
    const outputs = [
      ...(txnRequest.tx.getTx() as evmSerial.ExportTx).exportedOutputs,
    ].map(toTransferableOutput);
    const fee = 1n;

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (
      txnRequest.tx.getTx() as evmSerial.ExportTx
    ).ins.reduce((acc, i) => acc + i.amount.value(), 0n);
    const allOutputAmounts = outputs.reduce(
      (acc, i) => acc + i.output.amount(),
      0n
    );
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual fee amount mismatch"
    ).toBe(fee);
  });

  it("should create correct export tx details", async () => {
    const receiverAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const testOutputAmount = avaxToNanoAvax(0.1234);
    const mockTxParamsPChain: PrepareExportTxnParameters = {
      fromAddress: account1.getEVMAddress(),
      exportedOutput: {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
      destinationChain: "P",
      context: testContext,
    };
    const txnRequestPChain = await walletClient.cChain.prepareExportTxn(
      mockTxParamsPChain
    );

    const mockTxParamsXChain: PrepareExportTxnParameters = {
      fromAddress: account1.getEVMAddress(),
      exportedOutput: {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
      destinationChain: "X",
      context: testContext,
    };
    const txnRequestXChain = await walletClient.cChain.prepareExportTxn(
      mockTxParamsXChain
    );

    expect(
      (
        txnRequestPChain.tx.getTx() as evmSerial.ExportTx
      ).destinationChain.value(),
      "expected destination chain mismatch for p-chain export tx"
    ).toBe(
      getChainIdFromAlias(
        mockTxParamsPChain.destinationChain,
        testContext.networkID
      )
    );

    expect(
      (
        txnRequestXChain.tx.getTx() as evmSerial.ExportTx
      ).destinationChain.value(),
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
    const testOutputAmount = avaxToNanoAvax(0.1234);
    const mockTxParamsPChain: PrepareExportTxnParameters = {
      fromAddress: account1.getEVMAddress(),
      exportedOutput: {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
      destinationChain: "P",
      context: testContext,
    };
    const txnRequestPChain = await walletClient.cChain.prepareExportTxn(
      mockTxParamsPChain
    );
    const signedPChainExportTx = await walletClient.signXPTransaction(
      txnRequestPChain
    );
    const mockTxParamsXChain: PrepareExportTxnParameters = {
      fromAddress: account1.getEVMAddress(),
      exportedOutput: {
        addresses: receiverAddresses,
        amount: testOutputAmount,
      },
      destinationChain: "X",
      context: testContext,
    };
    const txnRequestXChain = await walletClient.cChain.prepareExportTxn(
      mockTxParamsXChain
    );
    const signedXChainExportTx = await walletClient.signXPTransaction(
      txnRequestXChain
    );

    expect(
      signedPChainExportTx.signedTxHex,
      "expected p-chain export tx hash mismatch"
    ).toBe(
      "0x000000000001000000050427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd65200000000000000000000000000000000000000000000000000000000000000000000000176dd3d7b2f635c2547b861e55ae8a374e587742d00000000075aef4121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000000000000010000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e767000000010000000900000001ed0eddbecd84f0a3468eb1db764f32a53f641507795e336e707cc3c98a3a61ed55943774f5cf4dc67fbbe58e0df09d968330f38f3dc6a6657911d11418b0bfc7006f5c4185"
    );

    expect(
      signedXChainExportTx.signedTxHex,
      "expected x-chain export tx hash mismatch"
    ).toBe(
      "0x000000000001000000050427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652ab68eb1ee142a05cfe768c36e11f0b596db5a3c6c77aabe665dad9e638ca94f70000000176dd3d7b2f635c2547b861e55ae8a374e587742d00000000075aef4121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000000000000010000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000075aef40000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c931887940fd0ef612f2aa42fcdc8556405b7e76700000001000000090000000179ccc5b3788d0cbad5cc7f0eeac3956078a313daf2b63fba83d8386ebd76ba110384e072e408b64f2852cfa9e6fd4091c518ee9638d1d4c3dfe0de41ef1f7500005acff1ac"
    );
  });
});
