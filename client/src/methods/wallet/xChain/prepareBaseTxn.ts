import { avm, avmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { X_CHAIN_ALIAS } from "../../../methods/consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonAVMTxParams, formatOutput } from "../utils.js";
import {
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
} from "./types/prepareBaseTxn.js";

/**
 * Prepares a base transaction for the X-chain.
 *
 * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-basetx
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareBaseTxnParameters}
 * @returns The unsigned transaction. {@link PrepareBaseTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareBaseTxn } from "@avalanche-sdk/client/methods/wallet/xChain";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 * import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
 *
 * const account = privateKeyToAvalancheAccount(privateKeyForTest);
 * const walletClient = new AvalancheWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     url: "https://api.avax.network/ext/bc/C/rpc",
 *   },
 *   account,
 * });
 *
 * const xChainBaseTxnRequest = await prepareBaseTxn(walletClient, {
 *   outputs: [
 *     {
 *       amount: avaxToNanoAvax(0.0001), // 0.0001 AVAX = 100_000 nAVAX
 *       to: "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
 *     },
 *   ],
 * });
 */
export async function prepareBaseTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareBaseTxnParameters
): Promise<PrepareBaseTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonAVMTxParams(client, {
    txParams: params,
    context,
  });

  const formattedOutputs = params.outputs
    ? params.outputs.map((output) => formatOutput(output, context))
    : [];

  const unsignedTx = avm.newBaseTx(
    context,
    commonTxParams.fromAddressesBytes,
    commonTxParams.utxos,
    formattedOutputs,
    {
      ...(commonTxParams.changeAddressesBytes && {
        changeAddresses: commonTxParams.changeAddressesBytes,
      }),
      ...(commonTxParams.minIssuanceTime && {
        minIssuanceTime: commonTxParams.minIssuanceTime,
      }),
      ...(commonTxParams.memo && { memo: commonTxParams.memo }),
    }
  );

  return {
    tx: unsignedTx,
    baseTx: unsignedTx.getTx() as avmSerial.BaseTx,
    chainAlias: X_CHAIN_ALIAS,
  };
}
