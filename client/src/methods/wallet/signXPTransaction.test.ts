import { secp256k1, UnsignedTx, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { PrivateKeyAccount } from "viem";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AvalancheAccount } from "../../accounts/avalancheAccount.js";
import { mnemonicsToAvalancheAccount } from "../../accounts/mnemonicsToAvalancheAccount.js";
import { privateKeyToAvalancheAccount } from "../../accounts/privateKeyToAvalancheAccount.js";
import { avalancheFuji } from "../../chains/index.js";
import { createAvalancheWalletClient } from "../../clients/createAvalancheWalletClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
import { testContext } from "./fixtures/testContext.js";
import { getCChainMockServer } from "./fixtures/transactions/cChain.js";
import {
  account1,
  privateKey1ForTest,
} from "./fixtures/transactions/common.js";
import { avaxToNanoAvax } from "./utils.js";

// With the default derivation paths, the EVM key (m/44'/60'/0'/0/0) and the
// X/P key (m/44'/9000'/0'/0/0) of a mnemonic account are different keys
const mnemonicAccount = mnemonicsToAvalancheAccount(
  "test test test test test test test test test test test junk"
);

const emptySignature = utils.bufferToHex(new Uint8Array(65));

const cChainWorker = getCChainMockServer({});

const createWalletClient = (account: AvalancheAccount) =>
  createAvalancheWalletClient({
    account,
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
  });

const prepareCChainExport = async (account: AvalancheAccount) => {
  const { tx } = await createWalletClient(account).cChain.prepareExportTxn({
    destinationChain: "P",
    fromAddress: account.getEVMAddress(),
    exportedOutput: {
      addresses: [account.getXPAddress("P", "fuji")],
      amount: avaxToNanoAvax(0.005),
    },
    context: testContext,
  });
  return tx;
};

// Recover the EVM address that made each signature of a signed tx
const getSigners = (signedTxHex: string, unsignedTx: UnsignedTx) => {
  const [, credentials] = getTxFromBytes(signedTxHex, "C");
  const unsignedHash = sha256(unsignedTx.toBytes());
  return credentials.map((credential) =>
    credential.getSignatures().map((signature) => {
      expect(signature).not.toBe(emptySignature);
      return utils.bufferToHex(
        secp256k1.publicKeyToEthAddress(
          secp256k1.recoverPublicKey(
            unsignedHash,
            utils.hexToBuffer(signature)
          )
        )
      );
    })
  );
};

describe("signXPTransaction", () => {
  beforeAll(() => {
    cChainWorker.listen();
  });

  afterAll(() => {
    cChainWorker.close();
  });

  describe("C-Chain export", () => {
    const evmAddress = mnemonicAccount.getEVMAddress().toLowerCase();

    it("the mnemonic account has different EVM and X/P keys", () => {
      const xpKeyEVMAddress = utils.bufferToHex(
        secp256k1.publicKeyToEthAddress(
          utils.hexToBuffer(mnemonicAccount.xpAccount!.publicKey)
        )
      );
      expect(xpKeyEVMAddress).not.toBe(evmAddress);
    });

    it("signs the inputs of the EVM address with the EVM key", async () => {
      const tx = await prepareCChainExport(mnemonicAccount);

      const signedTx = await createWalletClient(
        mnemonicAccount
      ).signXPTransaction({ tx, chainAlias: "C", context: testContext });

      expect(getSigners(signedTx.signedTxHex, tx)).toEqual([[evmAddress]]);
      expect(tx.hasAllSignatures()).toBe(true);
      expect(signedTx.signatures).toEqual([
        {
          signature: tx.getCredentials()[0]!.getSignatures()[0],
          sigIndices: [0, 0],
        },
      ]);
    });

    it("signs a C-Chain export given as hex like the UnsignedTx", async () => {
      const walletClient = createWalletClient(mnemonicAccount);
      const tx = await prepareCChainExport(mnemonicAccount);
      const txHex = utils.bufferToHex(tx.toBytes());

      const signedTxFromHex = await walletClient.signXPTransaction({
        tx: txHex,
        chainAlias: "C",
        context: testContext,
      });
      const signedTx = await walletClient.signXPTransaction({
        tx,
        chainAlias: "C",
        context: testContext,
      });

      expect(getSigners(signedTxFromHex.signedTxHex, tx)).toEqual([
        [evmAddress],
      ]);
      expect(signedTxFromHex.signedTxHex).toBe(signedTx.signedTxHex);
      expect(signedTxFromHex.signatures).toEqual(signedTx.signatures);
    });

    it("signs with the evmAccount of the account parameter", async () => {
      const tx = await prepareCChainExport(mnemonicAccount);

      // The client account is another account
      const signedTx = await createWalletClient(account1).signXPTransaction({
        tx,
        chainAlias: "C",
        account: mnemonicAccount,
        context: testContext,
      });

      expect(getSigners(signedTx.signedTxHex, tx)).toEqual([[evmAddress]]);
      expect(tx.hasAllSignatures()).toBe(true);
    });

    it("signs once when the EVM key is the X/P key", async () => {
      const account = privateKeyToAvalancheAccount(privateKey1ForTest);
      const evmSign = vi.spyOn(
        account.evmAccount as PrivateKeyAccount,
        "sign"
      );
      const tx = await prepareCChainExport(account);

      const signedTx = await createWalletClient(account).signXPTransaction({
        tx,
        chainAlias: "C",
        context: testContext,
      });

      expect(evmSign).not.toHaveBeenCalled();
      expect(getSigners(signedTx.signedTxHex, tx)).toEqual([
        [account.getEVMAddress().toLowerCase()],
      ]);
      expect(tx.hasAllSignatures()).toBe(true);
      expect(signedTx.signatures).toHaveLength(1);
    });

    it("leaves the inputs unsigned when the EVM account cannot sign a hash", async () => {
      const tx = await prepareCChainExport(mnemonicAccount);
      // A JSON-RPC account has no sign({ hash })
      const account: AvalancheAccount = {
        ...mnemonicAccount,
        evmAccount: {
          address: mnemonicAccount.getEVMAddress(),
          type: "json-rpc",
        },
      };

      const signedTx = await createWalletClient(account).signXPTransaction({
        tx,
        chainAlias: "C",
        context: testContext,
      });

      expect(tx.getCredentials()[0]!.getSignatures()).toEqual([
        emptySignature,
      ]);
      expect(signedTx.signatures).toBeUndefined();
    });
  });
});
