export type { Address } from "viem";

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export { HDKey } from "@scure/bip32";

export {
  czech,
  english,
  french,
  italian,
  japanese,
  korean,
  portuguese,
  simplifiedChinese,
  spanish,
  traditionalChinese,
} from "viem/accounts";

export {
  generateMnemonic,
  generatePrivateKey,
  hdKeyToAccount,
  mnemonicToAccount,
  privateKeyToAccount,
  toAccount,
  type GenerateMnemonicErrorType,
  type GeneratePrivateKeyErrorType,
  type HDKeyToAccountErrorType,
  type HDKeyToAccountOptions,
  type MnemonicToAccountErrorType,
  type MnemonicToAccountOptions,
  type PrivateKeyToAccountErrorType,
  type PrivateKeyToAccountOptions,
  type ToAccountErrorType,
} from "viem/accounts";

export {
  createNonceManager,
  nonceManager,
  parseAccount,
  privateKeyToAddress,
  publicKeyToAddress,
  serializeSignature,
  setSignEntropy,
  sign,
  /** @deprecated Use `serializeSignature` instead. */
  serializeSignature as signatureToHex,
  signAuthorization,
  signMessage,
  signTransaction,
  signTypedData,
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  type ParseAccountErrorType,
  type PrivateKeyToAddressErrorType,
  type PublicKeyToAddressErrorType,
  type SerializeSignatureErrorType,
  /** @deprecated Use `SignatureToHexErrorType` instead. */
  type SerializeSignatureErrorType as SignatureToHexErrorType,
  type SignAuthorizationErrorType,
  type SignAuthorizationParameters,
  type SignAuthorizationReturnType,
  type SignErrorType,
  type SignMessageErrorType,
  type SignMessageParameters,
  type SignMessageReturnType,
  type SignParameters,
  type SignReturnType,
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  type SignTypedDataErrorType,
  type SignTypedDataParameters,
  type SignTypedDataReturnType,
} from "viem/accounts";
export type {
  Account,
  AccountSource,
  CustomSource,
  HDAccount,
  HDOptions,
  JsonRpcAccount,
  LocalAccount,
  PrivateKeyAccount,
} from "viem/accounts";

export { privateKeyToAvalancheAccount } from "./privateKeyToAvalancheAccount";

export { memonicsToAvalancheAccount } from "./memonicsToAvalancheAccount";

export { privateKeyToXPAddress } from "./utils/privateKeyToXPAddress";

export { publicKeyToXPAddress } from "./utils/publicKeyToXPAddress";

export { xpSignMessage } from "./utils/xpSignMessage";
export { xpSignTransaction } from "./utils/xpSignTransaction";

export { xpVerifySignature } from "./utils/xpVerifySignature";

export { xpRecoverPublicKey } from "./utils/xpRecoverPublicKey";

export { privateKeyToXPPublicKey } from "./utils/privateKeyToXPPublicKey";

export { hdKeyToAvalancheAccount } from "./hdKeyToAvalancheAccount";

export type {
  AvalancheAccount,
  LocalXPAccount,
  XPAccount,
  XPAddress,
} from "./avalancheAccount.js";

export { parseAvalancheAccount } from "./utils/parseAvalancheAccount";

export { privateKeyToXPAccount } from "./privateKeyToXPAccount";
export type { PrivateKeyToXPAccountOptions } from "./privateKeyToXPAccount";
