import { RpcSchemaOverride } from "viem";
import { GetAccountPubKeyMethod } from "./types/getAccountPubKey.js";
import { SendXPTransactionMethod } from "./types/sendXPTransaction.js";
import { SignXPMessageMethod } from "./types/signXPMessage.js";
import { SignXPTransactionMethod } from "./types/signXPTransaction.js";

export type AvalancheWalletMethods = [
  SendXPTransactionMethod,
  SignXPMessageMethod,
  SignXPTransactionMethod,
  GetAccountPubKeyMethod
];

/**
 * The RPC schema for the Avalanche Wallet methods.
 *
 * @see {@link AvalancheWalletMethods}
 */
export type AvalancheWalletRpcSchema = RpcSchemaOverride &
  AvalancheWalletMethods;
