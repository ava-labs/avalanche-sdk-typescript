import type { pvm } from "@avalabs/avalanchejs";
import { Context as ContextType }  from '@avalabs/avalanchejs';
import type { TxBuilderConstructorParams, NewTxBuilderParams } from "./types";
import type { Wallet } from "../../../wallet";
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
import { getTxClassFromBytes } from "../common/utils";
import type { NewTxParams } from "../common/types";
import { Transaction } from "../common/transaction";

export class TxBuilder {
    context: ContextType.Context | undefined;
    wallet: Wallet | undefined;
    nodeUrl: string;
    pvmRpc: pvm.PVMApi;

    constructor(params: TxBuilderConstructorParams) {
        this.context = params.context;
        this.wallet = params.wallet;
        this.nodeUrl = params.nodeUrl;
        this.pvmRpc = params.pvmRpc;
    }

    static newClient(params: NewTxBuilderParams) {
        return new TxBuilder({
            ...params,
            context: undefined,
        })
    }

    linkWallet(wallet: Wallet) {
        this.wallet = wallet;
    }

    /**
     * Initializes the context when required if it is not already initialized.
     * @returns The context.
    */
    async initializeContextIfNot() {
        if (!this.context) {
            this.context = await ContextType.getContextFromURI(this.nodeUrl);
        }
        return this.context;
    }

    /**
     * Parses a transaction from bytes. Parsing transaction from bytes may
     * result in reduced feature sets, like missing input UTXOs, or,
     * signing functionality.
    */
    newTxFromBytes<T extends Transaction>(
        hexTxBytes: string,
        txClass?: new (params: NewTxParams) => T,
    ): T {
        return getTxClassFromBytes(
            txClass ?? (Transaction as new (params: NewTxParams) => T),
            hexTxBytes,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newBaseTx(params: BaseTxParams): Promise<BaseTx> {
        const context = await this.initializeContextIfNot();
        return newBaseTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newConvertSubnetToL1Tx(params: ConvertSubnetToL1TxParams): Promise<ConvertSubnetToL1Tx> {
        const context = await this.initializeContextIfNot();
        return newConvertSubnetToL1Tx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newCreateSubnetTx(params: CreateSubnetTxParams): Promise<CreateSubnetTx> {
        const context = await this.initializeContextIfNot();
        return newCreateSubnetTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newCreateChainTx(params: CreateChainTxParams): Promise<CreateChainTx> {
        const context = await this.initializeContextIfNot();
        return newCreateChainTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newAddSubnetValidatorTx(params: AddSubnetValidatorTxParams): Promise<AddSubnetValidatorTx> {
        const context = await this.initializeContextIfNot();
        return newAddSubnetValidatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newRemoveSubnetValidatorTx(params: RemoveSubnetValidatorTxParams): Promise<RemoveSubnetValidatorTx> {
        const context = await this.initializeContextIfNot();
        return newRemoveSubnetValidatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newRegisterL1ValidatorTx(params: RegisterL1ValidatorTxParams): Promise<RegisterL1ValidatorTx> {
        const context = await this.initializeContextIfNot();
        return newRegisterL1ValidatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newIncreaseL1ValidatorBalanceTx(params: IncreaseL1ValidatorBalanceTxParams): Promise<IncreaseL1ValidatorBalanceTx> {
        const context = await this.initializeContextIfNot();
        return newIncreaseL1ValidatorBalanceTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newSetL1ValidatorWeightTx(params: SetL1ValidatorWeightTxParams): Promise<SetL1ValidatorWeightTx> {
        const context = await this.initializeContextIfNot();
        return newSetL1ValidatorWeightTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newDisableL1ValidatorTx(params: DisableL1ValidatorTxParams): Promise<DisableL1ValidatorTx> {
        const context = await this.initializeContextIfNot();
        return newDisableL1ValidatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newAddPermissionlessValidatorTx(params: AddPermissionlessValidatorTxParams): Promise<AddPermissionlessValidatorTx> {
        const context = await this.initializeContextIfNot();
        return newAddPermissionlessValidatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newAddPermissionlessDelegatorTx(params: AddPermissionlessDelegatorTxParams): Promise<AddPermissionlessDelegatorTx> {
        const context = await this.initializeContextIfNot();
        return newAddPermissionlessDelegatorTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newExportTx(params: ExportTxParams): Promise<ExportTx> {
        const context = await this.initializeContextIfNot();
        return newExportTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }

    async newImportTx(params: ImportTxParams): Promise<ImportTx> {
        const context = await this.initializeContextIfNot();
        return newImportTx(
            params,
            context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        );
    }
}
