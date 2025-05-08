import { pvm } from "@avalabs/avalanchejs"
import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import { Wallet } from "./wallet";
import { getNodeUrlFromChain } from "./utils";

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

    linkPrivateKeys(privateKeys: string[]) {
        this.wallet = new Wallet({
            nodeUrl: this.nodeUrl,
            privateKeys,
        })
    }
}

export function createPrimaryNetworkClient({
    nodeUrlOrChain,
    wallet,
}: {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    wallet: Wallet | undefined,
}) {
    const nodeUrl = getNodeUrlFromChain(nodeUrlOrChain)
    const pvmRpc = new pvm.PVMApi(nodeUrl);

    const pChain = PChainTxBuilder.newClient({
        nodeUrl,
        wallet,
        pvmRpc,
    })

    return new PrimaryNetwork({
        nodeUrl,
        pChain,
        wallet,
    })
}
