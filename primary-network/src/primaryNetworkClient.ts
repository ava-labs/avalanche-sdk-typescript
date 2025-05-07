import { pvm } from "@avalabs/avalanchejs"
import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import { Wallet } from "./wallet";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork {
    pChain: PChainTxBuilder;
    nodeUrl: string;
    wallet: Wallet | undefined;

    constructor(params: {
        nodeUrl: string,
        pChain: PChainTxBuilder,
        wallet: Wallet | undefined,
    }) {
        this.nodeUrl = params.nodeUrl
        this.pChain = params.pChain
        this.wallet = params.wallet
    }

    static async newClient(params: {
        nodeUrl: string,
        wallet: Wallet | undefined,
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

    linkPrivateKeys(privateKeys: string[]) {
        this.wallet = new Wallet({
            nodeUrl: this.nodeUrl,
            privateKeys,
        })
    }
}
