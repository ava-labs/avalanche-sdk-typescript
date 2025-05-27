import { type Common, type pvm, utils, addTxSignatures, type pvmSerial } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha2";
import type { Wallet } from "../../../wallet";
import type { NewTxParams, TransferableOutputFull } from "./types";
import { toTransferableOutput } from "./utils";
export class Transaction {
    unsignedTx: Common.UnsignedTx;
    tx: Common.Transaction
    nodeUrl: string;
    pvmRpc: pvm.PVMApi;
    wallet: Wallet | undefined;

    constructor(params: NewTxParams) {
        this.unsignedTx = params.unsignedTx;
        this.tx = params.unsignedTx.getTx()
        this.wallet = params.wallet;
        this.nodeUrl = params.nodeUrl;
        this.pvmRpc = params.pvmRpc;
    }

    linkWallet(wallet: Wallet) {
        this.wallet = wallet;
    }

    toBytes(signed = false) {
        return signed ? utils.addChecksum(this.unsignedTx.getSignedTx().toBytes()) : this.unsignedTx.toBytes()
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

    getOutputs(): TransferableOutputFull[] {
        const transferableOutputs = (this.tx as pvmSerial.BaseTx).baseTx.outputs
        return transferableOutputs.map(toTransferableOutput)
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
        return await this.pvmRpc.issueSignedTx(this.unsignedTx.getSignedTx())
    }
}
