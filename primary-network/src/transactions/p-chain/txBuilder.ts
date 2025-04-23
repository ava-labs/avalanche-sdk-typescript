import type { pvm } from "@avalabs/avalanchejs";
import { Context as ContextType }  from '@avalabs/avalanchejs';
import type { commonTxProps, txBuilderInstanceParams, txInstanceParams } from "./types";
import type { Wallet } from "../../wallet";
import { type BaseTx, newBaseTx } from "./txs/baseTx";

export class TxBuilder {
    context: ContextType.Context;
    wallet: Wallet;
    nodeUrl: string;
    pvmRpc: pvm.PVMApi;

    constructor(params: txInstanceParams) {
        this.context = params.context;
        this.wallet = params.wallet;
        this.nodeUrl = params.nodeUrl;
        this.pvmRpc = params.pvmRpc;
    }

    static async newClient(params: txBuilderInstanceParams) {
        const context = await ContextType.getContextFromURI(params.nodeUrl)
        return new TxBuilder({
            ...params,
            context,
        })
    }

    linkWallet(wallet: Wallet) {
        this.wallet = wallet;
    }

    async newBaseTx(params: commonTxProps): Promise<BaseTx> {
        return newBaseTx(
            params,
            this.context,
            this.pvmRpc,
            this.nodeUrl,
            this.wallet,
        )
    }
}
