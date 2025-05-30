import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction, type SubnetTransactionParams } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type AddSubnetValidatorTxParams = CommonTxParams & {
    /**
     * Subnet ID to add the validator to.
     */
    subnetId: string;
    /**
     * Node ID of the validator being added.
     */
    nodeId: string;
    /**
     * Weight of the validator that will be used during
     * consensus.
     */
    weight: bigint;
    /**
     * End timestamp in seconds after which the subnet validator
     * will be removed from the subnet's validator set.
     */
    end: bigint;
    /**
     * Array of indices from the subnet's owners array
     * who will sign this `AddSubnetValidatorTx`.
     */
    subnetAuth: readonly number[];
}

export class AddSubnetValidatorTx extends SubnetTransaction {
    override tx: pvmSerial.AddSubnetValidatorTx;

    constructor(params: SubnetTransactionParams) {
        const subnetTx = params.unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx
        super(params, subnetTx.getSubnetAuth().values())
        this.tx = subnetTx
    }
}

export async function newAddSubnetValidatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: AddSubnetValidatorTxParams,
): Promise<AddSubnetValidatorTx> {
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
        subnetOwners,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
