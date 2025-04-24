import { pvm } from "@avalabs/avalanchejs"
import { TxBuilder } from "./transactions/p-chain/builder/txBuilder";
import type { Wallet } from "./wallet";

export class PrimaryNetwork {
    txBuilder: TxBuilder;
    nodeUrl: string;
    wallet: Wallet;

    constructor(params: {
        nodeUrl: string,
        txBuilder: TxBuilder,
        wallet: Wallet,
    }) {
        this.nodeUrl = params.nodeUrl
        this.txBuilder = params.txBuilder
        this.wallet = params.wallet
    }

    static async newClient(params: {
        nodeUrl: string,
        wallet: Wallet,
    }) {
        const pvmRpc = new pvm.PVMApi(params.nodeUrl);

        const txBuilder = await TxBuilder.newClient({
            nodeUrl: params.nodeUrl,
            wallet: params.wallet,
            pvmRpc,
        })
        return new PrimaryNetwork({
            nodeUrl: params.nodeUrl,
            txBuilder,
            wallet: params.wallet,
        })
    }
}
