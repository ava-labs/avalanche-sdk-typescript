import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { bech32AddressToBytes, fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type AddPermissionlessDelegatorTxParams = CommonTxParams & {
    /**
     * Amount of AVAX to stake. This amount will be locked until
     * the end of the staking period. The staked outputs will be
     * consolidated into a single output and owned by the
     * `changeAddresses` or the `fromAddresses` array.
     */
    stakeInAvax: number;
    /**
     * NodeID of the validator to delegate AVAX to.
     */
    nodeId: string;
    /**
     * The Unix time in seconds when the delegation stops
     * (and staked AVAX is returned).
    */
    end: number;
    /**
     * The addresses which will receive the rewards from the delegated stake.
     * Given addresses will share the reward UTXO.
    */
    rewardAddresses: string[];
    /**
     * Optional. The number of signatures required to spend the funds in the
     * resultant reward UTXO.
     * @default 1
     */
    threshold?: number;
    /**
     * Optional. The unix timestamp in seconds after which the reward UTXO
     * can be spent, once they are created after the staking period ends.
     * @default 0
     */
    locktime?: number;
}

export class AddPermissionlessDelegatorTx extends Transaction {
    override tx: pvmSerial.AddPermissionlessDelegatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.AddPermissionlessDelegatorTx
    }

    getStakeOutputs() {
        const transferableOutputs = this.tx.stake
        return transferableOutputs.map((transferableOutput) => {
            return {
                ...transferableOutput,
                output: transferableOutput.output as unknown as pvmSerial.StakeableLockOut
            }
        })
    }
}

export async function newAddPermissionlessDelegatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: AddPermissionlessDelegatorTxParams,
): Promise<AddPermissionlessDelegatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newAddPermissionlessDelegatorTx({
        ...commonTxParams,
        weight: BigInt(params.stakeInAvax * 1e9),
        nodeId: params.nodeId,
        start: 0n, // start time is not relevant after Durango upgrade
        end: BigInt(params.end),
        rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
        threshold: params.threshold ?? 1,
        locktime: BigInt(params.locktime ?? 0n),
        subnetId: '11111111111111111111111111111111LpoYY' // accept only Primary Network staking for permissionless validators
    }, context)

    return new AddPermissionlessDelegatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
