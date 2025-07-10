import { Context as ContextType, pvm, evm, avm }  from '@avalabs/avalanchejs';
import { Wallet } from "./wallet";
import { getNodeUrlFromChain } from './utils';

export class PrimaryNetworkCore {
    nodeUrl: string;
    wallet: Wallet | undefined;
    context: ContextType.Context | undefined;
    pvmRpc: pvm.PVMApi;
    evmRpc: evm.EVMApi;
    avmRpc: avm.AVMApi;

    constructor(params: {
        nodeUrl: `http${'s' | ''}://${string}`,
        wallet: Wallet | undefined,
    }) {
        this.nodeUrl = getNodeUrlFromChain(params.nodeUrl)
        this.wallet = params.wallet
        this.pvmRpc = new pvm.PVMApi(this.nodeUrl)
        this.evmRpc = new evm.EVMApi(this.nodeUrl)
        this.avmRpc = new avm.AVMApi(this.nodeUrl)
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
    wallet,
}: {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    wallet?: Wallet,
}) {
    return new PrimaryNetworkCore({
        nodeUrl: getNodeUrlFromChain(nodeUrlOrChain),
        wallet,
    })
}
