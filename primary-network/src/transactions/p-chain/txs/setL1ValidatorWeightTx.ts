import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../../common/types";
import { fetchCommonTxParams } from "../../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type SetL1ValidatorWeightTxParams = CommonTxParams & {
    /**
     * Signed warp message hex with the `AddressedCall` payload
     * containing message of type `SetL1ValidatorWeightMessage`.
    */
    message: string;
}

export class SetL1ValidatorWeightTx extends Transaction {
    override tx: pvmSerial.SetL1ValidatorWeightTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.SetL1ValidatorWeightTx
    }
}

export async function newSetL1ValidatorWeightTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: SetL1ValidatorWeightTxParams,
): Promise<SetL1ValidatorWeightTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newSetL1ValidatorWeightTx({
        ...commonTxParams,
        message: utils.hexToBuffer(params.message),
    }, context)

    return new SetL1ValidatorWeightTx({
        unsignedTx,
        rpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
