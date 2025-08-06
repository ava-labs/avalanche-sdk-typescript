export type { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
export { getAccountPubKey } from "./getAccountPubKey.js";
export { send } from "./send.js";
export { sendXPTransaction } from "./sendXPTransaction.js";
export { signXPMessage } from "./signXPMessage.js";
export { signXPTransaction } from "./signXPTransaction.js";
export type {
  CommonTxParams,
  FormattedCommonAVMTxParams,
  FormattedCommonPVMTxParams,
  FormattedCommonTxParams,
  Output,
} from "./types/common.js";
export type {
  GetAccountPubKeyErrorType,
  GetAccountPubKeyReturnType,
} from "./types/getAccountPubKey.js";
export type {
  SendErrorType,
  SendParameters,
  SendReturnType,
  TransactionDetails,
} from "./types/send.js";
export type {
  SendXPTransactionErrorType,
  SendXPTransactionParameters,
  SendXPTransactionReturnType,
} from "./types/sendXPTransaction.js";
export type {
  SignXPMessageErrorType,
  SignXPMessageParameters,
  SignXPMessageReturnType,
} from "./types/signXPMessage.js";
export type {
  Signatures,
  SignXPTransactionErrorType,
  SignXPTransactionParameters,
  SignXPTransactionReturnType,
} from "./types/signXPTransaction.js";
export type {
  WaitForTxnErrorType,
  WaitForTxnParameters,
} from "./types/waitForTxn.js";
export { addOrModifyXPAddressesAlias as addOrModifyXPAddressAlias } from "./utils.js";
export { waitForTxn } from "./waitForTxn.js";

export * from "./types/common.js";
