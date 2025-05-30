import { Chain, Transport } from "viem";
import { getAccountPubKey } from "../../methods/wallet/getAccountPubKey.js";
import { sendXPTransaction } from "../../methods/wallet/sendXPTransaction.js";
import { signXPMessage } from "../../methods/wallet/signXPMessage.js";
import { signXPTransaction } from "../../methods/wallet/signXPTransaction.js";
import { GetAccountPubKeyReturnType } from "../../methods/wallet/types/getAccountPubKey.js";
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
   * import { createAvalancheWalletClient } from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const result = await client.sendXPTransaction({
   *   amount: "1000000000",
   *   to: "X-avax1...",
   *   assetID: "AVAX"
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const result = await client.sendXPTransaction({
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
   * import { createAvalancheWalletClient } from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const signedMessage = await client.signXPMessage({
   *   message: "Hello Avalanche",
   *   address: "X-avax1..."
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const signedMessage = await client.signXPMessage({
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
   * import { createAvalancheWalletClient } from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const signedTx = await client.signXPTransaction({
   *   tx: "0x...",
   *   address: "X-avax1..."
   * })
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const signedTx = await client.signXPTransaction({
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
   * import { createAvalancheWalletClient } from '@avalanche-sdk/rpc'
   * import { avalanche } from '@avalanche-sdk/rpc/chains'
   *
   * // You can pass a local account otherwise a custom provider can be used
   * const account = privateKeyToAvalancheAccount("0x...")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: { type: "http" },
   * })
   *
   * const pubKey = await client.getAccountPubKey()
   *
   * // Or you can use a custom provider (e.g. window.avalanche, window.ethereum, etc.)
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: { type: "custom", provider: window.avalanche! },
   * })
   *
   * const pubKey = await client.getAccountPubKey()
   * ```
   */
  getAccountPubKey: () => Promise<GetAccountPubKeyReturnType>;
};

export function avalancheWalletActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): AvalancheWalletActions {
  return {
    sendXPTransaction: (args) => sendXPTransaction(client, args),
    signXPMessage: (args) => signXPMessage(client, args),
    signXPTransaction: (args) => signXPTransaction(client, args),
    getAccountPubKey: () => getAccountPubKey(client),
  };
}
