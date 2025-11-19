import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareRemoveSubnetValidatorTxnParameters } from ".";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import { account1, account2, feeState } from "../fixtures/transactions/common";
import { getPChainMockServer } from "../fixtures/transactions/pChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI.js";
import { Output } from "../types/common";
import { avaxToNanoAvax, toTransferableOutput } from "../utils";
import * as walletUtilsModule from "../utils.js";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));
const testInputAmount = avaxToNanoAvax(1);

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
    const expectedFeesInAvax = fee;
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
    ).toBe(expectedFeesInAvax);
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

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const txnRequest =
      await walletClient.pChain.prepareRemoveSubnetValidatorTxn({
        changeAddresses,
        subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        subnetAuth: [0],
        // context is not provided - should call getContextFromURI
      });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.removeSubnetValidatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
    expect(txnRequest.subnetOwners).toBeDefined();
  });

  it("should throw error when subnetOwners is not found", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    // Mock fetchCommonPVMTxParams to return undefined for subnetOwners
    const fetchCommonPVMTxParamsSpy = vi
      .spyOn(walletUtilsModule, "fetchCommonPVMTxParams")
      .mockResolvedValueOnce({
        commonTxParams: {
          feeState: feeState(),
          fromAddressesBytes: [account2.getXPAddress("P", "fuji")].map(
            walletUtilsModule.bech32AddressToBytes
          ),
          utxos: [],
          memo: new Uint8Array(),
        },
        subnetOwners: undefined, // This will trigger the error
        disableOwners: undefined,
      } as any);

    await expect(
      walletClient.pChain.prepareRemoveSubnetValidatorTxn({
        changeAddresses,
        subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        subnetAuth: [0],
        context: testContext,
      })
    ).rejects.toThrow("Subnet owners not found for a Subnet tx");

    // Restore the original function
    fetchCommonPVMTxParamsSpy.mockRestore();
  });
});
