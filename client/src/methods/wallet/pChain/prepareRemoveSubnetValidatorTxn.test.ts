import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareRemoveSubnetValidatorTxnParameters } from ".";
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

describe("prepareRemoveSubnetValidatorTxn", () => {
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

    const mockTxParams: PrepareRemoveSubnetValidatorTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      subnetAuth: [0],
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest =
      await walletClient.pChain.prepareRemoveSubnetValidatorTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx() as pvmSerial.BaseTx,
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
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should create correct validator removal details", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareRemoveSubnetValidatorTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      subnetAuth: [0],
      context: testContext,
    };

    const txnRequest =
      await walletClient.pChain.prepareRemoveSubnetValidatorTxn(mockTxParams);

    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.RemoveSubnetValidatorTx
      ).nodeId.value(),
      "nodeId mismatch"
    ).toBe(mockTxParams.nodeId);
    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.RemoveSubnetValidatorTx
      ).subnetId.value(),
      "subnetId mismatch"
    ).toBe(mockTxParams.subnetId);
    expect(
      (txnRequest.tx.getTx() as pvmSerial.RemoveSubnetValidatorTx)
        .getSubnetAuth()
        .values(),
      "subnetAuth mismatch"
    ).deep.equal(mockTxParams.subnetAuth);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareRemoveSubnetValidatorTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      subnetAuth: [0],
      context: testContext,
    };

    const txnRequest =
      await walletClient.pChain.prepareRemoveSubnetValidatorTxn(mockTxParams);
    const result = await walletClient.signXPTransaction(txnRequest);

    expect(result.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000170000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac6b5000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000d6fb5ded320a43a674fc4fe007c631532ce7a9b09d27db382a254d2ac9908dafa65f0eb4cebc8dce746fd2bf0f759e61509d618f0000000a0000000100000000000000020000000900000001f3010628f41d21a00ccb6ee5aed59f05428de08aef58659843cf682c417483cc286962914261d81fb597ae752cdc35a1fe800729b9b2ce588e31c0836ec6694e010000000900000001f3010628f41d21a00ccb6ee5aed59f05428de08aef58659843cf682c417483cc286962914261d81fb597ae752cdc35a1fe800729b9b2ce588e31c0836ec6694e0188353d4a"
    );
  });
});
