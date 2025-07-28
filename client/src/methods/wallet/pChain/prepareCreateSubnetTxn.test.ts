import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareCreateSubnetTxnParameters } from ".";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  feeState,
  getPChainMockServer,
} from "../fixtures/txns";
import { checkOutputs } from "../fixtures/utils";
import { Output } from "../types/common";
import { toTransferableOutput } from "../utils";
const testInputAmount = 1;
const pChainWorker = getPChainMockServer({});

describe("createSubnetTx", () => {
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

    const mockTxParams: PrepareCreateSubnetTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetOwners: {
        addresses: [account2.getXPAddress("P", "fuji")],
        threshold: 1,
      },
      context: testContext,
    };
    const testOutputs: Output[] = [];
    const txnRequest = await walletClient.pChain.prepareCreateSubnetTxn(
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
    const allInputAmounts = (txnRequest.tx.getTx() as pvmSerial.CreateSubnetTx)
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

    const mockTxParams: PrepareCreateSubnetTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetOwners: {
        addresses: [
          account2.getXPAddress("P", "fuji"),
          account3.getXPAddress("P", "fuji"),
        ],
        threshold: 2,
      },
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareCreateSubnetTxn(
      mockTxParams
    );

    expect(
      (txnRequest.tx.getTx() as pvmSerial.CreateSubnetTx)
        .getSubnetOwners()
        .addrs.map((addr) => `P-${addr.toString("fuji")}`),
      "subnetOwners addresses mismatch"
    ).deep.equal(mockTxParams.subnetOwners.addresses);
    expect(
      (txnRequest.tx.getTx() as pvmSerial.CreateSubnetTx)
        .getSubnetOwners()
        .threshold.value(),
      "subnetOwners threshold mismatch"
    ).toBe(mockTxParams.subnetOwners.threshold);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareCreateSubnetTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetOwners: {
        addresses: [account2.getXPAddress("P", "fuji")],
        threshold: 1,
      },
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareCreateSubnetTxn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex).toBe(
      "0x0000000000100000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac7e1000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000000000000b000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001000000090000000162cbe8a825bca9de2cffb07c91469088b0c996454f1a5d25b91ef8713a4a340a2f27d5b3e7028bc59610c02b3a45596531c979725aec0784f708f5b1c273f8230110713565"
    );
  });
});
