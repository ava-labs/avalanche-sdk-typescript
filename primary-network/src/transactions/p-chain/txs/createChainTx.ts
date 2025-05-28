import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction, type SubnetTransactionParams } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type CreateChainTxParams = CommonTxParams & {
    /**
     * Subnet ID to create the chain on.
     */
    subnetId: string;
    /**
     * VM ID of the chain being created.
     */
    vmId: string;
    /**
     * Name of the chain being created.
     */
    chainName: string;
    /**
     * Genesis JSON data of the chain being created.
     */
    genesisData: Record<string, unknown>;
    /**
     * Array of indices from the subnet's owners array
     * who will sign this `CreateChainTx`.
     */
    subnetAuth: number[];
    /**
     * Optional. Array of FX IDs to be added to the chain.
     */
    fxIds?: string[];
}

export class CreateChainTx extends SubnetTransaction {
    override tx: pvmSerial.CreateChainTx;

    constructor(params: SubnetTransactionParams) {
        const subnetTx = params.unsignedTx.getTx() as pvmSerial.CreateChainTx
        super(params, subnetTx.getSubnetAuth().values())
        this.tx = subnetTx
    }
}

export async function newCreateChainTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: CreateChainTxParams,
): Promise<CreateChainTx> {
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

    const unsignedTx = pvm.newCreateChainTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        vmId: params.vmId,
        chainName: params.chainName,
        genesisData: params.genesisData,
        subnetAuth: params.subnetAuth,
        fxIds: params.fxIds ?? [],
    }, context)

    return new CreateChainTx({
        unsignedTx,
        subnetOwners,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
