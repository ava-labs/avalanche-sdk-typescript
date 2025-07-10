import { TxBuilder as PChainTxBuilder } from "./transactions/p-chain/builder/txBuilder";
import { TxBuilder as CChainTxBuilder } from "./transactions/c-chain/builder/txBuilder";
import { createPrimaryNetworkCoreClient, PrimaryNetworkCore, type PrimaryNetworkClientParams } from "./primaryNetworkCoreClient";

// TODO: Add proper docs for all clients, methods, and params
export class PrimaryNetwork {
    coreClient: PrimaryNetworkCore;
    pChain: PChainTxBuilder;
    cChain: CChainTxBuilder;

    constructor(params: PrimaryNetworkClientParams) {
        const coreClient = createPrimaryNetworkCoreClient(params)
        const pChain = PChainTxBuilder.newClient(coreClient)
        const cChain = CChainTxBuilder.newClient(coreClient)

        this.coreClient = coreClient
        this.pChain = pChain
        this.cChain = cChain
    }

    linkPrivateKeys(privateKeys: string[]) {
        this.coreClient.linkPrivateKeys(privateKeys)
    }
}

export function createPrimaryNetworkClient(params: PrimaryNetworkClientParams) {
    return new PrimaryNetwork(params)
}
