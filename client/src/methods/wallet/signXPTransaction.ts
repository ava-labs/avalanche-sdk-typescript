import {
  Address,
  avaxSerial,
  Credential,
  EVMUnsignedTx,
  evmSerial,
  Signature,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { Account, concatHex, Hex, parseSignature, toHex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { publicKeyToXPAddress } from "../../accounts/utils/publicKeyToXPAddress.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
import { getUtxosForAddress } from "../../utils/getUtxosForAddress.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import { SepkSignatureLength } from "./constants.js";
import { getContextFromURI, getHRP } from "./getContextFromURI.js";
import {
  Signatures,
  SignXPTransactionParameters,
  SignXPTransactionReturnType,
} from "./types/signXPTransaction.js";
import {
  addPChainOwnerAuthSignature,
  getChainIdFromAlias,
  isTxImportExport,
} from "./utils.js";

const emptySignatureHex = new Signature(
  new Uint8Array(SepkSignatureLength)
).toString();

/**
 * Gets a C-Chain export tx from its hex as an UnsignedTx that knows the
 * addresses that sign it. Its inputs are EVM inputs, not UTXOs.
 * @param txHex - The tx hex, with or without credentials
 * @returns The UnsignedTx, or undefined if the tx is not a C-Chain export
 */
function getCChainExportTxFromHex(txHex: string): UnsignedTx | undefined {
  const [txn, credentials] = getTxFromBytes(txHex, "C");
  if (!evmSerial.isExportTx(txn)) {
    return undefined;
  }

  // The node checks that credential i holds 1 signature by the address of
  // input i
  return new EVMUnsignedTx(
    txn,
    [],
    new utils.AddressMaps(
      txn.ins.map((input) => new utils.AddressMap([[input.address, 0]]))
    ),
    credentials.length > 0
      ? credentials
      : txn.ins.map(
          () =>
            new Credential([new Signature(new Uint8Array(SepkSignatureLength))])
        )
  );
}

/**
 * Signs the inputs of a tx that the EVM address of the account owns and that
 * are not signed yet. A C-Chain export spends inputs of the EVM address. When
 * the account has different EVM and X/P keys, like the accounts of
 * `mnemonicsToAvalancheAccount`, the X/P key cannot sign them.
 * @param tx - The tx to sign {@link UnsignedTx}
 * @param evmAccount - The EVM account {@link Account}
 * @returns The signatures added to the tx {@link Signatures}
 */
async function signEVMAddressInputs(
  tx: UnsignedTx,
  evmAccount: Account | undefined
): Promise<Signatures[]> {
  // Only accounts that can sign a hash, like viem local accounts
  if (!evmAccount?.sign) {
    return [];
  }

  const credentials = tx.getCredentials();
  const sigIndices = (
    tx.getSigIndicesForAddress(
      new Address(utils.hexToBuffer(evmAccount.address))
    ) ?? []
  ).filter(
    ([credIndex, sigIndex]) =>
      credentials[credIndex]?.getSignatures()[sigIndex] === emptySignatureHex
  );
  if (sigIndices.length === 0) {
    return [];
  }

  // Sign the hash that xpAccount.signTransaction signs
  const { r, s, yParity } = parseSignature(
    await evmAccount.sign({ hash: toHex(sha256(tx.toBytes())) })
  );
  // viem ends the signature with v (27 or 28), avalanchejs with the
  // recovery id (0 or 1)
  const signature = utils.hexToBuffer(
    concatHex([r, s, toHex(yParity, { size: 1 })])
  );
  sigIndices.forEach(([credIndex, sigIndex]) =>
    tx.addSignatureAt(signature, credIndex, sigIndex)
  );

  return sigIndices.map((sig) => ({
    signature: utils.bufferToHex(signature),
    sigIndices: sig,
  }));
}

/**
 * Formats an XP address with the chain alias prefix
 * @param chainAlias - The chain alias (X or P)
 * @param address - The XP address
 * @returns The formatted address with chain alias prefix
 */
export function formatChainAddress(
  chainAlias: "X" | "P" | "C",
  address: string
): string {
  return `${chainAlias}-${address}`;
}

/**
 * Sign an XP transaction
 * @param client - The client to use {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction {@link SignXPTransactionParameters}
 * @returns The signed transaction {@link SignXPTransactionReturnType}
 *
 * @example
 *
 * import { createWalletCoreClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { signXPTransaction } from '@avalanche-sdk/client/methods/wallet'
 *
 * const client = createWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "custom",
 *     provider: window.avalanche!,
 *   },
 * })
 *
 * const signedTx = await signXPTransaction(client, {
 *   txOrTxHex: "0x...",
 *   chainAlias: "P",
 *   utxos: [],
 * })
 */
export async function signXPTransaction(
  client: AvalancheWalletCoreClient,
  params: SignXPTransactionParameters
): Promise<SignXPTransactionReturnType> {
  const {
    tx,
    signedTxHex,
    chainAlias,
    account,
    utxoIds,
    subnetAuth,
    subnetOwners,
    disableOwners,
    disableAuth,
    autoRenewedValidatorOwners,
    autoRenewedValidatorAuth,
  } = params;

  let txOrTxHex = tx || signedTxHex;

  if (!txOrTxHex) {
    throw new Error("Either tx or signedTxHex must be provided");
  }

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;
  const evmAccount = paramAc?.evmAccount ?? client.account;

  // Always get the actual network ID from the node to determine the correct HRP
  // Don't rely on chain.testnet flag as it doesn't distinguish between different test networks
  const context = params.context || (await getContextFromURI(client));
  const networkId = context.networkID;
  const hrp = getHRP(networkId);

  if (xpAccount) {
    const xpAddress = publicKeyToXPAddress(
      xpAccount.publicKey,
      hrp
    );

    // The hex path below finds the signers from the UTXOs that the inputs
    // spend, and the inputs of a C-Chain export are not UTXOs
    if (typeof txOrTxHex === "string" && chainAlias === "C") {
      txOrTxHex = getCChainExportTxFromHex(txOrTxHex) ?? txOrTxHex;
    }

    if (typeof txOrTxHex === "string") {
      // Get the tx and credentials from the txHex
      let [txn, credentials] = getTxFromBytes(txOrTxHex, chainAlias);
      // If there are no credentials, create empty credentials for all the inputs
      const txSigIndices = txn.getSigIndices();
      if (credentials.length === 0) {
        credentials = txSigIndices.map((sigs) => {
          const signatures = sigs.map((_) => {
            return new Signature(
              new Uint8Array(Array(SepkSignatureLength).fill(0))
            );
          });
          return new Credential(signatures);
        });
      }

      // Sign the tx and get the signature
      const signature = utils.hexToBuffer(
        await xpAccount.signTransaction(
          new UnsignedTx(
            txn,
            [],
            new utils.AddressMaps(),
            credentials
          ).toBytes()
        )
      );

      // Fetch the utxoIds from all the inputs
      const utxoIds = ((txn as any).baseTx as avaxSerial.BaseTx).inputs.map(
        (input) => input.utxoID
      );

      // Fetch the utxos for the account address
      const utxos = await getUtxosForAddress(client, {
        address: formatChainAddress(chainAlias, xpAddress),
        chainAlias,
        ...(isTxImportExport(txn) && {
          sourceChain: getChainIdFromAlias(chainAlias, networkId),
        }),
      });

      // If no utxos are found, throw an error
      if (utxos.length === 0) {
        throw new Error("No utxos found for the account address");
      }

      // Get the signature indices for the utxos of current address
      const addrSigIndices: number[][] = [];
      utxoIds.forEach((utxoId, idx) => {
        const utxo = utxos.find(
          (utxo) =>
            utxo.utxoId.ID() === utxoId.ID() &&
            utxo.utxoId.outputIdx.toJSON() === utxoId.outputIdx.toJSON()
        );
        if (utxo) {
          addrSigIndices.push([
            idx,
            utxo
              .getOutputOwners()
              .addrs.findIndex(
                (add) => add.toString(hrp) === xpAddress
              ),
          ]);
        }
      });

      // Set the signature for the credentials
      addrSigIndices.forEach((sig) => {
        const sigIndex = sig[0]!;
        const addrIndex = sig[1]!;
        credentials[sigIndex]?.setSignature(addrIndex, signature);
      });

      const ownerAuth =
        subnetOwners && subnetAuth
          ? { owners: subnetOwners, auth: subnetAuth }
          : disableOwners && disableAuth
            ? { owners: disableOwners, auth: disableAuth }
            : autoRenewedValidatorOwners && autoRenewedValidatorAuth
              ? {
                  owners: autoRenewedValidatorOwners,
                  auth: autoRenewedValidatorAuth,
                }
              : undefined;

      if (ownerAuth) {
        const owners = ownerAuth.owners;
        const authIndices = ownerAuth.auth;

        // Get the addresses that need to sign based on subnetAuth indices
        const signingOwners = owners.addresses.filter((_, index) =>
          authIndices.includes(index)
        );

        // Last credential index is for the subnet auth signatures
        const credentialIndex = credentials.length - 1;

        const signerIndex = signingOwners.findIndex(
          (owner) => owner.toString(hrp) === xpAddress
        );

        if (signerIndex !== -1) {
          addrSigIndices.push([credentialIndex, signerIndex]);
          credentials[credentialIndex]?.setSignature(signerIndex, signature);
        }
      }

      // Serialize the signed tx
      const signedTx = utils.bufferToHex(
        utils.addChecksum(new avaxSerial.SignedTx(txn, credentials).toBytes())
      ) as Hex;

      return {
        signedTxHex: signedTx,
        signatures: addrSigIndices.map((sig) => {
          return {
            signature: utils.bufferToHex(signature),
            sigIndices: sig,
          };
        }),
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
        autoRenewedValidatorOwners,
        autoRenewedValidatorAuth,
        chainAlias,
      };
    } else {
      const tx = txOrTxHex as UnsignedTx;
      const signature = utils.hexToBuffer(
        await xpAccount.signTransaction(txOrTxHex.toBytes())
      );
      tx.addSignature(signature);
      const evmSignatures = await signEVMAddressInputs(tx, evmAccount);

      const ownerAuth =
        subnetOwners && subnetAuth
          ? { owners: subnetOwners, auth: subnetAuth }
          : disableOwners && disableAuth
            ? { owners: disableOwners, auth: disableAuth }
            : autoRenewedValidatorOwners && autoRenewedValidatorAuth
              ? {
                  owners: autoRenewedValidatorOwners,
                  auth: autoRenewedValidatorAuth,
                }
              : undefined;

      if (ownerAuth) {
        addPChainOwnerAuthSignature(
          tx,
          ownerAuth.owners,
          ownerAuth.auth,
          signature,
          xpAccount.publicKey
        );
      }
      const xpSignatures = tx
        .getSigIndicesForPubKey(utils.hexToBuffer(xpAccount.publicKey))
        ?.map((sig) => {
          return {
            signature: utils.bufferToHex(signature),
            sigIndices: sig,
          };
        });
      return {
        signedTxHex: utils.bufferToHex(
          utils.addChecksum(tx.getSignedTx().toBytes())
        ),
        signatures:
          evmSignatures.length > 0
            ? [...(xpSignatures ?? []), ...evmSignatures]
            : xpSignatures,
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
        autoRenewedValidatorOwners,
        autoRenewedValidatorAuth,
        chainAlias,
      };
    }
  }

  const response = await client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_signTransaction";
      params: Omit<
        SignXPTransactionParameters,
        | "account"
        | "tx"
        | "utxoIds"
        | "subnetAuth"
        | "subnetOwners"
        | "disableOwners"
        | "disableAuth"
      > & {
        transactionHex: string;
        utxos: string[] | undefined;
      };
    },
    SignXPTransactionReturnType & {
      signedTransactionHex: string;
    }
  >({
    method: "avalanche_signTransaction",
    params: {
      transactionHex:
        typeof txOrTxHex === "string"
          ? txOrTxHex
          : utils.bufferToHex(txOrTxHex.toBytes()),
      chainAlias,
      utxos: utxoIds,
    },
  });

  return {
    signedTxHex: response.signedTransactionHex,
    signatures: response.signatures,
    subnetAuth,
    subnetOwners,
    disableOwners,
    disableAuth,
    chainAlias,
  };
}
