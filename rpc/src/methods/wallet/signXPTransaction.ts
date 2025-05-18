import { UnsignedTx, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import {
  SignXPTransactionParameters,
  SignXPTransactionReturnType,
} from "./types/signXPTransaction.js";
export async function signXPTransaction(
  client: AvalancheWalletCoreClient,
  params: SignXPTransactionParameters
): Promise<SignXPTransactionReturnType> {
  const { txHex, chainAlias, account, utxos } = params;

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;

  if (xpAccount) {
    const [tx] = getTxFromBytes(txHex, chainAlias);
    const signature = utils.hexToBuffer(await xpAccount.signTransaction(txHex));
    const unsignedTx = new UnsignedTx(tx, [], new utils.AddressMaps());
    unsignedTx.addSignature(signature);
    const signedTx = utils.bufferToHex(
      utils.addChecksum(unsignedTx.getSignedTx().toBytes())
    ) as Hex;
    return {
      signedTxHex: signedTx,
      signatures: [{ signature: signature.toString(), sigIndices: [0] }],
    };
  }

  return client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_signTransaction";
      params: Omit<SignXPTransactionParameters, "account">;
    },
    SignXPTransactionReturnType
  >({
    method: "avalanche_signTransaction",
    params: { txHex, chainAlias, utxos },
  });
}
