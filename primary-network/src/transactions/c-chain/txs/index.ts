import { ExportTx, newExportTx, type ExportTxParams } from "./exportTx";
import { ImportTx, newImportTx, type ImportTxParams } from "./importTx";

const txTypes = {
    ExportTx,
    ImportTx,
};
export { txTypes };

export { ExportTx, newExportTx, type ExportTxParams };
export { ImportTx, newImportTx, type ImportTxParams };
export { newTxFromBytes, type NewTxFromBytesParams } from './txFromBytes';
