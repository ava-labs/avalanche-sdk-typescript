import { Context as ContextType, pvm, evm }  from '@avalabs/avalanchejs';
import { Wallet } from "./wallet";
import { getNodeUrlFromChain } from './utils';

export class PrimaryNetworkCore {
    nodeUrl: string;
    wallet: Wallet;
    context: ContextType.Context | undefined;
    pvmRpc: pvm.PVMApi;
    evmRpc: evm.EVMApi;

    constructor(params: {
        nodeUrl: `http${'s' | ''}://${string}`,
        wallet: Wallet,
    }) {
        this.nodeUrl = getNodeUrlFromChain(params.nodeUrl)
        this.wallet = params.wallet
        this.pvmRpc = new pvm.PVMApi(this.nodeUrl)
        this.evmRpc = new evm.EVMApi(this.nodeUrl)
    }

    /**
     * Initializes the context when required if it is not already initialized.
     * @returns The context.
    */
    async initializeContextIfNot() {
        if (!this.context) {
            this.context = await ContextType.getContextFromURI(this.nodeUrl);
        }
        return this.context;
    }

    linkPrivateKeys(privateKeys: string[]) {
        this.wallet = new Wallet({
            nodeUrl: this.nodeUrl,
            privateKeys,
        })
    }
}

export function createPrimaryNetworkCoreClient({
    nodeUrlOrChain,
    privateKeys,
}: {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    privateKeys?: string[] | undefined,
}) {
    const wallet = new Wallet({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        privateKeys,
    });
    return new PrimaryNetworkCore({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        wallet,
    })
}
