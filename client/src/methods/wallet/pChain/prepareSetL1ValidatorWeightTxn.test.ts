import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareSetL1ValidatorWeightTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  feeState,
  signedWarpMsgL1ValidatorWeightHex,
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

const testInputAmount = avaxToNanoAvax(1);

const pChainWorker = getPChainMockServer({});

describe("prepareSetL1ValidatorWeightTxn", () => {
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

    const mockTxParams: PrepareSetL1ValidatorWeightTxnParameters = {
      changeAddresses,
      message: signedWarpMsgL1ValidatorWeightHex,
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn(
      mockTxParams
    );
    const outputs = [
      ...(txnRequest.tx.getTx() as pvmSerial.BaseTx).baseTx.outputs,
    ].map(toTransferableOutput);

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const expectedChangeAmount = testInputAmount - fee;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // check change outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.inputs.reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = outputs.reduce(
      (acc, i) => acc + i.output.amount(),
      0n
    );
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(fee);
  });

  it("should create correct increase balance details", async () => {
    const changeAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const mockTxParams: PrepareSetL1ValidatorWeightTxnParameters = {
      changeAddresses,
      message: signedWarpMsgL1ValidatorWeightHex,
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn(
      mockTxParams
    );

    // check tx details
    expect(
      utils.bufferToHex(
        (txnRequest.tx.getTx() as pvmSerial.SetL1ValidatorWeightTx).message
          .bytes
      ),
      "message mismatch"
    ).toBe(mockTxParams.message);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareSetL1ValidatorWeightTxnParameters = {
      changeAddresses,
      message: signedWarpMsgL1ValidatorWeightHex,
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000250000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac30a000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000000000eb0000000000056b804f574b890cf9e0cb0f0f68591a394bba1696cf62b4e576e793d8509cc88600000058000000000001000000140feedc0de0000000000000000000000000000000000000360000000000038ccf9ef520784d2fa5d97fbf098b8b4e82ff19408ec423c2970a522ab04b3a0400000000000000040000000000000029000000000000000106a8206d76cf3fa7d65fec8464b0311dce9283d05bcf0ca7987cdf03a3a2f764691e01df4f6aaa3ff6b52e5b92fd3291e519f3fb50bad5d9697a39e34e2c3e99ea585f0332e9d13b4b6db7ecc58eee44c7f96e64371b1eebaa6f7c45bbf0937e68000000010000000900000001dfa2d698520c792a8fb8bc7b7540e8dd863bf49d2e5683cafed5079907be943716702242ce7d844233ec8661b41903547e18898fcfe9bd8dca45219b8b00f54d006bbc8eac"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn(
      {
        changeAddresses,
        message: signedWarpMsgL1ValidatorWeightHex,
        // context is not provided - should call getContextFromURI
      }
    );

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.setL1ValidatorWeightTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });
});
