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
  sendXPTransaction: (
    args: SendXPTransactionParameters
  ) => Promise<SendXPTransactionReturnType>;
  signXPMessage: (
    args: SignXPMessageParameters
  ) => Promise<SignXPMessageReturnType>;
  signXPTransaction: (
    args: SignXPTransactionParameters
  ) => Promise<SignXPTransactionReturnType>;
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
