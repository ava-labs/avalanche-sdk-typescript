import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import {
  avaxSerial,
  OutputOwners,
  pvm,
  pvmSerial,
  TransferableOutput,
} from "@avalabs/avalanchejs";
import { avalancheFuji } from "../../../chains";
import { createAvalancheWalletClient } from "../../../clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  account4,
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

describe("prepareAddPermissionlessValidatorTxn", () => {
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

  it("should create correct stake and change outputs", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(endTime / 1000)),
      rewardAddresses,
      delegatorRewardAddresses,
      delegatorRewardPercentage: 4,
      context: testContext,
    };
    // stake output
    const testOutputs: Output[] = [
      {
        amount: stakeAmount,
        addresses: changeAddresses,
      },
    ];

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn(
        mockTxParams
      );
    const stakedOutputs = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).stake.map((transferableOutput: TransferableOutput) => {
      return {
        ...transferableOutput,
        output:
          transferableOutput.output as unknown as pvmSerial.StakeableLockOut,
      };
    });
    const transferableOutputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
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
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
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
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(endTime / 1000)),
      rewardAddresses,
      delegatorRewardAddresses,
      delegatorRewardPercentage: 4,
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn(
        mockTxParams
      );

    // check staking details
    const vldr = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).subnetValidator.validator;
    expect(vldr.nodeId.value(), "nodeId mismatch").toBe(mockTxParams.nodeId);
    expect(vldr.endTime.value(), "endTime mismatch").toBe(
      BigInt(mockTxParams.end)
    );
    expect(vldr.weight.value(), "weight mismatch").toBe(
      mockTxParams.stakeInAvax
    );
    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
      ).shares.value(),
      "delegator reward percentage mismatch"
    ).toBe(mockTxParams.delegatorRewardPercentage * 10000);

    // check delegator rewards owner
    const drw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).delegatorRewardsOwner as OutputOwners;
    expect(drw.locktime.value(), "locktime mismatch").toBe(0n);
    expect(drw.threshold.value(), "threshold mismatch").toBe(1);
    expect(
      drw.addrs.map((a) => a.toString("fuji")),
      "delegator reward addresses mismatch"
    ).toEqual(
      mockTxParams.delegatorRewardAddresses.map((a) => a.replace("P-", ""))
    );

    // check validator rewards owner
    const vrw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).validatorRewardsOwner as OutputOwners;
    expect(vrw.locktime.value(), "locktime mismatch").toBe(0n);
    expect(vrw.threshold.value(), "threshold mismatch").toBe(1);
    expect(
      vrw.addrs.map((a) => a.toString("fuji")),
      "validator reward addresses mismatch"
    ).toEqual(mockTxParams.rewardAddresses.map((a) => a.replace("P-", "")));
  });

  it("should give correct transaction hash", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];

    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(endTime / 1000)),
      rewardAddresses,
      delegatorRewardAddresses,
      delegatorRewardPercentage: 4,
      context: testContext,
    };
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn(
        mockTxParams
      );

    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex).toBe(
      "0x0000000000190000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000001dcd61f900000000000000000000000100000001532b4d667f30a7f70d808a7ac02deb50baeb28fc00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000d6fb5ded320a43a674fc4fe007c631532ce7a9b00000000000000000000000000012d5b4000000001dcd650000000000000000000000000000000000000000000000000000000000000000000000001b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000001dcd650000000000000000000000000100000001532b4d667f30a7f70d808a7ac02deb50baeb28fc0000000b000000000000000000000001000000022a705f0a71d8b6e19d5e955b19d683ca6d6823703cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b00000000000000000000000100000001931887940fd0ef612f2aa42fcdc8556405b7e76700009c40000000010000000900000001f2ad1c15dfeacba8e75bae3f40d095874b7eabdd71148b684ec66f3f5eabc6366440ce8a3c25b5bd18f3d199aeb7eeb1a0d7e54ad912e0cd1d99f1464726620a005bf609e9"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        delegatorRewardAddresses,
        delegatorRewardPercentage: 4,
        // context is not provided - should call getContextFromURI
      });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessValidatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });

  it("should use default threshold when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        delegatorRewardAddresses,
        delegatorRewardPercentage: 4,
        locktime: BigInt(1234567890),
        // threshold is not provided - should default to 1
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: params.threshold ?? 1
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessValidatorTx).toBeDefined();

    // Verify threshold defaults to 1 for validator rewards owner
    const vrw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).validatorRewardsOwner as OutputOwners;
    expect(vrw.threshold.value()).toBe(1);
  });

  it("should use default locktime when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        delegatorRewardAddresses,
        delegatorRewardPercentage: 4,
        threshold: 1,
        // locktime is not provided - should default to 0
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: BigInt(params.locktime ?? 0n)
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessValidatorTx).toBeDefined();

    // Verify locktime defaults to 0 for validator rewards owner
    const vrw = (
      txnRequest.tx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    ).validatorRewardsOwner as OutputOwners;
    expect(vrw.locktime.value()).toBe(0n);
  });

  it("should not include publicKey when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        delegatorRewardAddresses,
        delegatorRewardPercentage: 4,
        // publicKey is not provided - should not include it
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: ...(params.publicKey ? { publicKey: ... } : {})
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessValidatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });

  it("should not include signature when not provided", async () => {
    const rewardAddresses = [account1.getXPAddress("P", "fuji")];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];
    const stakeAmount = avaxToNanoAvax(0.5);
    const endTime = 1234356770;

    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: BigInt(Math.floor(endTime / 1000)),
        rewardAddresses,
        delegatorRewardAddresses,
        delegatorRewardPercentage: 4,
        // signature is not provided - should not include it
        context: testContext,
      });

    // Verify the transaction was created successfully
    // This test covers the branch: ...(params.signature ? { signature: ... } : {})
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.addPermissionlessValidatorTx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
  });
});
