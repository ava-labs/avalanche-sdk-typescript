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

export class TxBuilder {
    context: ContextType.Context;
    wallet: Wallet;
    nodeUrl: string;
    pvmRpc: pvm.PVMApi;

    constructor(params: TxBuilderConstructorParams) {
        this.context = params.context;
        this.wallet = params.wallet;
        this.nodeUrl = params.nodeUrl;
        this.pvmRpc = params.pvmRpc;
    }

    static async newClient(params: NewTxBuilderParams) {
        const context = await ContextType.getContextFromURI(params.nodeUrl)
        return new TxBuilder({
            ...params,
            context,
        })
    }

    linkWallet(wallet: Wallet) {
        this.wallet = wallet;
    }

    async newBaseTx(params: BaseTxParams): Promise<BaseTx> {
        return newBaseTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newConvertSubnetToL1Tx(params: ConvertSubnetToL1TxParams): Promise<ConvertSubnetToL1Tx> {
        return newConvertSubnetToL1Tx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newCreateSubnetTx(params: CreateSubnetTxParams): Promise<CreateSubnetTx> {
        return newCreateSubnetTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newCreateChainTx(params: CreateChainTxParams): Promise<CreateChainTx> {
        return newCreateChainTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newAddSubnetValidatorTx(params: AddSubnetValidatorTxParams): Promise<AddSubnetValidatorTx> {
        return newAddSubnetValidatorTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newRemoveSubnetValidatorTx(params: RemoveSubnetValidatorTxParams): Promise<RemoveSubnetValidatorTx> {
        return newRemoveSubnetValidatorTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newRegisterL1ValidatorTx(params: RegisterL1ValidatorTxParams): Promise<RegisterL1ValidatorTx> {
        return newRegisterL1ValidatorTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newIncreaseL1ValidatorBalanceTx(params: IncreaseL1ValidatorBalanceTxParams): Promise<IncreaseL1ValidatorBalanceTx> {
        return newIncreaseL1ValidatorBalanceTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newSetL1ValidatorWeightTx(params: SetL1ValidatorWeightTxParams): Promise<SetL1ValidatorWeightTx> {
        return newSetL1ValidatorWeightTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }

    async newDisableL1ValidatorTx(params: DisableL1ValidatorTxParams): Promise<DisableL1ValidatorTx> {
        return newDisableL1ValidatorTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }
}
