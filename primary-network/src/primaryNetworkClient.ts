import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import type { Wallet } from "./wallet";
import { getNodeUrlFromChain } from "./utils";
import { PrimaryNetworkCore } from "./primaryNetworkCoreClient";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork extends PrimaryNetworkCore {
    pChain: PChainTxBuilder;

    constructor(params: {
        nodeUrl: `http${'s' | ''}://${string}`,
        pChain: PChainTxBuilder,
        wallet: Wallet | undefined,
    }) {
        super(params)
        this.pChain = params.pChain
    }
}

export function createPrimaryNetworkClient({
    nodeUrlOrChain,
    wallet,
}: {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    wallet?: Wallet,
}) {
    const primaryNetworkCore = new PrimaryNetworkCore({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        wallet,
    })

    const pChain = PChainTxBuilder.newClient(primaryNetworkCore)

    return new PrimaryNetwork({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        pChain,
        wallet,
    })
}
