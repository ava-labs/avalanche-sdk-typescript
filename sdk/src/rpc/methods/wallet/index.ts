export {
    type AvalancheWalletRpcSchema,

    getAccountPubKey,
    type GetAccountPubKeyErrorType,
    type GetAccountPubKeyReturnType,

    sendXPTransaction,
    type SendXPTransactionErrorType,
    type SendXPTransactionParameters,
    type SendXPTransactionReturnType,
    
    signXPMessage,
    type SignXPMessageErrorType,
    type SignXPMessageParameters,
    type SignXPMessageReturnType,

    signXPTransaction,
    type SignXPTransactionErrorType,
    type SignXPTransactionParameters,
    type SignXPTransactionReturnType,
} from "@avalanche-sdk/client/methods/wallet";
