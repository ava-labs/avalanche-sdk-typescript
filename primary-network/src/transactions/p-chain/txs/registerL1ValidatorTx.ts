import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../../common/transaction";
import type { CommonTxParams, NewTxParams } from "../../common/types";
import { avaxToNanoAvax, fetchCommonTxParams } from "../../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type RegisterL1ValidatorTxParams = CommonTxParams & {
    /**
     * Initial balance (in AVAX) of the L1 validator getting registered,
     * Balance is required for paying a contiguous fee to the Primary
     * Network to validate the L1.
     */
    initialBalanceInAvax: number;
    /**
     * BLS signature of the validator.
     */
    blsSignature: string;
    /**
     * Signed warp message hex with the `AddressedCall` payload
     * containing message of type `RegisterL1ValidatorMessage`.
     */
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
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: RegisterL1ValidatorTxParams,
): Promise<RegisterL1ValidatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newRegisterL1ValidatorTx({
        ...commonTxParams,
        balance: avaxToNanoAvax(params.initialBalanceInAvax),
        blsSignature: utils.hexToBuffer(params.blsSignature),
        message: utils.hexToBuffer(params.message),
    }, context)

    return new RegisterL1ValidatorTx({
        unsignedTx,
        rpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
