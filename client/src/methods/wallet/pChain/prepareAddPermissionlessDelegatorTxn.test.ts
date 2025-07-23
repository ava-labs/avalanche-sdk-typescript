import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { pvm, pvmSerial } from "@avalabs/avalanchejs";
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

describe("prepareAddPermissionlessDelegatorTxn", () => {
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account3 = privateKeyToAvalancheAccount(privateKey3ForTest);

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

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const txnRequest =
      await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
        changeAddresses,
        stakeInAvax: stakeAmount,
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        end: Math.floor(endTime / 1000),
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
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should create correct staking details", async () => {
    const rewardAddresses = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account3.getXPAddress("P", "fuji")];

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: Math.floor(endTime / 1000),
      rewardAddresses,
      threshold: 3,
      locktime: 1234567890,
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
      BigInt(mockTxParams.stakeInAvax * 1e9)
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

    const stakeAmount = 0.5;
    const endTime = 1234356770;
    const mockTxParams = {
      changeAddresses, // staked outputs will be owned by these addresses
      stakeInAvax: stakeAmount,
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: Math.floor(endTime / 1000),
      rewardAddresses,
      threshold: 3,
      locktime: 1234567890,
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
});
