import { utils } from "@avalabs/avalanchejs";
import { Transaction } from "../common";
import { addPChainOwnerAuthSignature } from "../common/utils";
import type { NewTxParams, PChainOwner } from "../common/types";

export type SubnetTransactionParams = NewTxParams & {
    subnetOwners: PChainOwner
}

export class SubnetTransaction extends Transaction {
    subnetOwners: PChainOwner
    subnetAuth: number[]

    constructor(params: SubnetTransactionParams, subnetAuth: number[]) {
        super(params)
        this.subnetOwners = params.subnetOwners
        this.subnetAuth = subnetAuth
    }

    // Adds SubnetAuth signature to all credentials
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

        await addPChainOwnerAuthSignature(this.subnetOwners, this.subnetAuth, this.unsignedTx, privateKeysBuffer)
    }
}