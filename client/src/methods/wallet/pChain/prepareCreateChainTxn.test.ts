import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareCreateChainTxnParameters } from ".";
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

describe("createChainTxn", () => {
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

    const mockTxParams: PrepareCreateChainTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      genesisData: {
        random: "string data",
        timestamp: 1234567890,
        tx: "tx data",
      },
      subnetAuth: [0],
      context: testContext,
    };
    const testOutputs: Output[] = [];
    const txnRequest = await walletClient.pChain.prepareCreateChainTxn(
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

  it("should create correct chain details", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareCreateChainTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      genesisData: {
        random: "string data",
        timestamp: 1234567890,
        tx: "tx data",
      },
      subnetAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareCreateChainTxn(
      mockTxParams
    );

    expect(
      (txnRequest.tx.getTx() as pvmSerial.CreateChainTx).chainName.value(),
      "chainName mismatch"
    ).toBe(mockTxParams.chainName);
    expect(
      JSON.parse(
        (
          txnRequest.tx.getTx() as pvmSerial.CreateChainTx
        ).genesisData.toString()
      ),
      "genesisData mismatch"
    ).toMatchObject(mockTxParams.genesisData);
    expect(
      (txnRequest.tx.getTx() as pvmSerial.CreateChainTx)
        .getSubnetAuth()
        .values(),
      "subnetAuth mismatch"
    ).deep.equal(mockTxParams.subnetAuth);
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const mockTxParams: PrepareCreateChainTxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      genesisData: {
        random: "string data",
        timestamp: 1234567890,
        tx: "tx data",
      },
      subnetAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareCreateChainTxn(
      mockTxParams
    );
    const txnResponse = await walletClient.signXPTransaction(txnRequest);

    expect(txnResponse.signedTxHex, "transaction hash mismatch").toBe(
      "0x00000000000f0000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003b9ac649000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000009d27db382a254d2ac9908dafa65f0eb4cebc8dce746fd2bf0f759e61509d618f00187465737420636861696e206176616c616e6368652073646b6469737061746368000000000000000000000000000000000000000000000000000000000000003e7b2272616e646f6d223a22737472696e672064617461222c2274696d657374616d70223a313233343536373839302c227478223a2274782064617461227d0000000a00000001000000000000000200000009000000018c4805a55792958de3f517d05dda530add42d81ed775fdf4a179a97679b2cbc54d75882fc98be873998ab1a6729414d2dddbd4942a4842c00cc651cab52b686f0000000009000000018c4805a55792958de3f517d05dda530add42d81ed775fdf4a179a97679b2cbc54d75882fc98be873998ab1a6729414d2dddbd4942a4842c00cc651cab52b686f0033ef7b20"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const txnRequest = await walletClient.pChain.prepareCreateChainTxn({
      changeAddresses,
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      genesisData: {
        random: "string data",
        timestamp: 1234567890,
        tx: "tx data",
      },
      subnetAuth: [0],
      // context is not provided - should call getContextFromURI
    });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.createChainTx).toBeDefined();
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
      walletClient.pChain.prepareCreateChainTxn({
        changeAddresses,
        subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
        vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
        chainName: "test chain avalanche sdk",
        genesisData: {
          random: "string data",
          timestamp: 1234567890,
          tx: "tx data",
        },
        subnetAuth: [0],
        context: testContext,
      })
    ).rejects.toThrow("Subnet owners not found for a Subnet tx");

    // Restore the original function
    fetchCommonPVMTxParamsSpy.mockRestore();
  });

  it("should use default empty array for fxIds when not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const txnRequest = await walletClient.pChain.prepareCreateChainTxn({
      changeAddresses,
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      genesisData: {
        random: "string data",
        timestamp: 1234567890,
        tx: "tx data",
      },
      subnetAuth: [0],
      // fxIds is not provided - should default to empty array
      context: testContext,
    });

    // Verify the transaction was created successfully
    // This test covers the branch: params.fxIds ?? []
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.createChainTx).toBeDefined();

    // Verify fxIds defaults to empty array
    const createChainTx = txnRequest.tx.getTx() as pvmSerial.CreateChainTx;
    expect(createChainTx.fxIds).toBeDefined();
    expect(Array.isArray(createChainTx.fxIds)).toBe(true);
    expect(createChainTx.fxIds.length).toBe(0);
  });
});
