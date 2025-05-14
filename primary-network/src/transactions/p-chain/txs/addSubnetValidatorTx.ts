import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type AddSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    weight: bigint;
    end: bigint;
    subnetAuth: readonly number[];
}

export class AddSubnetValidatorTx extends SubnetTransaction {
    override tx: pvmSerial.AddSubnetValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx
    }
}

export async function newAddSubnetValidatorTx(
    primaryNetworkCore: PrimaryNetworkCore,
    params: AddSubnetValidatorTxParams,
): Promise<AddSubnetValidatorTx> {
    const context = await primaryNetworkCore.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCore.pvmRpc, primaryNetworkCore.wallet)

    const unsignedTx = pvm.newAddSubnetValidatorTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        nodeId: params.nodeId,
        weight: params.weight,
        start: 0n, // start time is not relevant after Durango upgrade
        end: params.end,
        subnetAuth: params.subnetAuth,
    }, context)

    return new AddSubnetValidatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCore.pvmRpc,
        nodeUrl: primaryNetworkCore.nodeUrl,
        wallet: primaryNetworkCore.wallet,
    })
}
