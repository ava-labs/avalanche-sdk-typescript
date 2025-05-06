import { pvm } from "@avalabs/avalanchejs"
import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import type { Wallet } from "./wallet";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork {
    pChain: PChainTxBuilder;
    nodeUrl: string;
    wallet: Wallet;

    constructor(params: {
        nodeUrl: string,
        pChain: PChainTxBuilder,
        wallet: Wallet,
    }) {
        this.nodeUrl = params.nodeUrl
        this.pChain = params.pChain
        this.wallet = params.wallet
    }

    static async newClient(params: {
        nodeUrl: string,
        wallet: Wallet,
    }) {
        const pvmRpc = new pvm.PVMApi(params.nodeUrl);

        const pChain = await PChainTxBuilder.newClient({
            nodeUrl: params.nodeUrl,
            wallet: params.wallet,
            pvmRpc,
        })
        return new PrimaryNetwork({
            nodeUrl: params.nodeUrl,
            pChain,
            wallet: params.wallet,
        })
    }
}
