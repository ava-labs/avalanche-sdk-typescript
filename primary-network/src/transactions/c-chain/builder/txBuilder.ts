import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import type { Transaction } from "../../common";
import { newExportTx, type ExportTxParams } from "../txs/exportTx";
import { newImportTx, type ImportTxParams } from "../txs/importTx";
import { newTxFromBytes, type NewTxFromBytesParams } from "../txs/txFromBytes";

export class TxBuilder {
    primaryNetworkCoreClient: PrimaryNetworkCore;

    constructor(primaryNetworkCoreClient: PrimaryNetworkCore) {
        this.primaryNetworkCoreClient = primaryNetworkCoreClient;
    }

    static newClient(primaryNetworkCoreClient: PrimaryNetworkCore) {
        return new TxBuilder(primaryNetworkCoreClient)
    }

    newTxFromBytes<T extends Transaction>(params: NewTxFromBytesParams<T>) {
        return newTxFromBytes(this.primaryNetworkCoreClient, params)
    }

    async newExportTx(params: ExportTxParams) {
        return newExportTx(this.primaryNetworkCoreClient, params)
    }

    async newImportTx(params: ImportTxParams) {
        return newImportTx(this.primaryNetworkCoreClient, params)
    }
}
