import { type BaseTx, type BaseTxParams, newBaseTx } from "../txs/baseTx";
import { type ConvertSubnetToL1Tx, type ConvertSubnetToL1TxParams, newConvertSubnetToL1Tx } from "../txs/convertSubnetToL1Tx";
import { type CreateSubnetTx, type CreateSubnetTxParams, newCreateSubnetTx } from "../txs/createSubnetTx";
import { type CreateChainTx, type CreateChainTxParams, newCreateChainTx } from "../txs/createChainTx";
import { type AddSubnetValidatorTx, type AddSubnetValidatorTxParams, newAddSubnetValidatorTx } from "../txs/addSubnetValidatorTx";
import { type RemoveSubnetValidatorTx, type RemoveSubnetValidatorTxParams, newRemoveSubnetValidatorTx } from "../txs/removeSubnetValidatorTx";
import { type RegisterL1ValidatorTx, type RegisterL1ValidatorTxParams, newRegisterL1ValidatorTx } from "../txs/registerL1ValidatorTx";
import { type IncreaseL1ValidatorBalanceTx, type IncreaseL1ValidatorBalanceTxParams, newIncreaseL1ValidatorBalanceTx } from "../txs/increaseL1ValidatorBalanceTx";
import { type SetL1ValidatorWeightTx, type SetL1ValidatorWeightTxParams, newSetL1ValidatorWeightTx } from "../txs/setL1ValidatorWeightTx";
import { type DisableL1ValidatorTx, type DisableL1ValidatorTxParams, newDisableL1ValidatorTx } from "../txs/disableL1ValidatorTx";
import { type AddPermissionlessValidatorTx, type AddPermissionlessValidatorTxParams, newAddPermissionlessValidatorTx } from "../txs/addPermissionlessValidatorTx";
import { type AddPermissionlessDelegatorTx, type AddPermissionlessDelegatorTxParams, newAddPermissionlessDelegatorTx } from "../txs/addPermissionlessDelegatorTx";
import { type ExportTx, type ExportTxParams, newExportTx } from "../txs/exportTx";
import { type ImportTx, type ImportTxParams, newImportTx } from "../txs/importTx";
import { type NewTxFromBytesParams, newTxFromBytes } from "../txs/txFromBytes";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import type { Transaction } from "../common/transaction";

export class TxBuilder {
    primaryNetworkCoreClient: PrimaryNetworkCore;

    constructor(primaryNetworkCoreClient: PrimaryNetworkCore) {
        this.primaryNetworkCoreClient = primaryNetworkCoreClient;
    }

    static newClient(primaryNetworkCoreClient: PrimaryNetworkCore) {
        return new TxBuilder(primaryNetworkCoreClient)
    }

    /**
     * Parses a transaction from bytes. Parsing transaction from bytes may
     * result in reduced feature sets, like missing input UTXOs, or,
     * signing functionality.
    */
    newTxFromBytes<T extends Transaction>(params: NewTxFromBytesParams<T>): T {
        return newTxFromBytes(this.primaryNetworkCoreClient, params)
    }

    async newBaseTx(params: BaseTxParams): Promise<BaseTx> {
        return newBaseTx(this.primaryNetworkCoreClient, params);
    }

    async newConvertSubnetToL1Tx(params: ConvertSubnetToL1TxParams): Promise<ConvertSubnetToL1Tx> {
        return newConvertSubnetToL1Tx(this.primaryNetworkCoreClient, params);
    }

    async newCreateSubnetTx(params: CreateSubnetTxParams): Promise<CreateSubnetTx> {
        return newCreateSubnetTx(this.primaryNetworkCoreClient, params);
    }

    async newCreateChainTx(params: CreateChainTxParams): Promise<CreateChainTx> {
        return newCreateChainTx(this.primaryNetworkCoreClient, params);
    }

    async newAddSubnetValidatorTx(params: AddSubnetValidatorTxParams): Promise<AddSubnetValidatorTx> {
        return newAddSubnetValidatorTx(this.primaryNetworkCoreClient, params);
    }

    async newRemoveSubnetValidatorTx(params: RemoveSubnetValidatorTxParams): Promise<RemoveSubnetValidatorTx> {
        return newRemoveSubnetValidatorTx(this.primaryNetworkCoreClient, params);
    }

    async newRegisterL1ValidatorTx(params: RegisterL1ValidatorTxParams): Promise<RegisterL1ValidatorTx> {
        return newRegisterL1ValidatorTx(this.primaryNetworkCoreClient, params);
    }

    async newIncreaseL1ValidatorBalanceTx(params: IncreaseL1ValidatorBalanceTxParams): Promise<IncreaseL1ValidatorBalanceTx> {
        return newIncreaseL1ValidatorBalanceTx(this.primaryNetworkCoreClient, params);
    }

    async newSetL1ValidatorWeightTx(params: SetL1ValidatorWeightTxParams): Promise<SetL1ValidatorWeightTx> {
        return newSetL1ValidatorWeightTx(this.primaryNetworkCoreClient, params);
    }

    async newDisableL1ValidatorTx(params: DisableL1ValidatorTxParams): Promise<DisableL1ValidatorTx> {
        return newDisableL1ValidatorTx(this.primaryNetworkCoreClient, params);
    }

    async newAddPermissionlessValidatorTx(params: AddPermissionlessValidatorTxParams): Promise<AddPermissionlessValidatorTx> {
        return newAddPermissionlessValidatorTx(this.primaryNetworkCoreClient, params);
    }

    async newAddPermissionlessDelegatorTx(params: AddPermissionlessDelegatorTxParams): Promise<AddPermissionlessDelegatorTx> {
        return newAddPermissionlessDelegatorTx(this.primaryNetworkCoreClient, params);
    }

    async newExportTx(params: ExportTxParams): Promise<ExportTx> {
        return newExportTx(this.primaryNetworkCoreClient, params);
    }

    async newImportTx(params: ImportTxParams): Promise<ImportTx> {
        return newImportTx(this.primaryNetworkCoreClient, params);
    }
}
