import type { pvm } from "@avalabs/avalanchejs";
import { Context as ContextType }  from '@avalabs/avalanchejs';
import type { TxBuilderConstructorParams, NewTxBuilderParams } from "./types";
import type { Wallet } from "../../../wallet";
import { type BaseTx, type BaseTxParams, newBaseTx } from "../txs/baseTx";
import { type ConvertSubnetToL1Tx, type ConvertSubnetToL1TxParams, newConvertSubnetToL1Tx } from "../txs/convertSubnetToL1Tx";
import { type CreateSubnetTx, type CreateSubnetTxParams, newCreateSubnetTx } from "../txs/createSubnetTx";
import { type CreateChainTx, type CreateChainTxParams, newCreateChainTx } from "../txs/createChainTx";

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
}
