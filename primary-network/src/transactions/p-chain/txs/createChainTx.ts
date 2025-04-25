import { type Context as ContextType, pvm } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type CreateChainTxParams = CommonTxParams & {
    subnetId: string;
    vmId: string;
    chainName: string;
    genesisData: Record<string, unknown>;
    subnetAuth: number[];
    fxIds?: string[];
}

export class CreateChainTx extends Transaction {}

export async function newCreateChainTx(
    params: CreateChainTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<CreateChainTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newCreateChainTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        vmId: params.vmId,
        chainName: params.chainName,
        genesisData: params.genesisData,
        subnetAuth: params.subnetAuth,
        fxIds: params.fxIds ?? [],
    }, context)
    return new CreateChainTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
