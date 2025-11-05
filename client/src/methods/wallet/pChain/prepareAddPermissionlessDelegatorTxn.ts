import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { bech32AddressToBytes, fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareAddPermissionlessDelegatorTxnParameters,
  PrepareAddPermissionlessDelegatorTxnReturnType,
} from "./types/prepareAddPermissionlessDelegatorTxn.js";

/**
 * Prepares an add permissionless delegator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareAddPermissionlessDelegatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareAddPermissionlessDelegatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-delegator-tx
 *
 * @example
 * ```ts
 * import { prepareAddPermissionlessDelegatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareAddPermissionlessDelegatorTxn";
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
 * const pChainAddPermissionlessDelegatorTxnRequest = await prepareAddPermissionlessDelegatorTxn(walletClient, {
 *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *   stakeInAvax: avaxToNanoAvax(1),
 *   end: 1716441600n,
 *   rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   threshold: 1,
 * });
 *
 * console.log(pChainAddPermissionlessDelegatorTxnRequest);
 * ```
 */
export async function prepareAddPermissionlessDelegatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddPermissionlessDelegatorTxnParameters
): Promise<PrepareAddPermissionlessDelegatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));

  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newAddPermissionlessDelegatorTx(
    {
      ...commonTxParams,
      weight: params.stakeInAvax,
      nodeId: params.nodeId,
      start: 0n, // start time is not relevant after Durango upgrade
      end: params.end,
      rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
      threshold: params.threshold ?? 1,
      locktime: params.locktime ?? 0n,
      subnetId: "11111111111111111111111111111111LpoYY", // accept only Primary Network staking for permissionless validators
    },
    context
  );

  return {
    tx: unsignedTx,
    addPermissionlessDelegatorTx:
      unsignedTx.getTx() as pvmSerial.AddPermissionlessDelegatorTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
