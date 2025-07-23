import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  avaxSerial,
  OutputOwners,
  pvm,
  pvmSerial,
  TransferableOutput,
} from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "src/accounts";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { testContext } from "../fixtures/testContext";
import {
  feeState,
  getUTXOStrings,
  privateKey1ForTest,
  privateKey2ForTest,
  privateKey3ForTest,
  privateKey4ForTest,
} from "../fixtures/txns";
import { checkOutputs } from "../fixtures/utils";
import { Output } from "../types/common";
import { toTransferableOutput } from "../utils";
const testInputAmount = 1;

const pChainWorker = setupServer(
  http.post("https://api.avax-test.network/ext/bc/P", async ({ request }) => {
    const reqBody = await request.json();
    if (typeof reqBody === "object") {
      switch (reqBody?.["method"]) {
        case "platform.getUTXOs":
          return HttpResponse.json({
            jsonrpc: "2.0",
            result: {
              numFetched: "1",
              utxos: getUTXOStrings(
                testInputAmount,
                testContext.avaxAssetID,
                ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
                0,
                1
              ),
              endIndex: {
                address:
                  reqBody?.["params"]?.["addresses"]?.[0] ||
                  "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
                utxo: "2iz1aRvPX2XPW7XLs6Nay9ECqtsWHVt1iEUnMKHskrsguZ14hi",
              },
              encoding: "hex",
            },
            id: reqBody?.["id"] || 1,
          });
        case "platform.getFeeState":
          const feeStateData = feeState();
          return HttpResponse.json({
            jsonrpc: "2.0",
            result: {
              capacity: feeStateData.capacity.toString(),
              excess: feeStateData.excess.toString(),
              price: feeStateData.price.toString(),
              timestamp: feeStateData.timestamp,
            },
            id: reqBody?.["id"] || 1,
          });
        default:
          return HttpResponse.json(
            {
              message: "Mocked response",
            },
            {
              status: 202,
              statusText: "Mocked status",
            }
          );
      }
    }
    return HttpResponse.json(
      {
        message: "Mocked response",
      },
      {
        status: 202,
        statusText: "Mocked status",
      }
    );
  })
);

describe("prepareAddPermissionlessValidatorTxn", () => {
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account3 = privateKeyToAvalancheAccount(privateKey3ForTest);
  const account4 = privateKeyToAvalancheAccount(privateKey4ForTest);

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

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: Math.floor(endTime / 1000),
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
    const expectedFeesInAvax = Number(fee) / 1e9;
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
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should create correct staking details", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const delegatorRewardAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: Math.floor(endTime / 1000),
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
      BigInt(mockTxParams.stakeInAvax * 1e9)
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

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: Math.floor(endTime / 1000),
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
});
