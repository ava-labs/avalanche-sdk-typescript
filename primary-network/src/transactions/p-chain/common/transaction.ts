import { type Common, type pvm, utils, addTxSignatures } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha2";
import type { Wallet } from "../../../wallet";

export class Transaction {
    unsignedTx: Common.UnsignedTx;
    nodeUrl: string;
    pvmRpc: pvm.PVMApi;
    wallet: Wallet | undefined;

    constructor(params: {
        unsignedTx: Common.UnsignedTx,
        wallet: Wallet | undefined,
        nodeUrl: string,
        pvmRpc: pvm.PVMApi
    }) {
        this.unsignedTx = params.unsignedTx;
        this.wallet = params.wallet;
        this.nodeUrl = params.nodeUrl;
        this.pvmRpc = params.pvmRpc;
    }

    linkWallet(wallet: Wallet) {
        this.wallet = wallet;
    }

    toBytes(signed = false) {
        const data = signed ? this.unsignedTx.getSignedTx().toBytes() : this.unsignedTx.toBytes()
        return utils.addChecksum(data)
    }

    toHex(signed = false) {
        return utils.bufferToHex(this.toBytes(signed))
    }

    getId() {
        if (!this.unsignedTx.hasAllSignatures()) {
            throw new Error('Transaction is not completely signed. Cannot generate transaction id')
        }
        const txBuffer = this.toBytes(/* signed = */ true)
        return utils.base58check.encode(sha256(txBuffer.subarray(0, txBuffer.length-4))) 
    }

    async sign(privateKeys?: string[]) {
        let privateKeysBuffer = this.wallet?.getPrivateKeysBuffer()

        // If private keys are provided, use them
        if (privateKeys && privateKeys.length > 0) {
            privateKeysBuffer = privateKeys.map(key => utils.hexToBuffer(key))
        }

        if (!privateKeysBuffer) {
            throw new Error('Unable to sign transaction. Either provide private keys or link a wallet')
        }

        await addTxSignatures({
            unsignedTx: this.unsignedTx,
            privateKeys: privateKeysBuffer,
        })
    }

    async issue() {
        if (!this.unsignedTx.hasAllSignatures()) {
            throw new Error('Transaction is not completely signed. Cannot issue unsigned transaction')
        }
        await this.pvmRpc.issueSignedTx(this.unsignedTx.getSignedTx())
    }
}
