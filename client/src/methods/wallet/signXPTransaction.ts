import {
  avaxSerial,
  Credential,
  Signature,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { publicKeyToXPAddress } from "../../accounts/utils/publicKeyToXPAddress.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
import { getUtxosForAddress } from "../../utils/getUtxosForAddress.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import { SepkSignatureLength } from "./constants.js";
import { getContextFromURI } from "./getContextFromURI.js";
import {
  SignXPTransactionParameters,
  SignXPTransactionReturnType,
} from "./types/signXPTransaction.js";
import {
  addPChainOwnerAuthSignature,
  getChainIdFromAlias,
  isTxImportExport,
} from "./utils.js";

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
  } = params;

  const txOrTxHex = tx || signedTxHex;

  if (!txOrTxHex) {
    throw new Error("Either tx or signedTxHex must be provided");
  }

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;

  let isTestnet, networkId;
  if (client.chain?.testnet) {
    isTestnet = client.chain?.testnet;
    networkId = isTestnet ? 5 : 1;
  } else {
    const context = params.context || (await getContextFromURI(client));
    isTestnet = context.networkID === 5;
    networkId = context.networkID;
  }

  if (xpAccount) {
    const xpAddress = publicKeyToXPAddress(
      xpAccount.publicKey,
      isTestnet ? "fuji" : "avax"
    );

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
                (add) => add.toString(isTestnet ? "fuji" : "avax") === xpAddress
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

      if ((subnetOwners && subnetAuth) || (disableOwners && disableAuth)) {
        const owners = (subnetOwners ?? disableOwners)!;
        const authIndices = (subnetAuth ?? disableAuth) || [];

        // Get the addresses that need to sign based on subnetAuth indices
        const signingOwners = owners.addresses.filter((_, index) =>
          authIndices.includes(index)
        );

        // Last credential index is for the subnet auth signatures
        const credentialIndex = credentials.length - 1;

        const signerIndex = signingOwners.findIndex(
          (owner) => owner.toString(isTestnet ? "fuji" : "avax") === xpAddress
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
        chainAlias,
      };
    } else {
      const tx = txOrTxHex as UnsignedTx;
      const signature = utils.hexToBuffer(
        await xpAccount.signTransaction(txOrTxHex.toBytes())
      );
      tx.addSignature(signature);

      if ((subnetOwners && subnetAuth) || (disableOwners && disableAuth)) {
        addPChainOwnerAuthSignature(
          tx,
          (subnetOwners ?? disableOwners)!,
          (subnetAuth ?? disableAuth) || [],
          signature,
          xpAccount.publicKey
        );
      }
      return {
        signedTxHex: utils.bufferToHex(
          utils.addChecksum(tx.getSignedTx().toBytes())
        ),
        signatures: tx
          .getSigIndicesForPubKey(utils.hexToBuffer(xpAccount.publicKey))
          ?.map((sig) => {
            return {
              signature: utils.bufferToHex(signature),
              sigIndices: sig,
            };
          }),
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
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
