import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import {
  avaxSerial,
  pvm,
  pvmSerial,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "src/accounts";
import { avalancheFuji } from "src/chains";
import { createAvalancheWalletClient } from "src/clients/createAvalancheWalletClient";
import { getTxFromBytes } from "src/utils";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testContext } from "../fixtures/testContext";
import {
  feeState,
  getUTXOStrings,
  getValidUTXO,
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

describe("newBaseTx", () => {
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

  it("should create correct outputs and fees", async () => {
    const receiverAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];
    const testOutputAmount = 0.1234;
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    // Calculate fees as per AvalancheJS method
    // (this method of using test Tx to calculate fees is correct upto some extent,
    // because the fees depends on number of inputs, outputs, signers, etc. and
    // won't change much by the amount)
    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const expectedFeesInAvax = Number(fee) / 1e9;
    const expectedChangeAmount =
      testInputAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should only use utxos passed in params", async () => {
    const receiverAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const testOutputAmount = 0.1234;
    const testInputAmount = 0.5;
    const testOutputs = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      // utxos passed here override the wallet's or fromAddresses' utxos
      utxos: [
        getValidUTXO(
          testInputAmount,
          testContext.avaxAssetID,
          [account1.getXPAddress("P", "fuji")],
          0,
          1
        ),
      ],
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    // calculate fees as per AvalancheJS method
    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const expectedFeesInAvax = Number(fee) / 1e9;
    // if utxos passed in params are only used, then testInputAmount will be 0.5 instead of default 1
    const expectedChangeAmount =
      testInputAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      addresses: changeAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // match testOutputs with outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(allInputAmounts - allOutputAmounts).toBe(
      BigInt(expectedFeesInAvax * 1e9)
    );
  });

  it("should use `fromAddresses` for fetching utxos and change addresses", async () => {
    const testSpentAmount = 1;
    const spenderAddresses = [account1.getXPAddress("P", "fuji")];
    const receiverAddresses = [
      account4.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];

    const testOutputAmount = 0.1234;
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      fromAddresses: spenderAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareBaseTxn(mockTxParams);
    const outputs = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.map(toTransferableOutput);

    const fee = pvm.calculateFee(
      txnRequest.tx.getTx(),
      testContext.platformFeeConfig.weights,
      feeState().price
    );
    const expectedFeesInAvax = Number(fee) / 1e9;
    const expectedChangeAmount =
      testSpentAmount - testOutputAmount - expectedFeesInAvax;

    // expected change output
    testOutputs.push({
      amount: expectedChangeAmount,
      // this will test if change address is not passed,
      // then fromAddresses will be used.
      addresses: spenderAddresses,
    });

    // theres must be 2 outputs
    expect(outputs.length, "expected and actual outputs length mismatch").toBe(
      2
    );

    // check outputs
    checkOutputs(testOutputs, outputs);

    // actual burned amount is same as fees
    const allInputAmounts = (txnRequest.tx.getTx() as avaxSerial.AvaxTx)
      .getInputs()
      .reduce((acc, i) => acc + i.amount(), 0n);
    const allOutputAmounts = (
      txnRequest.tx.getTx() as pvmSerial.BaseTx
    ).baseTx.outputs.reduce((acc, i) => acc + i.amount(), 0n);
    expect(
      allInputAmounts - allOutputAmounts,
      "expected and actual burned amount mismatch"
    ).toBe(BigInt(expectedFeesInAvax * 1e9));
  });

  it("should sign the tx properly", async () => {
    const receiverAddresses = [
      account1.getXPAddress("P", "fuji"),
      account3.getXPAddress("P", "fuji"),
    ];
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const testOutputAmount = 0.1234;
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareBaseTxn(mockTxParams);
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    const [txn, credentials] = await getTxFromBytes(signedTx.signedTxHex, "P");
    const unsignedTxInstance = new UnsignedTx(
      txn,
      [],
      new utils.AddressMaps(),
      credentials
    );
    expect(
      unsignedTxInstance.hasAllSignatures(),
      "tx did not have all signatures"
    ).toBe(true);
  });

  it("should sign the multi sig tx properly", async () => {
    const receiverAddresses = [account3.getXPAddress("P", "fuji")];
    const changeAddresses = [account4.getXPAddress("P", "fuji")];

    const testOutputAmount = 1.5;
    const testOutputs: Output[] = [
      {
        amount: testOutputAmount,
        addresses: receiverAddresses,
      },
    ];
    const mockTxParams = {
      fromAddresses: [
        account1.getXPAddress("P", "fuji"),
        account2.getXPAddress("P", "fuji"),
      ],
      changeAddresses: changeAddresses,
      outputs: testOutputs,
      context: testContext,
    };

    const txnRequest = await walletClient.pChain.prepareBaseTxn(mockTxParams);
    const partialSignedTx = await walletClient.signXPTransaction(txnRequest);
    const [txn1, credentials1] = await getTxFromBytes(
      partialSignedTx.signedTxHex,
      "P"
    );
    const unsignedTxInstance1 = new UnsignedTx(
      txn1,
      [],
      new utils.AddressMaps(),
      credentials1
    );
    expect(
      unsignedTxInstance1.hasAllSignatures(),
      "tx have all signatures for the multi-sig without signing"
    ).toBe(false);
    const signedTx = await walletClient.signXPTransaction({
      ...partialSignedTx,
      account: account2,
    });
    const [txn2, credentials2] = await getTxFromBytes(
      signedTx.signedTxHex,
      "P"
    );
    const unsignedTxInstance2 = new UnsignedTx(
      txn2,
      [],
      new utils.AddressMaps(),
      credentials2
    );
    expect(
      unsignedTxInstance2.hasAllSignatures(),
      "tx did not have all signatures"
    ).toBe(true);
  });

  // it('should give correct tx hash', async () => {
  //     const receiverAddresses = [pAddressForTest, pAddressForTest3]
  //     const changeAddresses = [pAddressForTest2]

  //     const testOutputAmount = 0.1234
  //     const testOutputs: Output[] = [{
  //         amount: testOutputAmount,
  //         addresses: receiverAddresses,
  //     }]
  //     const mockTxParams: BaseTxParams = {
  //         changeAddresses: changeAddresses,
  //         outputs: testOutputs
  //     };

  //     const result = await newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams);
  //     await result.sign()
  //     expect(result.getId(), 'expected and actual tx hash mismatch').toBe('2foYLsCJnxY9XkGTGDPf11BugnkjXBKShBo4dpoEKcjdLjqusW')
  // })

  // it('should handle errors appropriately', async () => {
  //     const mockTxParams: BaseTxParams = {
  //         fromAddresses: [pAddressForTest],
  //         outputs: [{
  //             amount: 40,
  //             addresses: [pAddressForTest],
  //         }],
  //     };

  //     // Mock an error in initializeContextIfNot
  //     (mockPrimaryNetworkCoreClient.initializeContextIfNot as Mock).mockRejectedValue(
  //         new Error('Failed to initialize context')
  //     );

  //     // Verify that the error is propagated
  //     await expect(
  //         newBaseTx(mockPrimaryNetworkCoreClient, mockTxParams)
  //     ).rejects.toThrow('Failed to initialize context');
  // });
});
