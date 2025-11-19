import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { pvm, pvmSerial } from "@avalabs/avalanchejs";
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

const testInputAmount = avaxToNanoAvax(1);

const pChainWorker = getPChainMockServer({});

describe("prepareAddPermissionlessDelegatorTxn", () => {
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

  it("should prepare add permissionless delegator transaction", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        context: testContext,
      });

    const testOutputs: Output[] = [
      {
        amount: stakeAmount,
        addresses: changeAddresses,
      },
    ];

    const stakedOutputs = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    ).stake.map((transferableOutput) => {
      return {
        ...transferableOutput,
        output:
          transferableOutput.output as unknown as pvmSerial.StakeableLockOut,
      };
    });

    const transferableOutputs = (
      txnRequest.tx.getTx() as unknown as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const outputs = [...stakedOutputs, ...transferableOutputs];

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const expectedFeesInAvax = fee;
    const expectedChangeAmount =
      testInputAmount - stakeAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // check change and staked outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    )
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
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(endTime / 1000)),
      rewardAddresses,
      threshold: 3,
      locktime: BigInt(1234567890),
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn(
        mockTxParams
      );

    // check staking details
    const vldr = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    ).subnetValidator.validator;
    expect(vldr.nodeId.value(), "nodeId mismatch").toBe(mockTxParams.nodeId);
    expect(vldr.endTime.value(), "endTime mismatch").toBe(
      BigInt(mockTxParams.end)
    );
    expect(vldr.weight.value(), "weight mismatch").toBe(
      mockTxParams.stakeInAvax
    );

    // check delegator rewards owner
    const drw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    ).getDelegatorRewardsOwner();
    expect(drw.locktime.value(), "locktime mismatch").toBe(
      BigInt(mockTxParams.locktime ?? 0n)
    );
    expect(drw.threshold.value(), "threshold mismatch").toBe(
      mockTxParams.threshold ?? 1
    );
    expect(
      drw.addrs.map((a) => a.toString("fuji")),
      "reward addresses mismatch"
    ).toEqual(mockTxParams.rewardAddresses.map((a) => a.replace("P-", "")));
  });

  it("should give correct transaction hash", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(endTime / 1000)),
      rewardAddresses,
      threshold: 3,
      locktime: BigInt(1234567890),
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn(
        mockTxParams
      );

    const signedTxn = await walletClient.signXPTransaction(txnRequest);

    expect(signedTxn.signedTxHex).toBe(
      "0x00000000001a0000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000001dcd622a00000000000000000000000100000001931887940fd0ef612f2aa42fcdc8556405b7e76700000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000d6fb5ded320a43a674fc4fe007c631532ce7a9b00000000000000000000000000012d5b4000000001dcd650000000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000001dcd650000000000000000000000000100000001931887940fd0ef612f2aa42fcdc8556405b7e7670000000b00000000499602d200000003000000022a705f0a71d8b6e19d5e955b19d683ca6d6823703cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c000000010000000900000001c441bf1564289ffacd74ad09205042f935009554eaea35ddaec0c3e5da85575f3bac448b28385d45223c5291cb686a17d3e9080fa16c2a8cacb29bdf5f8a573501142fb36e"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        // context is not provided - should call getContextFromURI
      });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessDelegatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });

  it("should use default threshold when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        locktime: BigInt(1234567890),
        // threshold is not provided - should default to 1
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: params.threshold ?? 1
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessDelegatorTx).toBeDefined();

    // Verify threshold defaults to 1
    const drw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    ).getDelegatorRewardsOwner();
    expect(drw.threshold.value()).toBe(1);
  });

  it("should use default locktime when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        threshold: 1,
        // locktime is not provided - should default to 0
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: params.locktime ?? 0n
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessDelegatorTx).toBeDefined();

    // Verify locktime defaults to 0
    const drw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    ).getDelegatorRewardsOwner();
    expect(drw.locktime.value()).toBe(0n);
  });
});
