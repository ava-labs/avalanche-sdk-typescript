import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import { TxBuilder as CChainTxBuilder } from "./transactions/c-chain/builder/txBuilder";
import { getNodeUrlFromChain } from "./utils";
import { createPrimaryNetworkCoreClient, PrimaryNetworkCore } from "./primaryNetworkCoreClient";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork {
    coreClient: PrimaryNetworkCore;
    pChain: PChainTxBuilder;
    cChain: CChainTxBuilder;
    constructor(params: {
        coreClient: PrimaryNetworkCore,
        nodeUrl: `http${'s' | ''}://${string}`,
        pChain: PChainTxBuilder,
        cChain: CChainTxBuilder,
    }) {
        this.coreClient = params.coreClient
        this.pChain = params.pChain
        this.cChain = params.cChain
    }

    linkPrivateKeys(privateKeys: string[]) {
        this.coreClient.linkPrivateKeys(privateKeys)
    }
}

export function createPrimaryNetworkClient({
    nodeUrlOrChain,
    privateKeys,
}: {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    privateKeys?: string[] | undefined,
}) {
    const primaryNetworkCore = createPrimaryNetworkCoreClient({
        nodeUrlOrChain,
        privateKeys,
    })
    const pChain = PChainTxBuilder.newClient(primaryNetworkCore)
    const cChain = CChainTxBuilder.newClient(primaryNetworkCore)

    return new PrimaryNetwork({
        coreClient: primaryNetworkCore,
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        pChain,
        cChain,
    })
}
