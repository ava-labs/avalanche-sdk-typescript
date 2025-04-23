import type { pvm } from "@avalabs/avalanchejs"
import type { Context as ContextType, Utxo }  from '@avalabs/avalanchejs';
import type { Wallet } from "../../wallet";

export type commonTxProps = {
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

export type txBuilderInstanceParams = {
    nodeUrl: string,
    wallet: Wallet,
    pvmRpc: pvm.PVMApi,
}

export type txInstanceParams = {
    nodeUrl: string,
    wallet: Wallet,
    pvmRpc: pvm.PVMApi,
    context: ContextType.Context,
}

export type Output = {
    amount: number,
    addresses: string[],
    assetId?: string,
    locktime?: number,
    threshold?: number,
}
