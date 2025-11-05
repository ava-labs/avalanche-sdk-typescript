import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams, formatOutput } from "../utils.js";
import {
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
} from "./types/prepareBaseTxn.js";

/**
 * Prepares a base transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareBaseTxnParameters}
 * @returns The unsigned transaction. {@link PrepareBaseTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-basetx
 *
 * @example
 * ```ts
 * import { prepareBaseTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareBaseTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 * import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const pChainBaseTxnRequest = await prepareBaseTxn(walletClient, {
 *   outputs: [{
 *     addresses: "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
 *     amount: avaxToNanoAvax(1),
 *   }],
 * });
 *
 * console.log(pChainBaseTxnRequest);
 * ```
 */
export async function prepareBaseTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareBaseTxnParameters
): Promise<PrepareBaseTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  // Format outputs as per AvalancheJS
  const formattedOutputs = params.outputs
    ? params.outputs.map((output) => formatOutput(output, context))
    : [];

  const unsignedTx = pvm.newBaseTx(
    {
      ...commonTxParams,
      outputs: formattedOutputs,
    },
    context
  );

  return {
    tx: unsignedTx,
    baseTx: unsignedTx.getTx() as pvmSerial.BaseTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
