import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams, PChainOwner } from "../../common/types";
import { fetchCommonTxParams } from "../../common/utils";
import { addPChainOwnerAuthSignature } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type DisableL1ValidatorTxParams = CommonTxParams & {
    /**
     * Validation ID of the L1 validator.
     */
    validationId: string;
    /**
     * Array of indices from the L1 validator's disable owners array
     * who will sign this `DisableL1ValidatorTx`.
     */
    disableAuth: number[];
}

export class DisableL1ValidatorTx extends Transaction {
    override tx: pvmSerial.DisableL1ValidatorTx;
    disableOwners: PChainOwner;
    disableAuth: number[];

    constructor(params: NewTxParams, disableOwners: PChainOwner) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.DisableL1ValidatorTx
        this.disableOwners = disableOwners
        this.disableAuth = this.tx.getDisableAuth().values()
    }

    override async sign(privateKeys?: string[]) {
        await super.sign(privateKeys)
        let privateKeysBuffer = this.wallet?.getPrivateKeysBuffer()

        // If private keys are provided, use them
        if (privateKeys && privateKeys.length > 0) {
            privateKeysBuffer = privateKeys.map(key => utils.hexToBuffer(key))
        }

        if (!privateKeysBuffer) {
            throw new Error('Unable to sign transaction. Either provide private keys or link a wallet')
        }

        await addPChainOwnerAuthSignature(
            this.disableOwners,
            this.disableAuth,
            this.unsignedTx,
            privateKeysBuffer,
        )
    }
}

export async function newDisableL1ValidatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: DisableL1ValidatorTxParams,
): Promise<DisableL1ValidatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams, disableOwners } = await fetchCommonTxParams(
        params,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
        undefined,
        undefined,
        params.validationId
    )
    if (!disableOwners) {
        throw new Error("Disable owners not found for a DisableL1ValidatorTx. Either the validator is removed, or incorrect.")
    }

    const unsignedTx = pvm.newDisableL1ValidatorTx({
        ...commonTxParams,
        validationId: params.validationId,
        disableAuth: params.disableAuth,
    }, context)

    return new DisableL1ValidatorTx(
        {
            unsignedTx,
            rpc: primaryNetworkCoreClient.pvmRpc,
            nodeUrl: primaryNetworkCoreClient.nodeUrl,
            wallet: primaryNetworkCoreClient.wallet,
        },
        disableOwners,
    )
}
