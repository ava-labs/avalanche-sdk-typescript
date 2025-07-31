import { Chain, Transport } from "viem";
import { getAccountPubKey } from "../../methods/wallet/getAccountPubKey.js";
import { send } from "../../methods/wallet/send.js";
import { sendXPTransaction } from "../../methods/wallet/sendXPTransaction.js";
import { signXPMessage } from "../../methods/wallet/signXPMessage.js";
import { signXPTransaction } from "../../methods/wallet/signXPTransaction.js";
import { GetAccountPubKeyReturnType } from "../../methods/wallet/types/getAccountPubKey.js";
import {
  SendParameters,
  SendReturnType,
} from "../../methods/wallet/types/send.js";
import {
  SendXPTransactionParameters,
  SendXPTransactionReturnType,
} from "../../methods/wallet/types/sendXPTransaction.js";
import {
  SignXPMessageParameters,
  SignXPMessageReturnType,
} from "../../methods/wallet/types/signXPMessage.js";
import {
  SignXPTransactionParameters,
  SignXPTransactionReturnType,
} from "../../methods/wallet/types/signXPTransaction.js";
import { WaitForTxnParameters } from "../../methods/wallet/types/waitForTxn.js";
import { waitForTxn } from "../../methods/wallet/waitForTxn.js";
import { AvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";

export type AvalancheWalletActions = {
  /**
   * Sends an XP transaction to the network.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avm_send
   *
   * @param args - The parameters for sending the transaction. {@link SendXPTransactionParameters}
   * @returns A promise that resolves to the transaction result. {@link SendXPTransactionReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const walletClient = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const result = await walletClient.sendXPTransaction({
   *   amount: "1000000000",
   *   to: "X-avax1...",
   *   assetID: "AVAX"
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const result = await walletClient.sendXPTransaction({
   *   amount: "1000000000",
   *   to: "X-avax1...",
   *   assetID: "AVAX"
   * })
   * ```
   */
  sendXPTransaction: (
    args: SendXPTransactionParameters
  ) => Promise<SendXPTransactionReturnType>;

  /**
   * Signs a message using the wallet's private key.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avm_signmessage
   *
   * @param args - The parameters for signing the message. {@link SignXPMessageParameters}
   * @returns A promise that resolves to the signed message. {@link SignXPMessageReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const walletClient = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const signedMessage = await walletClient.signXPMessage({
   *   message: "Hello Avalanche",
   *   address: "X-avax1..."
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const signedMessage = await walletClient.signXPMessage({
   *   message: "Hello Avalanche",
   *   address: "X-avax1..."
   * })
   * ```
   */
  signXPMessage: (
    args: SignXPMessageParameters
  ) => Promise<SignXPMessageReturnType>;

  /**
   * Signs an XP transaction using the wallet's private key.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avm_signtx
   *
   * @param args - The parameters for signing the transaction. {@link SignXPTransactionParameters}
   * @returns A promise that resolves to the signed transaction. {@link SignXPTransactionReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const walletClient = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const signedTx = await walletClient.signXPTransaction({
   *   tx: "0x...",
   *   address: "X-avax1..."
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const signedTx = await walletClient.signXPTransaction({
   *   tx: "0x...",
   *   address: "X-avax1..."
   * })
   * ```
   */
  signXPTransaction: (
    args: SignXPTransactionParameters
  ) => Promise<SignXPTransactionReturnType>;

  /**
   * Gets the public key associated with the wallet account.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avm_getaccountpubkey
   *
   * @returns A promise that resolves to the account's public key. {@link GetAccountPubKeyReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const walletClient = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const pubKey = await walletClient.getAccountPubKey()
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const pubKey = await walletClient.getAccountPubKey()
   * ```
   */
  getAccountPubKey: () => Promise<GetAccountPubKeyReturnType>;

  /**
   * Waits for a transaction to be confirmed on the network.
   *
   * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avm_waittx
   *
   * @param args - The parameters for waiting for the transaction. {@link WaitForTxnParameters}
   * @returns A promise that resolves when the transaction is confirmed.
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const result = await walletClient.waitForTxn({
   *   txID: "0x...",
   *   chainAlias: "P"
   * })
   * ```
   */
  waitForTxn: (args: WaitForTxnParameters) => Promise<void>;

  /**
   * Sends tokens from the source chain to the destination chain.
   *
   * @param args - The parameters for the transaction. {@link SendParameters}
   * @returns The hashes of the transactions. {@link SendReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const walletClient = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const result = await walletClient.send({
   *   amount: 1,
   *   to: "0x0000000000000000000000000000000000000000",
   * });
   */
  send: (args: SendParameters) => Promise<SendReturnType>;
};

export function avalancheWalletActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): AvalancheWalletActions {
  return {
    sendXPTransaction: (args) => sendXPTransaction(client, args),
    signXPMessage: (args) => signXPMessage(client, args),
    signXPTransaction: (args) => signXPTransaction(client, args),
    getAccountPubKey: () => getAccountPubKey(client),
    waitForTxn: (args) => waitForTxn(client, args),
    send: (args) => send(client, args),
  };
}
