import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrepareRegisterL1ValidatorTxnParameters } from ".";
import { testContext } from "../fixtures/testContext";
import {
  account1,
  account2,
  account3,
  feeState,
  getUTXOStrings,
  popSignatureHex,
  signedWarpMsgRegisterL1ValidatorHex,
} from "../fixtures/txns";
import { checkOutputs } from "../fixtures/utils";
import { Output } from "../types/common";
import { avaxToNanoAvax, nanoAvaxToAvax, toTransferableOutput } from "../utils";
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
                reqBody?.["params"]?.["addresses"] || [
                  "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
                ],
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
        case "platform.getTx":
          if (
            reqBody?.["params"]?.["txID"] ===
            "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH"
          ) {
            return HttpResponse.json({
              jsonrpc: "2.0",
              result: {
                tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000700000000001e1d26000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d68237000000001e24544f6fd3abaa362b4c635d5c5dec16ac57a853477a1be41ae8e464d82005d000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000001e31390000000100000000000000000000000b000000000000007b00000001000000012a705f0a71d8b6e19d5e955b19d683ca6d6823700000000100000009000000012df65b239996df9eaaeb235223a9e571832270e718a4be27317656965917d2080450e9aaf2141073bb1c4dab959fec0e8bb9dcb5dbf9f372160d0cb8c000f01401509d618f",
                encoding: "hex",
              },
              id: reqBody?.["id"] || 1,
            });
          } else if (
            reqBody?.["params"]?.["txID"] ===
            "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa"
          ) {
            return HttpResponse.json({
              jsonrpc: "2.0",
              result: {
                tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa00000007000000000000ef54000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d682370000000012677461b127dc02dfc789c599fd38917089842c4f043a98786b1db07fea6e09e000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000000103670000000100000000000000000000000b000000000000007b00000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c000000010000000900000001115afe7403829dd5dde8d6d15702543feeb9bb689c2e611515677cfa3d7bc51038d0c99d77ee06af450318f0e343cb414c3419758f0e12cafb24abb4f16c53c10081b39a2b",
                encoding: "hex",
              },
              id: reqBody?.["id"] || 1,
            });
          }

          return HttpResponse.json({
            jsonrpc: "2.0",
            result: {
              tx: "0x00", // empty tx
              encoding: "hex",
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

describe("prepareRegisterL1ValidatorTxn", () => {
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

    const mockTxParams: PrepareRegisterL1ValidatorTxnParameters = {
      changeAddresses,
      initialBalanceInAvax: 0.123,
      blsSignature: popSignatureHex,
      message: signedWarpMsgRegisterL1ValidatorHex,
      context: testContext,
    };
    // stake output
    const testOutputs: Output[] = [];

    const txnRequest = await walletClient.pChain.prepareRegisterL1ValidatorTxn(
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
    const totalBurnedAmount =
      fee + avaxToNanoAvax(mockTxParams.initialBalanceInAvax);
    const expectedChangeAmount =
      avaxToNanoAvax(testInputAmount) - totalBurnedAmount;

    // expected change output
    testOutputs.push({
      amount: nanoAvaxToAvax(expectedChangeAmount),
      addresses: changeAddresses,
    });

    // check change outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.RegisterL1ValidatorTx
    )
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = outputs.reduce(
      (acc: bigint, i: any) => acc + i.output.amount(),
      0n
    );
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(totalBurnedAmount);
  });

  it("should create correct registration details", async () => {
    const changeAddresses = [
      account2.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const mockTxParams: PrepareRegisterL1ValidatorTxnParameters = {
      changeAddresses,
      initialBalanceInAvax: 0.123,
      blsSignature: popSignatureHex,
      message: signedWarpMsgRegisterL1ValidatorHex,
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareRegisterL1ValidatorTxn(
      mockTxParams
    );

    // check tx details
    expect(
      (
        txnRequest.tx.getTx() as pvmSerial.RegisterL1ValidatorTx
      ).balance.value(),
      "balance mismatch"
    ).toBe(avaxToNanoAvax(mockTxParams.initialBalanceInAvax));
    expect(
      utils.bufferToHex(
        (
          txnRequest.tx.getTx() as pvmSerial.RegisterL1ValidatorTx
        ).blsSignature.toBytes()
      ),
      "blsSignature mismatch"
    ).toBe(mockTxParams.blsSignature);
    expect(
      utils.bufferToHex(
        (txnRequest.tx.getTx() as pvmSerial.RegisterL1ValidatorTx).message.bytes
      ),
      "message mismatch"
    ).toBe(mockTxParams.message);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareRegisterL1ValidatorTxnParameters = {
      changeAddresses,
      initialBalanceInAvax: 0.123,
      blsSignature: popSignatureHex,
      message: signedWarpMsgRegisterL1ValidatorHex,
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareRegisterL1ValidatorTxn(
      mockTxParams
    );
    const result = await walletClient.signXPTransaction(txnRequest);
    expect(result.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000240000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003445e92a000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca00000000010000000000000000000000000754d4c08b1d6133d17e3483220ad960b6fde11e4e1214a8ce21ef616227e5d5eef070d7500e6f7d4452c5a760620cc06795cbe218e072eba76d94788d9d01176ce4ecadfb96b47f942281894ddfadd1c1743f7f549f1d07d59d55655927f72bc6bf7c120000016d0000000000057f78fe8ca06cefa186ef29c15231e45e1056cd8319ceca0695ca61099e610355000000d80000000000010000001433b9785e20ec582d5009965fb3346f1716e8a423000000b60000000000015e8b6e2e8155e93739f2fa6a7f8a32c6bb2e1dce2e471b56dcc60aac49bf34350000001447b37278e32917ffc6d2861b50dd9751b4016dd1b0d305fd70c376b0f5d4e6b9184728dcacb7390f477015690133a5632affab5701e9ebe61038d2e41373de53f4569fd60000000067d1ac310000000100000001380c1fb1db38f176b50e77eca240258e31a5b5e80000000100000001380c1fb1db38f176b50e77eca240258e31a5b5e80000000000004e200000000000000003c4411899be0450aee4dcc1be90a8802bdbd12821a5025a74cb094ff0033982e7f3951d6c4b882a6ce39bd2aa835b31accd09c60f26bc75308af4e05c4237df9b72b04c2697c5a0a7fb0f05f7b09358743a4a2df8cd4eda61f0dea0312a7014baa8a5c1000000010000000900000001f18943201d89e17e68e35314ba428bf1d295d1799a581a9ca8b07d835c0dae8d548bc665d5d06638fda3b74a42070e881c553060e47233057b237baa85bbfe2200501ce67d"
    );
  });
});
