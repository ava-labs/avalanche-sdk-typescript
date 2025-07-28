import { pvm, pvmSerial, UnsignedTx, utils } from "@avalabs/avalanchejs";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { getTxFromBytes } from "src/utils";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareDisableL1ValidatorTxnParameters } from ".";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  feeState,
  getPChainMockServer,
} from "../fixtures/txns";
import { checkOutputs } from "../fixtures/utils";
import { Output } from "../types/common";
import { toTransferableOutput } from "../utils";
const testInputAmount = 1;
const pChainWorker = getPChainMockServer({});

describe("prepareDisableL1ValidatorTxn", () => {
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
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareDisableL1ValidatorTxnParameters = {
      changeAddresses,
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      disableAuth: [0],
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest = await walletClient.pChain.prepareDisableL1ValidatorTxn(
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
    const expectedFeesInAvax = Number(fee) / 1e9;
    const expectedChangeAmount = testInputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

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
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should create correct validator removal details", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareDisableL1ValidatorTxnParameters = {
      changeAddresses,
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      disableAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareDisableL1ValidatorTxn(
      mockTxParams
    );
    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.DisableL1ValidatorTx
      ).validationId.value(),
      "validationId mismatch"
    ).toBe(mockTxParams.validationId);
    expect(
      (txnRequest.tx.getTx() as pvmSerial.DisableL1ValidatorTx)
        .getDisableAuth()
        .values(),
      "disableAuth mismatch"
    ).deep.equal(mockTxParams.disableAuth);
  });

  it("should correctly sign inputs and subnet auth", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareDisableL1ValidatorTxnParameters = {
      changeAddresses,
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      disableAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareDisableL1ValidatorTxn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [tx, credential] = getTxFromBytes(signedTx.signedTxHex, "P");
    const unsignedTxInstance = new UnsignedTx(
      tx,
      [],
      new utils.AddressMaps(),
      credential
    );
    expect(
      unsignedTxInstance.hasAllSignatures(),
      "transaction is not signed"
    ).toBe(true);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareDisableL1ValidatorTxnParameters = {
      changeAddresses,
      validationId: "FFqpTFRtYPDgHFCEd2n8KQQVnH2FC9j9vdjU5Vx1mHTCkYkAu",
      disableAuth: [0],
      context: testContext,
    };
    const result = await walletClient.pChain.prepareDisableL1ValidatorTxn(
      mockTxParams
    );

    const signedTx = await walletClient.signXPTransaction(result);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000270000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac6c6000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000205ea79c5dc94dad746094efc72799c012c5f656247f1a6ff3bedffbc7529e310000000a00000001000000000000000200000009000000012bbc07dfe0e5e2300d04f4963ca4ef2838c3047985aa165599aab6fe9d9c44753cdb27f6f7d505ebb341c741b75b0ae9d42ca7f6b8053e23e25147474c7aebfa0100000009000000012bbc07dfe0e5e2300d04f4963ca4ef2838c3047985aa165599aab6fe9d9c44753cdb27f6f7d505ebb341c741b75b0ae9d42ca7f6b8053e23e25147474c7aebfa010a28bf0c"
    );
  });
});
