import { evmSerial } from "@avalabs/avalanchejs";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareImportTxnParameters } from ".";
import { testContext } from "../fixtures/testContext";
import { getCChainMockServer } from "../fixtures/transactions/cChain";
import { account1 } from "../fixtures/transactions/common";
import { getChainIdFromAlias } from "../utils";

const cChainWorker = getCChainMockServer({});

describe("prepareImportTxn", () => {
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
    const mockTxParams: PrepareImportTxnParameters = {
      sourceChain: "P",
      toAddress: "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
      context: testContext,
    };

    const txnRequest = await walletClient.cChain.prepareImportTxn(mockTxParams);
    const fee = BigInt(11230);

    const allOutputAmounts = (
      txnRequest.tx.getTx() as evmSerial.ImportTx
    ).Outs.reduce((acc, output) => acc + output.amount.value(), 0n);

    const allInputAmounts = (
      txnRequest.tx.getTx() as evmSerial.ImportTx
    ).importedInputs.reduce((acc, i) => acc + i.amount(), 0n);

    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(fee);
  });

  it("should create correct import tx details", async () => {
    const mockTxParams: PrepareImportTxnParameters = {
      sourceChain: "P",
      toAddress: "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
      context: testContext,
    };
    const txnRequest = await walletClient.cChain.prepareImportTxn(mockTxParams);
    expect(
      (txnRequest.tx.getTx() as evmSerial.ImportTx).sourceChain.value(),
      "source chain mismatch"
    ).toBe(
      getChainIdFromAlias(mockTxParams.sourceChain, testContext.networkID)
    );
  });

  it("should create correct tx hash", async () => {
    const mockTxParams: PrepareImportTxnParameters = {
      sourceChain: "P",
      toAddress: "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
      context: testContext,
    };
    const txnRequest = await walletClient.cChain.prepareImportTxn(mockTxParams);
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toEqual(
      "0x000000000000000000050427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652000000000000000000000000000000000000000000000000000000000000000000000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca0000000001000000000000000176dd3d7b2f635c2547b861e55ae8a374e587742d000000003b9a9e2221e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000010000000900000001628d7030028dcd9df01f97e94a693a845866fd81aba7c9d3e738f1ef92dbe2d870650fc3ac27da99ee05043d84ef0163000aa086b3e1786e9dd6717859f4b9c4013674ef32"
    );
  });
});
