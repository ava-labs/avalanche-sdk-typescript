import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import { newExportTx, type ExportTxParams } from "../txs/exportTx";
import { newImportTx, type ImportTxParams } from "../txs/importTx";

export class TxBuilder {
    primaryNetworkCoreClient: PrimaryNetworkCore;

    constructor(primaryNetworkCoreClient: PrimaryNetworkCore) {
        this.primaryNetworkCoreClient = primaryNetworkCoreClient;
    }

    static newClient(primaryNetworkCoreClient: PrimaryNetworkCore) {
        return new TxBuilder(primaryNetworkCoreClient)
    }

    async newExportTx(params: ExportTxParams) {
        return newExportTx(this.primaryNetworkCoreClient, params)
    }

    async newImportTx(params: ImportTxParams) {
        return newImportTx(this.primaryNetworkCoreClient, params)
    }
}
