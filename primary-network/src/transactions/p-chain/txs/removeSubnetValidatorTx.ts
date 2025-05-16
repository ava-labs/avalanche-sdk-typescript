import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type RemoveSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    subnetAuth: readonly number[];
}

export class RemoveSubnetValidatorTx extends SubnetTransaction {
    override tx: pvmSerial.RemoveSubnetValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx
    }
}

export async function newRemoveSubnetValidatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: RemoveSubnetValidatorTxParams,
): Promise<RemoveSubnetValidatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newRemoveSubnetValidatorTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        nodeId: params.nodeId,
        subnetAuth: params.subnetAuth,
    }, context)

    return new RemoveSubnetValidatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
