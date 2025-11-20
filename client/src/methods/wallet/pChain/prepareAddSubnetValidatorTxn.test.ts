import { pvm, pvmSerial, UnsignedTx, utils } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { getTxFromBytes } from "../../../utils";
import { testContext } from "../fixtures/testContext";
import { account1, account2, feeState } from "../fixtures/transactions/common";
import { getPChainMockServer } from "../fixtures/transactions/pChain";
import { checkOutputs } from "../fixtures/utils";
import { getContextFromURI } from "../getContextFromURI.js";
import { Output } from "../types/common";
import { avaxToNanoAvax, toTransferableOutput } from "../utils";
import * as walletUtils from "../utils.js";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = avaxToNanoAvax(1);

const pChainWorker = getPChainMockServer({});

describe("addSubnetValidatorTx", () => {
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
    const changeAddresses = [account1.getXPAddress("P", "fuji")];

    const endTime = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days from now
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest = await walletClient.pChain.prepareAddSubnetValidatorTxn(
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
    const expectedFeesInAvax = fee;
    const expectedChangeAmount = testInputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // check change and staked outputs
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
    ).toBe(expectedFeesInAvax);
  });

  it("should create correct staking details", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];

    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      context: testContext,
    };
    const result = await walletClient.pChain.prepareAddSubnetValidatorTxn(
      mockTxParams
    );

    // check staking details
    const vldr = (result.tx.getTx() as pvmSerial.AddSubnetValidatorTx)
      .subnetValidator.validator;
    expect(vldr.nodeId.value(), "nodeId mismatch").toBe(mockTxParams.nodeId);
    expect(vldr.endTime.value(), "endTime mismatch").toBe(
      BigInt(mockTxParams.end)
    );
    expect(vldr.weight.value(), "weight mismatch").toBe(
      BigInt(mockTxParams.weight)
    );
    expect(
      (
        result.tx.getTx() as pvmSerial.AddSubnetValidatorTx
      ).subnetValidator.subnetId.value(),
      "subnetId mismatch"
    ).toBe(mockTxParams.subnetId);
    expect(
      (result.tx.getTx() as pvmSerial.AddSubnetValidatorTx)
        .getSubnetAuth()
        .values(),
      "subnetAuth mismatch"
    ).deep.equal(mockTxParams.subnetAuth);
  });

  it("should correctly sign inputs and subnet auth", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];

    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareAddSubnetValidatorTxn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [txn, credentials] = getTxFromBytes(signedTx.signedTxHex, "P");
    const unsignedTxnInstance = new UnsignedTx(
      txn,
      [],
      new utils.AddressMaps(),
      credentials
    );
    expect(
      unsignedTxnInstance.hasAllSignatures(),
      "transaction is not signed"
    ).toBe(true);
  });

  it("should correctly sign multi-sig subnet auth", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];

    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      context: testContext,
    };
    const result = await walletClient.pChain.prepareAddSubnetValidatorTxn(
      mockTxParams
    );

    const partialSignedTx = await walletClient.signXPTransaction(result);
    const signedTx = await walletClient.signXPTransaction({
      ...partialSignedTx,
      account: account2,
    });
    const [txn, credentials] = getTxFromBytes(signedTx.signedTxHex, "P");
    const unsignedTxnInstance = new UnsignedTx(
      txn,
      [],
      new utils.AddressMaps(),
      credentials
    );
    expect(
      unsignedTxnInstance.hasAllSignatures(),
      "transaction is not signed"
    ).toBe(true);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];

    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      context: testContext,
    };
    const result = await walletClient.pChain.prepareAddSubnetValidatorTxn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(result);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toBe(
      "0x00000000000d0000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac69b000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d68237000000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000d6fb5ded320a43a674fc4fe007c631532ce7a9b00000000000000000000000004992ca2200000000000030399d27db382a254d2ac9908dafa65f0eb4cebc8dce746fd2bf0f759e61509d618f0000000a000000010000000000000002000000090000000192b089f4d0c024c1faff3692d175f8c9c92a1ec55cb5060b3eb48e6e011761af1be0745c02f927997e5db6d058f1c7559e03a9a9da5e78cab605d31baf7ff47900000000090000000192b089f4d0c024c1faff3692d175f8c9c92a1ec55cb5060b3eb48e6e011761af1be0745c02f927997e5db6d058f1c7559e03a9a9da5e78cab605d31baf7ff47900aaea75e3"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];
    const endTime = 1234356770;

    const txnRequest = await walletClient.pChain.prepareAddSubnetValidatorTxn({
      changeAddresses,
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      weight: 12345n,
      end: BigInt(endTime),
      subnetAuth: [0],
      // context is not provided - should call getContextFromURI
    });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addSubnetValidatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
    expect(txnRequest.subnetOwners).toBeDefined();
  });

  it("should throw error when subnetOwners is not found", async () => {
    const changeAddresses = [account1.getXPAddress("P", "fuji")];
    const endTime = 1234356770;

    // Mock fetchCommonPVMTxParams to return undefined for subnetOwners
    vi.spyOn(walletUtils, "fetchCommonPVMTxParams").mockResolvedValueOnce({
      commonTxParams: {
        feeState: feeState(),
        fromAddressesBytes: [account1.getXPAddress("P", "fuji")].map(
          walletUtils.bech32AddressToBytes
        ),
        utxos: [],
        memo: new Uint8Array(),
      },
      subnetOwners: undefined, // This will trigger the error
      disableOwners: undefined,
    } as any);

    await expect(
      walletClient.pChain.prepareAddSubnetValidatorTxn({
        changeAddresses,
        subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        weight: 12345n,
        end: BigInt(endTime),
        subnetAuth: [0],
        context: testContext,
      })
    ).rejects.toThrow("Subnet owners not found for a Subnet tx");

    // Restore the original function
    vi.mocked(walletUtils.fetchCommonPVMTxParams).mockRestore();
  });
});
