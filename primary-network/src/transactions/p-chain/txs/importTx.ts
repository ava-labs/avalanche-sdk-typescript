import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../../common/transaction";
import { fetchCommonTxParams, getChainIdFromAlias } from "../../common/utils";
import type { CommonTxParams, NewTxParams } from "../../common/types";
import type { X_CHAIN_ALIAS, C_CHAIN_ALIAS } from "../../common/consts";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type ImportedOutput = {
    /**
     * The addresses to import the funds to. These are the
     * addresses who can sign the consuming of this UTXO.
     */
    addresses: string[],
    /**
     * Optional. Timestamp in seconds after which this UTXO can be consumed.
     */
    locktime?: number,  
    /**
     * Optional. The number of signatures required out of the total `addresses`
     * to spend the imported output.
     */
    threshold?: number,
}

/**
 * Parameters for building an import transaction. There will be no change outputs,
 * as the imported output will be the only output of the transaction.
 */
export type ImportTxParams = Omit<CommonTxParams, 'changeAddresses'> & {
    /**
     * The chain to import the funds from.
     */
    sourceChain: typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS;
    /**
     * Consolidated imported output from the atomic memory (source chain). Users
     * cannot specify the amount, as it will be consolidation of all the UTXOs
     * pending for import from the source chain.
     */
    importedOutput: ImportedOutput;
}

export class ImportTx extends Transaction {
    override tx: pvmSerial.ImportTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.ImportTx
    }
}

export async function newImportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txPrams: ImportTxParams,
): Promise<ImportTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(
        txPrams,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
        /* sourceChain = */ getChainIdFromAlias(txPrams.sourceChain, context.networkID),
    )

    const unsignedTx = pvm.newImportTx(
        {
            ...commonTxParams,
            sourceChainId: getChainIdFromAlias(txPrams.sourceChain, context.networkID),
            toAddressesBytes: txPrams.importedOutput.addresses.map(utils.bech32ToBytes),
            locktime: BigInt(txPrams.importedOutput.locktime ?? 0),
            threshold: txPrams.importedOutput.threshold ?? 1,
        },
        context,
    );

    return new ImportTx({
        unsignedTx,
        rpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}