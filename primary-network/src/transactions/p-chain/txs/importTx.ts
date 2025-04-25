import { pvm, utils, type Context as ContextType } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams, getChainIdFromAlias } from "../common/utils";
import type { CommonTxParams, Output } from "../common/types";
import type { X_CHAIN_ALIAS, C_CHAIN_ALIAS, P_CHAIN_ALIAS } from "../common/consts";

type ImportedOutput = {
    addresses: string[],
    locktime?: number,  
    threshold?: number,
}

export type ImportTxParams = CommonTxParams & {
    sourceChain: typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS | typeof P_CHAIN_ALIAS;
    importedOutput: ImportedOutput;
}

export class ImportTx extends Transaction {}

export async function newImportTx(
    txPrams: ImportTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<ImportTx> {
    const commonTxParams = await fetchCommonTxParams(
        txPrams,
        context,
        pvmRpc,
        wallet,
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
        wallet,
        nodeUrl,
        pvmRpc,
    })
}