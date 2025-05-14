import { utils } from "@avalabs/avalanchejs";
import { Transaction } from "../common";
import { addSigToAllCreds } from "../common/utils";

export class SubnetTransaction extends Transaction {
    // Adds SubnetAuth signature to all credentials
    override async sign(privateKeys?: string[]) {
        super.sign()
        let privateKeysBuffer = this.wallet?.getPrivateKeysBuffer()

        // If private keys are provided, use them
        if (privateKeys && privateKeys.length > 0) {
            privateKeysBuffer = privateKeys.map(key => utils.hexToBuffer(key))
        }

        if (!privateKeysBuffer) {
            throw new Error('Unable to sign transaction. Either provide private keys or link a wallet')
        }

        await addSigToAllCreds(this.unsignedTx, privateKeysBuffer)
    }
}