import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams, getChainIdFromAlias } from "../common/utils";
import type { CommonTxParams, NewTxParams } from "../common/types";
import type { X_CHAIN_ALIAS, C_CHAIN_ALIAS, P_CHAIN_ALIAS } from "../common/consts";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

type ImportedOutput = {
    addresses: string[],
    locktime?: number,  
    threshold?: number,
}

export type ImportTxParams = CommonTxParams & {
    sourceChain: typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS | typeof P_CHAIN_ALIAS;
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
    const commonTxParams = await fetchCommonTxParams(
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
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}