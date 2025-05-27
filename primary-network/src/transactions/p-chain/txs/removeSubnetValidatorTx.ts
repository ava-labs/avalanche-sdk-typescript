import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction, type SubnetTransactionParams } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type RemoveSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    subnetAuth: readonly number[];
}

export class RemoveSubnetValidatorTx extends SubnetTransaction {
    override tx: pvmSerial.RemoveSubnetValidatorTx;

    constructor(params: SubnetTransactionParams) {
        const subnetTx = params.unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx
        super(params, subnetTx.getSubnetAuth().values())
        this.tx = subnetTx
    }
}

export async function newRemoveSubnetValidatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: RemoveSubnetValidatorTxParams,
): Promise<RemoveSubnetValidatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams, subnetOwners } = await fetchCommonTxParams(
        params,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
        undefined,
        params.subnetId
    )
    if (!subnetOwners) {
        throw new Error("Subnet owners not found for a Subnet tx")
    }

    const unsignedTx = pvm.newRemoveSubnetValidatorTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        nodeId: params.nodeId,
        subnetAuth: params.subnetAuth,
    }, context)

    return new RemoveSubnetValidatorTx({
        unsignedTx,
        subnetOwners,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
