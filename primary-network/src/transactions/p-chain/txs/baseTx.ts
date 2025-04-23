import { pvm, TransferableOutput, utils } from "@avalabs/avalanchejs";
import type { commonTxProps } from "../types";
import { Transaction } from "./transaction";
import type { Wallet } from "../../../wallet";
import type { Context as ContextType }  from '@avalabs/avalanchejs';

const errWalletNotFound = (param: string) => `Wallet not found. Link a wallet or provide required parameter: ${param}`

export class BaseTx extends Transaction {}

export async function newBaseTx(
    txPrams: commonTxProps,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<BaseTx> {
    // If fromAddresses is not provided, use wallet addresses
    if (!txPrams.fromAddresses) {
        if (wallet) {
            txPrams.fromAddresses = wallet.addresses;
        } else {
            throw new Error(errWalletNotFound('fromAddresses'));
        }
    }

    // If utxos are not provided, use wallet to fetch utxos
    if (!txPrams.utxos) {
        if (wallet) {
            txPrams.utxos = await wallet.getUtxos()
        } else {
            throw new Error(errWalletNotFound('utxos'));
        }
    }

    // Fetch fee state from api
    const feeState = await pvmRpc.getFeeState()

    // Format outputs as per AvalancheJS
    const formattedOutputs = txPrams.outputs ? txPrams.outputs.map(output => {
        return TransferableOutput.fromNative(     
            output.assetId ?? context.avaxAssetID,
            BigInt(output.amount * 1e9),
            output.addresses.map(utils.bech32ToBytes),
            BigInt(output.locktime ?? 0),
            output.threshold ?? 1,
        )
    }) : []

    const unsignedTx = pvm.newBaseTx(
        {
            feeState,
            fromAddressesBytes: txPrams.fromAddresses.map(utils.bech32ToBytes),
            utxos: txPrams.utxos,
            outputs: formattedOutputs,
            memo: txPrams.memo ? Buffer.from(txPrams.memo) : new Uint8Array(),
        },
        context,
    );

    return new BaseTx({
        unsignedTx,
        wallet,
        nodeUrl,
        pvmRpc,
    })
}