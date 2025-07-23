import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { pvm, pvmSerial, UnsignedTx, utils } from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "src/accounts";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { getTxFromBytes } from "src/utils";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testContext } from "../fixtures/testContext";
import {
  feeState,
  getUTXOStrings,
  privateKey1ForTest,
  privateKey2ForTest,
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

describe("addSubnetValidatorTx", () => {
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);

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
    const expectedFeesInAvax = Number(fee) / 1e9;
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
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
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
});
