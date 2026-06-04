import {
  avaxSerial,
  BigIntPr,
  Id,
  pvmSerial,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import {
  PrepareRewardAutoRenewedValidatorTxnParameters,
  PrepareRewardAutoRenewedValidatorTxnReturnType,
} from "./types/prepareRewardAutoRenewedValidatorTxn.js";

/**
 * Prepares a reward auto-renewed validator transaction for the P-chain.
 *
 * Reward auto-renewed validator transactions do not have P-Chain wallet
 * signatures. Issue the returned `txHex` with `platform.issueTx`.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareRewardAutoRenewedValidatorTxnParameters}
 * @returns The transaction and issue-ready hex. {@link PrepareRewardAutoRenewedValidatorTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareRewardAutoRenewedValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareRewardAutoRenewedValidatorTxn";
 * import { issueTx } from "@avalanche-sdk/client/methods/pChain";
 *
 * const rewardTxn = await prepareRewardAutoRenewedValidatorTxn(walletClient, {
 *   validatorTxId: "11111111111111111111111111111111LpoYY",
 *   timestamp: 1780576200n,
 * });
 *
 * const issued = await issueTx(walletClient.pChainClient, {
 *   tx: rewardTxn.txHex,
 *   encoding: "hex",
 * });
 * ```
 */
export async function prepareRewardAutoRenewedValidatorTxn(
  _client: AvalancheWalletCoreClient,
  params: PrepareRewardAutoRenewedValidatorTxnParameters
): Promise<PrepareRewardAutoRenewedValidatorTxnReturnType> {
  const rewardAutoRenewedValidatorTx =
    new pvmSerial.RewardAutoRenewedValidatorTx(
      Id.fromString(params.validatorTxId),
      new BigIntPr(params.timestamp)
    );
  const unsignedTx = new UnsignedTx(
    rewardAutoRenewedValidatorTx,
    [],
    new utils.AddressMaps()
  );
  const txHex = utils.bufferToHex(
    utils.addChecksum(
      new avaxSerial.SignedTx(rewardAutoRenewedValidatorTx, []).toBytes()
    )
  );

  return {
    tx: unsignedTx,
    rewardAutoRenewedValidatorTx,
    txHex,
    chainAlias: P_CHAIN_ALIAS,
  };
}
