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

export type AvalancheWalletRpcSchema = RpcSchemaOverride &
  AvalancheWalletMethods;
