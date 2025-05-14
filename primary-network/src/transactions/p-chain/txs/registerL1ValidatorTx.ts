import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type RegisterL1ValidatorTxParams = CommonTxParams & {
    balance: bigint;
    blsSignature: string;
    message: string;
}

export class RegisterL1ValidatorTx extends Transaction {
    override tx: pvmSerial.RegisterL1ValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.RegisterL1ValidatorTx
    }
}

export async function newRegisterL1ValidatorTx(
    primaryNetworkCore: PrimaryNetworkCore,
    params: RegisterL1ValidatorTxParams,
): Promise<RegisterL1ValidatorTx> {
    const context = await primaryNetworkCore.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCore.pvmRpc, primaryNetworkCore.wallet)

    const unsignedTx = pvm.newRegisterL1ValidatorTx({
        ...commonTxParams,
        balance: params.balance,
        blsSignature: utils.hexToBuffer(params.blsSignature),
        message: utils.hexToBuffer(params.message),
    }, context)

    return new RegisterL1ValidatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCore.pvmRpc,
        nodeUrl: primaryNetworkCore.nodeUrl,
        wallet: primaryNetworkCore.wallet,
    })
}
