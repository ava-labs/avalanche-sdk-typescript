import { type Context as ContextType, pvm, utils } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type AddPermissionlessDelegatorTxParams = CommonTxParams & {
    stakeInAvax: number;
    nodeId: string;
    end: number;
    rewardAddresses: string[];
    threshold?: number;
    locktime?: number;
}

export class AddPermissionlessDelegatorTx extends Transaction {}

export async function newAddPermissionlessDelegatorTx(
    params: AddPermissionlessDelegatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<AddPermissionlessDelegatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newAddPermissionlessDelegatorTx({
        ...commonTxParams,
        weight: BigInt(params.stakeInAvax * 1e9),
        nodeId: params.nodeId,
        start: 0n, // start time is not relevant after Durango upgrade
        end: BigInt(params.end),
        rewardAddresses: params.rewardAddresses.map(address => utils.hexToBuffer(address)),
        threshold: params.threshold ?? 1,
        locktime: BigInt(params.locktime ?? 0n),
        subnetId: '11111111111111111111111111111111LpoYY' // accept only Primary Network staking for permissionless validators
    }, context)
    return new AddPermissionlessDelegatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
