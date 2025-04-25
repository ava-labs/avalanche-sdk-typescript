import type { pvm, TransferableOutput, Utxo }  from '@avalabs/avalanchejs';

export type Output = {
    amount: number,
    addresses: string[],
    assetId?: string,
    locktime?: number,
    threshold?: number,
}

export type CommonTxParams = {
    /**
     * Addresses to send funds from
     */
    fromAddresses?: string[],

    /**
     * Outputs to send funds to
     */
    outputs?: Output[],

    /**
     * UTXOs to use for the transaction
     */
    utxos?: Utxo[],

    /**
     * Memo to include in the transaction
     */
    memo?: string,
}

export type FormattedCommonTxParams = {
    feeState: pvm.FeeState;
    fromAddressesBytes: Uint8Array[];
    utxos: Utxo[];
    outputs: TransferableOutput[];
    memo?: Uint8Array;
}
