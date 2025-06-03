import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import { TxBuilder as CChainTxBuilder } from "./transactions/c-chain/builder/txBuilder";
import type { Wallet } from "./wallet";
import { getNodeUrlFromChain } from "./utils";
import { PrimaryNetworkCore } from "./primaryNetworkCoreClient";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork extends PrimaryNetworkCore {
    pChain: PChainTxBuilder;
    cChain: CChainTxBuilder;
    constructor(params: {
        nodeUrl: `http${'s' | ''}://${string}`,
        pChain: PChainTxBuilder,
        cChain: CChainTxBuilder,
        wallet: Wallet | undefined,
    }) {
        super(params)
        this.pChain = params.pChain
        this.cChain = params.cChain
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
    const cChain = CChainTxBuilder.newClient(primaryNetworkCore)

    return new PrimaryNetwork({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        pChain,
        cChain,
        wallet,
    })
}
