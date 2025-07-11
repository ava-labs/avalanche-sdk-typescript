import { avm, utils, type avmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonAvmTxParams, getChainIdFromAlias } from "../../common/utils";
import type { CommonTxParams, NewTxParams } from "../../common/types";
import type { P_CHAIN_ALIAS, C_CHAIN_ALIAS } from "../../common/consts";
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
    sourceChain: typeof P_CHAIN_ALIAS | typeof C_CHAIN_ALIAS;
    /**
     * Consolidated imported output from the atomic memory (source chain). Users
     * cannot specify the amount, as it will be consolidation of all the UTXOs
     * pending for import from the source chain.
     */
    importedOutput: ImportedOutput;
}

export class ImportTx extends Transaction {
    override tx: avmSerial.ImportTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as avmSerial.ImportTx
    }
}

export async function newImportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txParams: ImportTxParams,
): Promise<ImportTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonAvmTxParams(
        txParams,
        context,
        primaryNetworkCoreClient.avmRpc,
        primaryNetworkCoreClient.wallet,
        /* sourceChain = */ getChainIdFromAlias(txParams.sourceChain, context.networkID),
    )

    const unsignedTx = avm.newImportTx(
        context,
        getChainIdFromAlias(txParams.sourceChain, context.networkID),
        commonTxParams.fromAddressesBytes,
        commonTxParams.utxoSet,
        txParams.importedOutput.addresses.map(utils.bech32ToBytes),
        {
            ...(commonTxParams.memo && { memo: commonTxParams.memo }),
            ...(commonTxParams.minIssuanceTime && { minIssuanceTime: commonTxParams.minIssuanceTime }),
            locktime: BigInt(txParams.importedOutput.locktime ?? 0),
            threshold: txParams.importedOutput.threshold ?? 1,
        },
    );

    return new ImportTx({
        unsignedTx,
        rpc: primaryNetworkCoreClient.avmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}