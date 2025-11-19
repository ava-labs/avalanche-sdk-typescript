import { NodeId, pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PrepareConvertSubnetToL1TxnParameters } from ".";
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
import * as walletUtilsModule from "../utils.js";

// Mock getContextFromURI to avoid making real HTTP requests
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(() => Promise.resolve(testContext)),
}));

const testInputAmount = avaxToNanoAvax(1);
const popPublicKeyHex =
  "0x94ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40";
const popSignatureHex =
  "0x985b38c12afbe3ff90161f451bf2290cd6c03c3acd0a7346e346820ab4d27c200036cd9c7a828548eec5c6a5304339c400d1eb6f73e381479c4356df57938d4792f7fb9256a5817c16fb514bd27e8d9fc5c5a02470d721bb34064e90a19174df";

const pChainWorker = getPChainMockServer({});

describe("convertSubnetToL1Tx", () => {
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

    const l1Validators = [
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.123), // 0.123 AVAX = 123_000_000 nAVAX
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.456), // 0.456 AVAX = 456_000_000_000_000 nAVAX
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
    ];

    const mockTxParams: PrepareConvertSubnetToL1TxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      blockchainId: "2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4",
      managerContractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      validators: l1Validators,
      subnetAuth: [0],
      context: testContext,
    };
    const testOutputs: Output[] = [];

    const txnRequest = await walletClient.pChain.prepareConvertSubnetToL1Txn(
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
    const l1ValidatorBurnedFees = l1Validators.reduce(
      (acc, v) => acc + v.initialBalanceInAvax,
      0n
    );
    const totalBurnedFees = fee + l1ValidatorBurnedFees;
    const expectedChangeAmount = testInputAmount - totalBurnedFees;

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
    ).toBe(totalBurnedFees);
  });

  it("should create correct conversion details", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const l1Validators = [
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.123), // 0.123 AVAX = 123_000_000 nAVAX
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.456), // 0.456 AVAX = 456_000_000 nAVAX
        remainingBalanceOwner: {
          addresses: [
            account2.getXPAddress("P", "fuji"),
            account3.getXPAddress("P", "fuji"),
          ],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [
            account2.getXPAddress("P", "fuji"),
            account4.getXPAddress("P", "fuji"),
          ],
          threshold: 1,
        },
      },
    ];

    const mockTxParams: PrepareConvertSubnetToL1TxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      blockchainId: "2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4",
      managerContractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      validators: l1Validators,
      subnetAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareConvertSubnetToL1Txn(
      mockTxParams
    );

    // check validator details
    expect(
      (txnRequest.tx.getTx() as pvmSerial.ConvertSubnetToL1Tx).validators
        .length,
      "expected and actual validator count mismatch"
    ).toBe(l1Validators.length);
    l1Validators.forEach((a, i) => {
      const e = (txnRequest.tx.getTx() as pvmSerial.ConvertSubnetToL1Tx)
        .validators[i];
      expect(e).toBeDefined();
      if (e) {
        expect(new NodeId(e.nodeId.bytes).toString(), "nodeId mismatch").toBe(
          a.nodeId
        );
        expect(e.getWeight().valueOf(), "weight mismatch").toBe(
          BigInt(a.weight)
        );
        expect(e.getBalance().value(), "balance mismatch").toBe(
          a.initialBalanceInAvax
        );
        expect(
          e.getDeactivationOwner().threshold.value(),
          "deactivationOwner threshold mismatch"
        ).toBe(a.deactivationOwner.threshold);
        expect(
          e
            .getDeactivationOwner()
            .addresses.map((a) => `P-${a.toString("fuji")}`),
          "deactivationOwner mismatch"
        ).deep.equal(a.deactivationOwner.addresses);
        expect(
          e.getRemainingBalanceOwner().threshold.value(),
          "remainingBalanceOwner threshold mismatch"
        ).toBe(a.remainingBalanceOwner.threshold);
        expect(
          e
            .getRemainingBalanceOwner()
            .addresses.map((a) => `P-${a.toString("fuji")}`),
          "remainingBalanceOwner mismatch"
        ).deep.equal(a.remainingBalanceOwner.addresses);
        expect(
          utils.bufferToHex(e.signer.publicKey),
          "publicKey mismatch"
        ).toBe(a.nodePoP.publicKey);
        expect(
          utils.bufferToHex(e.signer.signature),
          "proofOfPossession mismatch"
        ).toBe(a.nodePoP.proofOfPossession);
      }
    });
    expect(
      (txnRequest.tx.getTx() as pvmSerial.ConvertSubnetToL1Tx).chainID.value(),
      "chainID mismatch"
    ).toBe(mockTxParams.blockchainId);
    expect(
      utils.bufferToHex(
        (txnRequest.tx.getTx() as pvmSerial.ConvertSubnetToL1Tx).address.bytes
      ),
      "managerContractAddress mismatch"
    ).toBe(mockTxParams.managerContractAddress.toLowerCase());
  });

  it("should give correct transaction hash", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const l1Validators = [
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.123), // 0.123 AVAX = 123_000_000 nAVAX
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
    ];
    const mockTxParams: PrepareConvertSubnetToL1TxnParameters = {
      changeAddresses, // staked outputs will be owned by these addresses
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      blockchainId: "2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4",
      managerContractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      validators: l1Validators,
      subnetAuth: [0],
      context: testContext,
    };
    const txnRequest = await walletClient.pChain.prepareConvertSubnetToL1Txn(
      mockTxParams
    );
    const signedTx = await walletClient.signXPTransaction(txnRequest);
    expect(signedTx.signedTxHex, "transaction hash mismatch").toBe(
      "0x0000000000230000000500000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000003445ecbe000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001ba5eeb9cf2e099134ffba3d2ce1310fa6f07413e4512044cdd1caba9e03fa8c90000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000000003b9aca000000000100000000000000009d27db382a254d2ac9908dafa65f0eb4cebc8dce746fd2bf0f759e61509d618fc60ae22538b579f2ba86cf78c6c8ef44a6728b4a1349df32c172df5ffa89264800000014b31f66aa3c1e785363f0875a1b74e27b85fd66c70000000100000014d6fb5ded320a43a674fc4fe007c631532ce7a9b00000000000003039000000000754d4c094ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40985b38c12afbe3ff90161f451bf2290cd6c03c3acd0a7346e346820ab4d27c200036cd9c7a828548eec5c6a5304339c400d1eb6f73e381479c4356df57938d4792f7fb9256a5817c16fb514bd27e8d9fc5c5a02470d721bb34064e90a19174df00000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000a0000000100000000000000020000000900000001132efb3b0bbde2b494463e8e2b5ff8a7438a8977c4ed483ab2ddf7fe83f3a74d56f4f88d1df4c12fe06b4571efd4b9b8ef07330943e1d2b6c895a4af77a4a23b000000000900000001132efb3b0bbde2b494463e8e2b5ff8a7438a8977c4ed483ab2ddf7fe83f3a74d56f4f88d1df4c12fe06b4571efd4b9b8ef07330943e1d2b6c895a4af77a4a23b00676368d5"
    );
  });

  it("should fetch context from URI when context is not provided", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const l1Validators = [
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.123),
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
    ];

    const txnRequest = await walletClient.pChain.prepareConvertSubnetToL1Txn({
      changeAddresses,
      subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      blockchainId: "2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4",
      managerContractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      validators: l1Validators,
      subnetAuth: [0],
      // context is not provided - should call getContextFromURI
    });

    // Verify getContextFromURI was called
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalled();
    expect(vi.mocked(getContextFromURI)).toHaveBeenCalledTimes(1);

    // Verify the transaction was created successfully
    expect(txnRequest).toBeDefined();
    expect(txnRequest.tx).toBeDefined();
    expect(txnRequest.convertSubnetToL1Tx).toBeDefined();
    expect(txnRequest.chainAlias).toBe("P");
    expect(txnRequest.subnetOwners).toBeDefined();
  });

  it("should throw error when subnetOwners is not found", async () => {
    const changeAddresses = [account2.getXPAddress("P", "fuji")];

    const l1Validators = [
      {
        nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
        nodePoP: {
          publicKey: popPublicKeyHex,
          proofOfPossession: popSignatureHex,
        },
        weight: 12345n,
        initialBalanceInAvax: avaxToNanoAvax(0.123),
        remainingBalanceOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: [account2.getXPAddress("P", "fuji")],
          threshold: 1,
        },
      },
    ];

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
      walletClient.pChain.prepareConvertSubnetToL1Txn({
        changeAddresses,
        subnetId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
        blockchainId: "2WDjMPX9jMRXvXvzAZ2RsjLaFz1R7oj9BXxpPYsRyFqNqmAxh4",
        managerContractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        validators: l1Validators,
        subnetAuth: [0],
        context: testContext,
      })
    ).rejects.toThrow("Subnet owners not found for a Subnet tx");

    // Restore the original function
    fetchCommonPVMTxParamsSpy.mockRestore();
  });
});
