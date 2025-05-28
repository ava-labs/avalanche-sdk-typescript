import type { Common, Id, pvm, pvmSerial, TransferOutput, TypeSymbols, Utxo }  from '@avalabs/avalanchejs';
import type { Wallet } from '../../../wallet';

export type Output = {
    /**
     * Amount holding in this UTXO.
     */
    amount: number,
    /**
     * Addresses who can sign the consuming of this UTXO.
     */
    addresses: string[],
    /**
     * Asset ID of the UTXO.
     */
    assetId?: string,
    /**
     * Timestamp in seconds after which this UTXO can be consumed.
     */
    locktime?: number,
    /**
     * Threshold of `addresses`' signatures required to consume this UTXO.
     */
    threshold?: number,
}

export type CommonTxParams = {
    /**
     * Optional. Addresses to send funds from.
     * If not provided, `utxos` can be used.
     * Preference would be given to `utxos` array.
     */
    fromAddresses?: string[],
    /**
     * Optional. Addresses to send remaining change to.
     * If not provided, `fromAddresses` will be used.
     * Preference would be given to `changeAddresses` array.
     */
    changeAddresses?: string[],
    /**
     * Optional. UTXOs to use for the transaction.
     * If not provided, utxos will be fetched from the `fromAddresses`.
     * Preference would be given to `utxos` array.
     */
    utxos?: Utxo[],
    /**
     * Optional. Earliest time this transaction can be issued.
     * Useful for building transactions using UTXOs
     * that are currently locked but will unlock after this time.
     * If not provided, the current time will be used.
     */
    minIssuanceTime?: bigint,
    /**
     * Optional. Memo to include in the transaction.
     */
    memo?: string,
}

export type FormattedCommonTxParams = {
    feeState: pvm.FeeState;
    fromAddressesBytes: Uint8Array[];
    changeAddressesBytes?: Uint8Array[];
    utxos: Utxo[];
    memo?: Uint8Array;
    minIssuanceTime?: bigint;
}

export type NewTxParams = {
    unsignedTx: Common.UnsignedTx,
    wallet: Wallet | undefined,
    nodeUrl: string,
    pvmRpc: pvm.PVMApi
}

export type SubnetOwners = {
    addresses: `${Lowercase<string>}1${string}`[],
    threshold: number,
}

export type TransferableOutputFull = {
    output: TransferOutput;
    assetId: Id;
    _type: TypeSymbols;
}

export type StakeableOutputFull = {
    output: pvmSerial.StakeableLockOut;
    assetId: Id;
    _type: TypeSymbols;
}
