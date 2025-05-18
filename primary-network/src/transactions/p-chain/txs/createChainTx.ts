import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type CreateChainTxParams = CommonTxParams & {
    subnetId: string;
    vmId: string;
    chainName: string;
    genesisData: Record<string, unknown>;
    subnetAuth: number[];
    fxIds?: string[];
}

export class CreateChainTx extends SubnetTransaction {
    override tx: pvmSerial.CreateChainTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.CreateChainTx
    }
}

export async function newCreateChainTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: CreateChainTxParams,
): Promise<CreateChainTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

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
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
