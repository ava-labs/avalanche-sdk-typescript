import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareIncreaseL1ValidatorBalanceTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  feeState,
} from "../fixtures/transactions/common";
import { getPChainMockServer } from "../fixtures/transactions/pChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI";
import { Output } from "../types/common";
import { avaxToNanoAvax, toTransferableOutput } from "../utils";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = 1;

const pChainWorker = getPChainMockServer({});

describe("prepareIncreaseL1ValidatorBalanceTxn", () => {
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

  it("should create correct change outputs and fees", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareIncreaseL1ValidatorBalanceTxnParameters = {
      changeAddresses,
      balanceInAvax: avaxToNanoAvax(0.123),
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest =
      await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn(
        mockTxParams
      );
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const totalBurnedAmount = fee + mockTxParams.balanceInAvax;
    const expectedChangeAmount =
      avaxToNanoAvax(testInputAmount) - totalBurnedAmount;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // check change outputs
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
    ).toBe(totalBurnedAmount);
  });

  it("should create correct increase balance details", async () => {
    const changeAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const mockTxParams: PrepareIncreaseL1ValidatorBalanceTxnParameters = {
      changeAddresses,
      balanceInAvax: avaxToNanoAvax(0.123),
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn(
        mockTxParams
      );

    // check tx details
    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.IncreaseL1ValidatorBalanceTx
      ).balance.value(),
      "balance mismatch"
    ).toBe(mockTxParams.balanceInAvax);
    expect(
      utils.base58check.encode(
        (
          txnRequest.tx.getTx() as pvmSerial.IncreaseL1ValidatorBalanceTx
        ).validationId.toBytes()
      ),
      "validationId mismatch"
    ).toBe(mockTxParams.validationId);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareIncreaseL1ValidatorBalanceTxnParameters = {
      changeAddresses,
      balanceInAvax: avaxToNanoAvax(0.123),
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn(
        mockTxParams
      );
    const signedTx = await walletClient.signXPTransaction(txnRequest);

    expect(signedTx.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000260000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003445f31c000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000205ea79c5dc94dad746094efc72799c012c5f656247f1a6ff3bedffbc7529e31000000000754d4c000000001000000090000000173014942fe05fbd3d99cf4c648e69a8ef5f98a5773c71dadce9975accbae38c546de487c331c0c570bb2861ba573c556d05f5d27ea1d05d0040169c039f9dafb01f5b7ed3a"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const txnRequest =
      await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn({
        changeAddresses,
        balanceInAvax: avaxToNanoAvax(0.123),
        validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
        // context is not provided - should call getContextFromURI
      });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.increaseL1ValidatorBalanceTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });
});
