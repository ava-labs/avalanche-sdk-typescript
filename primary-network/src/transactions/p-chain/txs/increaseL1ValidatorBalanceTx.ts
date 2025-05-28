import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { avaxToNanoAvax, fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type IncreaseL1ValidatorBalanceTxParams = CommonTxParams & {
    /**
     * Amount of AVAX to increase the L1 validator balance by.
     */
    balanceInAvax: number;
    /**
     * Validation ID of the L1 validator.
     */
    validationId: string;
}

export class IncreaseL1ValidatorBalanceTx extends Transaction {
    override tx: pvmSerial.IncreaseL1ValidatorBalanceTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.IncreaseL1ValidatorBalanceTx
    }
}

export async function newIncreaseL1ValidatorBalanceTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: IncreaseL1ValidatorBalanceTxParams,
): Promise<IncreaseL1ValidatorBalanceTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newIncreaseL1ValidatorBalanceTx({
        ...commonTxParams,
        balance: avaxToNanoAvax(params.balanceInAvax),
        validationId: params.validationId,
    }, context)

    return new IncreaseL1ValidatorBalanceTx({
        unsignedTx,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
