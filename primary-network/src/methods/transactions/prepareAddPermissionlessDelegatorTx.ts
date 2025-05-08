import { pvm, type pvmSerial, utils } from "@avalabs/avalanchejs";
import type { Account, Chain, Transport } from "@avalanche-sdk/rpc";
import { PrimaryNetworkCoreClient } from "../../clients/primaryNetworkCoreClient";
import type { CommonTxParams } from "../../types/common";
import type { AddPermissionlessDelegatorTx } from "../../types/transactions";
import { createNewTransaction } from "../../utils/transactions";
import { fetchCommonTxParams } from "../../utils/utils";

export type PrepareAddPermissionlessDelegatorTxParameters = CommonTxParams & {
  stakeInAvax: number;
  nodeId: string;
  end: number;
  rewardAddresses: string[];
  threshold?: number;
  locktime?: number;
};

export type PrepareAddPermissionlessDelegatorTxReturnType =
  AddPermissionlessDelegatorTx;

export async function prepareAddPermissionlessDelegatorTx<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined
>(
  client: PrimaryNetworkCoreClient<transport, chain, account>,
  params: PrepareAddPermissionlessDelegatorTxParameters
): Promise<PrepareAddPermissionlessDelegatorTxReturnType> {
  const commonTxParams = await fetchCommonTxParams(client, params, "P");

  const unsignedTx = pvm.newAddPermissionlessDelegatorTx(
    {
      ...commonTxParams,
      weight: BigInt(params.stakeInAvax * 1e9),
      nodeId: params.nodeId,
      start: 0n, // start time is not relevant after Durango upgrade
      end: BigInt(params.end),
      rewardAddresses: params.rewardAddresses.map((address) =>
        utils.hexToBuffer(address)
      ),
      threshold: params.threshold ?? 1,
      locktime: BigInt(params.locktime ?? 0n),
      subnetId: "11111111111111111111111111111111LpoYY", // accept only Primary Network staking for permissionless validators
    },
    client.context
  );

  return createNewTransaction<pvmSerial.AddPermissionlessDelegatorTx>({
    unsignedTx,
    nodeUrl: client.nodeUrl,
  });
}
